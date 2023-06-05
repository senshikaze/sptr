import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, Subject, map, of, take, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { MessageType } from 'src/app/enums/message-type';
import { NavStatus } from 'src/app/enums/nav-status';
import { WaypointsTraits } from 'src/app/enums/waypoints-traits';
import { RefuelTransaction } from 'src/app/interfaces/refuel';
import { Ship } from 'src/app/interfaces/ship';
import { Survey } from 'src/app/interfaces/survey';
import { Waypoint } from 'src/app/interfaces/waypoint';
import { MineComponent } from './actions/mine/mine.component';
import { ScanSystems } from 'src/app/interfaces/scan-systems';
import { ScanWaypoints } from 'src/app/interfaces/scan-waypoints';

@Component({
  selector: 'app-ship-actions',
  template: `
    <ul class="flex">
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('scan', {scanType: 'systems'})" *ngIf="orbiting && canScan" title="Scan Systems">Scan Systems</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('scan', {scanType: 'waypoints'})" *ngIf="(docked || orbiting) && canScan" title="Scan Waypoints">Scan Waypoints</button></li>
      <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('mine')" *ngIf="orbiting && miningWaypoint && canMine">Mine</button></li>
    </ul>
  `
})
export class ShipActionsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() ship!: Ship;
  @Input() marketplaceWaypoint: boolean = false;
  @Input() miningWaypoint: boolean = false;
  @Output() updateShip: EventEmitter<Ship> = new EventEmitter<Ship>();

  navStatus = NavStatus;  

  docked: boolean = false;
  orbiting: boolean = false;

  canScan: boolean = false;
  canSurvey: boolean = false;
  canMine: boolean = false;
  canJump$: Observable<boolean> = of(false);
  canWarp: boolean = false;

  surveys: Survey[] = [];

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private api: ApiService, public messageService: MessageService, public modalService: ModalService) {}

  ngOnInit(): void {
    this.docked = this.ship.nav.status == NavStatus.DOCKED;
    this.orbiting = this.ship.nav.status == NavStatus.IN_ORBIT;

    this.canMine = this.ship.mounts.filter(m => m.symbol.includes("MINING_LASER")).length > 0;
    this.canSurvey = this.ship.mounts.filter(m => m.symbol.includes("SURVEYOR")).length > 0;
    this.canScan = this.ship.mounts.filter(m => m.symbol.includes("SENSOR")).length > 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.docked = this.ship.nav.status == NavStatus.DOCKED;
    this.orbiting = this.ship.nav.status == NavStatus.IN_ORBIT;

    this.canMine = this.ship.mounts.filter(m => m.symbol.includes("MINING_LASER")).length > 0;
    this.canScan = this.ship.mounts.filter(m => m.symbol.includes("SENSOR")).length > 0;
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
    if (action == "mine") {
      this.modalService.addModal(
        MineComponent,
        {
          ship: this.ship,
          update: this.updateShip
        }
      );
    }

    if (action == "scan") {
      if (options?.scanType == "systems") {
        this.api.postScanSystems(this.ship).pipe(
          take(1)
        ).subscribe(
          scan => {
            this.messageService.addMessage(
              `Scanned Systems, found ${scan.systems.length}.`,
              MessageType.GOOD
            )
          }
        );
      }

      if (options?.scanType == "waypoints") {
        this.api.postScanWaypoints(this.ship).pipe(
          take(1)
        ).subscribe(
          scan => {
            this.messageService.addMessage(
              `Scanned Waypoints, found ${scan.waypoints.length}.`,
              MessageType.GOOD
            )
          }
        );
      }
    }
  }
}
