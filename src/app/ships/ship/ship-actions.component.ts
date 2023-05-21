import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { MessageType } from 'src/app/enums/message-type';
import { NavStatus } from 'src/app/enums/nav-status';
import { WaypointsTraits } from 'src/app/enums/waypoints-traits';
import { Extract } from 'src/app/interfaces/extract';
import { Nav } from 'src/app/interfaces/nav';
import { Refuel } from 'src/app/interfaces/refuel';
import { Ship } from 'src/app/interfaces/ship';
import { Survey } from 'src/app/interfaces/survey';
import { SurveyAction } from 'src/app/interfaces/survey-action';
import { Transit } from 'src/app/interfaces/transit';
import { Waypoint } from 'src/app/interfaces/waypoint';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'app-ship-actions',
  template: `
    <ul class="flex">
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('move')" *ngIf="docked" title="Orbit waypoint">Orbit</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('move')" *ngIf="orbiting" title="Dock at waypoint">Dock</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('transit', {waypoint: null})" *ngIf="orbiting" title="Move to waypoint">Transit</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('refuel')" *ngIf="docked && ship.fuel.current != ship.fuel.capacity && marketplaceWaypoint">Refuel</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('survey')" *ngIf="orbiting && miningWaypoint && canSurvey">Survey</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('mine')" *ngIf="orbiting && miningWaypoint && canMine">Mine</button></li>
    </ul>
    <app-transit *ngIf="showTransit" [ship]="ship" (tranistEvent)="action('transit', {waypoint: $event})"></app-transit>
    <app-mine *ngIf="showMiner" [ship]="ship" (mineEmitter)="updateShip(ship)" (mineClose)="showMiner=false"></app-mine>
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

  canSurvey: boolean = false;
  canMine: boolean = false;

  surveys: Survey[] = [];
  showMiner: boolean = false;

  showTransit: boolean = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() ship!: Ship;
  @Output() shipAction: EventEmitter<{ship: Ship, optional?:{surveys?:Survey[]}}> = new EventEmitter<{ship: Ship, optional?:{surveys?:Survey[]}}>();

  constructor(private api: ApiService, public messageService: MessageService) {}

  ngOnInit(): void {
    this.hasTraits(this.miningTraits).subscribe(value => this.miningWaypoint = value);
    this.hasTraits([WaypointsTraits.MARKETPLACE]).subscribe(value =>this.marketplaceWaypoint = value);
    this.docked = this.ship.nav.status == NavStatus.DOCKED;
    this.orbiting = this.ship.nav.status == NavStatus.IN_ORBIT;

    for (let mount of this.ship.mounts) {
      if (mount.symbol.includes("MINING_LASER")) {
        this.canMine = true;
      }
      if (mount.symbol.includes("SURVEYOR")) {
        this.canSurvey = true;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * Perform an action
   */
  action(action: string, options?: {waypoint?: Waypoint | null}) {
    // TODO handle response about the move
    // TODO change to use enum
    if (action == "mine") {
      this.showMiner = true;
    }

    if (action == "move") {
      if (this.ship.nav.status == NavStatus.DOCKED) {
        this.api.post<Nav>(
          `my/ships/${this.ship.symbol}/orbit`,
          {}
        ).pipe(
            takeUntil(this.destroy$)
        ).subscribe(
          _ => this.shipAction.emit({ship: this.ship})
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
          _ => this.shipAction.emit({ship: this.ship})
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
        _ => this.shipAction.emit({ship: this.ship})
      )
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
        this.showTransit = !this.showTransit;
        return;
      }

      this.api.post<Transit>(
        `my/ships/${this.ship.symbol}/navigate`,
        {
          'waypointSymbol': waypoint.symbol 
        }
      ).pipe(
        takeUntil(this.destroy$)
      ).subscribe(
        _ => this.shipAction.emit({ship: this.ship})
      );
    }
  }

  updateShip(ship: Ship) {
    this.shipAction.emit({ship: ship});
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
