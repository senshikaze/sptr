import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject, take } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { NavStatus } from 'src/app/enums/nav-status';
import { Ship } from 'src/app/interfaces/ship';
import { Survey } from 'src/app/interfaces/survey';
import { Waypoint } from 'src/app/interfaces/waypoint';
import { TransitComponent } from './actions/transit/transit.component';
import { JumpComponent } from './actions/jump/jump.component';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-ship-move-actions',
  template: `
    <ul class="flex">
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('orbit')" *ngIf="docked" title="Orbit waypoint">Orbit</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('dock')" *ngIf="orbiting" title="Dock at waypoint">Dock</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('transit')" *ngIf="orbiting" title="Move to waypoint">Transit</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('jump')" *ngIf="canJump" title="Jump to system">Jump</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('warp')" *ngIf="!docked && canWarp" title="Warp to system">Warp</button></li>
    </ul>
  `
})
export class ShipMoveActionsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() ship!: Ship;
  @Input() jumpGateWaypoint: boolean = false;
  @Output() updateShip: EventEmitter<Ship> = new EventEmitter<Ship>();

  navStatus = NavStatus;

  docked: boolean = false;
  orbiting: boolean = false;

  canJump: boolean = false;
  canWarp: boolean = false;

  surveys: Survey[] = [];

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private api: ApiService, public messageService: MessageService, public modalService: ModalService) {}

  ngOnInit(): void {
    this.docked = this.ship.nav.status == NavStatus.DOCKED;
    this.orbiting = this.ship.nav.status == NavStatus.IN_ORBIT;

    /**
     * Check if we can Jump
     * Jumping is instant and requires one of:
     * * being at a jump gate (orbiting or docked)
     * * having a jump drive
     * * * (technically must have antimatter in the hold, but we allow the api to error on that)
     * * * * (lol, they haven't implemented that yet 2023-05-25)
     */
    this.canJump = (this.ship.nav.status == NavStatus.IN_ORBIT && this.ship.modules.filter(m => m.symbol.includes("WARP")).length > 0) || this.jumpGateWaypoint;
    /** 
     * Check if we can Warp
     * * Warping takes time and requires:
     * * having a warp drive
     * * (technically must have antimatter in the hold like jumping)
     */
    this.canWarp = this.ship.nav.status == NavStatus.IN_ORBIT && this.ship.modules.filter(m => m.symbol.includes("WARP")).length > 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.docked = this.ship.nav.status == NavStatus.DOCKED;
    this.orbiting = this.ship.nav.status == NavStatus.IN_ORBIT;
    this.canJump = (this.ship.nav.status == NavStatus.IN_ORBIT && this.ship.modules.filter(m => m.symbol.includes("WARP")).length > 0) || this.jumpGateWaypoint;
    this.canWarp = this.ship.nav.status == NavStatus.IN_ORBIT && this.ship.modules.filter(m => m.symbol.includes("WARP")).length > 0;
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
          update: this.updateShip
        }
      )
    }

    if (action == "orbit") {
      this.api.postOrbit(this.ship).pipe(
        take(1)
      ).subscribe(
        _ => this.updateShip.emit(this.ship)
      );
    }

    if (action == "dock") {
      this.api.postDock(this.ship).pipe(
        take(1)
      ).subscribe(
        _ => this.updateShip.emit(this.ship)
      );
    }

    if (action == "transit") {
      // Toggle the transit modal
      let waypoint = options?.waypoint || null;
      if (waypoint == null) {
        this.modalService.addModal(
          TransitComponent,
          {
            ship: this.ship,
            update: this.updateShip
          }
        );
      }
    }
  }
}
