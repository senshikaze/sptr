import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject, map, of, scan, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { MessageType } from 'src/app/enums/message-type';
import { NavStatus } from 'src/app/enums/nav-status';
import { WaypointsTraits } from 'src/app/enums/waypoints-traits';
import { Nav } from 'src/app/interfaces/nav';
import { Refuel } from 'src/app/interfaces/refuel';
import { Ship } from 'src/app/interfaces/ship';
import { Survey } from 'src/app/interfaces/survey';
import { Waypoint } from 'src/app/interfaces/waypoint';
import { ModalDirective } from 'src/app/modal.directive';
import { MineComponent } from './actions/mine/mine.component';
import { TransitComponent } from './actions/transit/transit.component';
import { WaypointType } from 'src/app/enums/waypoint-type';
import { JumpComponent } from './actions/jump/jump.component';
import { ScanSystems } from 'src/app/interfaces/scan-systems';
import { ScanWaypoints } from 'src/app/interfaces/scan-waypoints';

@Component({
  selector: 'app-ship-actions',
  template: `
    <ul class="flex">
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('scan', {scanType: 'systems'})" *ngIf="orbiting && canScan" title="Scan Systems">Scan Systems</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('scan', {scanType: 'waypoints'})" *ngIf="(docked || orbiting) && canScan" title="Scan Waypoints">Scan Waypoints</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('move')" *ngIf="docked" title="Orbit waypoint">Orbit</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('move')" *ngIf="orbiting" title="Dock at waypoint">Dock</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('transit')" *ngIf="orbiting" title="Move to waypoint">Transit</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('jump')" *ngIf="canJump$ | async" title="Jump to system">Jump</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('warp')" *ngIf="!docked && canWarp" title="Warp to system">Warp</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('refuel')" *ngIf="docked && ship.fuel.current != ship.fuel.capacity && marketplaceWaypoint">Refuel</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('survey')" *ngIf="orbiting && miningWaypoint && canSurvey">Survey</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('mine')" *ngIf="orbiting && miningWaypoint && canMine">Mine</button></li>
    </ul>
  `
})
export class ShipActionsComponent implements OnInit, OnDestroy {
  navStatus = NavStatus;

  waypointsTraits = WaypointsTraits;
  miningTraits = [
    WaypointsTraits.COMMON_METAL_DEPOSITS,
    WaypointsTraits.MINERAL_DEPOSITS,
    WaypointsTraits.PRECIOUS_METAL_DEPOSITS,
    WaypointsTraits.RARE_METAL_DEPOSITS,
  ];
  miningWaypoint: boolean = false;
  marketplaceWaypoint: boolean = false;

  docked: boolean = false;
  orbiting: boolean = false;

  canScan: boolean = false;
  canSurvey: boolean = false;
  canMine: boolean = false;
  canJump$: Observable<boolean> = of(false);
  canWarp: boolean = false;

  surveys: Survey[] = [];

  private destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() ship!: Ship;
  @Output() updateShip: EventEmitter<Ship> = new EventEmitter<Ship>();

  constructor(private api: ApiService, public messageService: MessageService, public modalService: ModalService) {}

  ngOnInit(): void {
    this.hasTraits(this.miningTraits).subscribe(value => this.miningWaypoint = value);
    this.hasTraits([WaypointsTraits.MARKETPLACE]).subscribe(value =>this.marketplaceWaypoint = value);
    this.docked = this.ship.nav.status == NavStatus.DOCKED;
    this.orbiting = this.ship.nav.status == NavStatus.IN_ORBIT;

    this.canMine = this.ship.mounts.filter(m => m.symbol.includes("MINING_LASER")).length > 0;
    this.canSurvey = this.ship.mounts.filter(m => m.symbol.includes("SURVEYOR")).length > 0;
    this.canScan = this.ship.mounts.filter(m => m.symbol.includes("SENSOR")).length > 0;

    /**
     * Check if we can Jump
     * Jumping is instant and requires one of:
     * * being at a jump gate (orbiting or docked)
     * * having a jump drive
     * * * (technically must have antimatter in the hold, but we allow the api to error on that)
     */
    this.canJump$ = this.api.getWaypoint(
      this.ship.nav.systemSymbol,
      this.ship.nav.waypointSymbol
    ).pipe(
      map(waypoint => {
        if (this.ship.nav.status == NavStatus.DOCKED) {
          return false;
        }
        return this.ship.modules.filter(m => m.symbol.includes("JUMP")).length > 0 || waypoint.type == WaypointType.JUMP_GATE;
      })
    );
    /** 
     * Check if we can Warp
     * * Warping takes time and requires:
     * * having a warp drive
     * * (technically must have antimatter in the hold like jumping)
     */
    this.canWarp = this.ship.modules.filter(m => m.symbol.includes("WARP")).length > 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * Perform an action
   */
  action(action: string, options?: {waypoint?: Waypoint | null, scanType?: string}) {
    // TODO handle response about the move
    // TODO change to use enum
    if (action == "jump") {
      this.modalService.addModal(
        JumpComponent,
        {
          ship: this.ship,
          updateShip: this.updateShip
        }
      )
    }

    if (action == "mine") {
      this.modalService.addModal(
        MineComponent,
        {
          ship: this.ship,
          updateShip: this.updateShip
        }
      );
    }

    if (action == "move") {
      if (this.ship.nav.status == NavStatus.DOCKED) {
        this.api.post<Nav>(
          `my/ships/${this.ship.symbol}/orbit`,
          {}
        ).pipe(
            takeUntil(this.destroy$)
        ).subscribe(
          _ => this.updateShip.emit(this.ship)
        );
        return;
      }
      if (this.ship.nav.status == NavStatus.IN_ORBIT) {
        this.api.post<Nav>(
          `my/ships/${this.ship.symbol}/dock`,
          {}
        ).pipe(
          takeUntil(this.destroy$)
        ).subscribe(
          _ => this.updateShip.emit(this.ship)
        );
        return;
      }
      if (this.ship.nav.status == NavStatus.IN_TRANSIT) {
        // do nothing
        return;
      }
    }

    if (action == "refuel") {
      this.api.post<Refuel>(
        `/my/ships/${this.ship.symbol}/refuel`
      ).pipe(
        takeUntil(this.destroy$)
      ).subscribe(
        _ => this.updateShip.emit(this.ship)
      )
    }

    if (action == "scan") {
      if (options?.scanType == "systems") {
        this.api.post<ScanSystems>(
          `my/ships/${this.ship.symbol}/scan/systems`
        ).pipe(
          takeUntil(this.destroy$)
        ).subscribe(
          scan => {
            this.messageService.addMessage(
              `Scanned Systems, found ${scan.data.systems.length}.`,
              MessageType.GOOD
            )
          }
        );
      }
      if (options?.scanType == "waypoints") {
        this.api.post<ScanWaypoints>(
          `my/ships/${this.ship.symbol}/scan/waypoints`
        ).pipe(
          takeUntil(this.destroy$)
        ).subscribe(
          scan => {
            this.messageService.addMessage(
              `Scanned Waypoints, found ${scan.data.waypoints.length}.`,
              MessageType.GOOD
            )
          }
        );
      }
    }

    if (action == "survey") {
      this.api.postSurvey(this.ship).pipe(
        takeUntil(this.destroy$)
      ).subscribe(
        surveys => {
          this.surveys = surveys;
          this.messageService.addMessage(
            `Surveyed ${this.ship.nav.waypointSymbol}, found ${surveys.length} locations to mine.`,
            MessageType.GOOD
          )
        }
      )
    }

    if (action == "transit") {
      // Toggle the transit modal
      let waypoint = options?.waypoint || null;
      if (waypoint == null) {
        this.modalService.addModal(
          TransitComponent,
          {
            ship: this.ship
          }
        );
      }
    }
  }

  hasTraits(traits: WaypointsTraits[]): Observable<boolean> {
    return this.api.getWaypoint(this.ship.nav.systemSymbol, this.ship.nav.waypointSymbol).pipe(
      takeUntil(this.destroy$),
      map(waypoint => waypoint.traits.filter(
        tr => traits.map(t => t.toString()).includes(tr.symbol)
      ).length > 0
    ));
  }
}
