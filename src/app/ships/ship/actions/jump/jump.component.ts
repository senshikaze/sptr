import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, Subject, map, take, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'src/app/services/message.service';
import { MessageType } from 'src/app/enums/message-type';
import { ModalInterface } from 'src/app/interfaces/modal-interface';
import { Ship } from 'src/app/interfaces/ship';
import { System } from 'src/app/interfaces/system';
import { Waypoint } from 'src/app/interfaces/waypoint';
import { WaypointType } from 'src/app/enums/waypoint-type';
import { JumpGate } from 'src/app/interfaces/jump-gate';
import { ModuleSymbols } from 'src/app/enums/module-symbols';

@Component({
  selector: 'app-jump',
  template: `
    <div class="fixed min-h-full min-w-full inset-0 bg-opacity-80 bg-gray-dark backdrop-blur-sm" (click)="closeEvent.emit(true)">
      <div class="relative w-3/12 h-5/6 border-2 border-teal mx-auto my-32 p-8 bg-gray-dark max-h-1/2 overflow-scroll" (click)="$event.stopPropagation()" *ngIf="data.ship && systemsShip$ | async as systemShip">
        <div class="mb-8" *ngIf="systems$ | async as systems">
          <h2 class="text-xl">Select System to start Jump</h2>
          <ul>
            <li class="px-4 cursor-pointer odd:bg-gray-hover" *ngFor="let system of systems" (click)="jump(data.ship, system.symbol)" [ngClass]="system | inRange : data.ship:systemShip">
              {{system.symbol}} ({{system.type}})
            </li>
          </ul>
          <app-paginator [limit]="limit" [page]="page" [total]="total" (pageChangeEvent)="changeSystemsPage($event)"></app-paginator>
        </div>
        <div class="mb-8" *ngIf="jumpSystems$ | async as systems">
          <h2 class="text-xl">Select System to start Jump</h2>
          <ul>
            <li class="px-4 cursor-pointer odd:bg-gray-hover" *ngFor="let system of systems" (click)="jump(data.ship, system.symbol)">
              {{system.symbol}} ({{system.type}})
            </li>
          </ul>
        </div>
        <button class="absolute right-2 bottom-2 border-2 border-teal p-2 m-2 bg-gray-dark hover:text-gray" (click)="closeEvent.emit(true)">Cancel</button>
      </div>
    </div>
  `
})
export class JumpComponent implements OnInit, OnDestroy, ModalInterface {
  data!: any;
  @Output() updateShip: EventEmitter<Ship> = new EventEmitter<Ship>();
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  jumpModules: ModuleSymbols[] = [
    ModuleSymbols.MODULE_JUMP_DRIVE_I,
    ModuleSymbols.MODULE_JUMP_DRIVE_II,
    ModuleSymbols.MODULE_JUMP_DRIVE_III
  ];

  systemsShip$!: Observable<System>;
  systems$!: Observable<System[]>;
  jumpSystems$!: Observable<System[]>;
  waypoint$!: Observable<Waypoint>;

  page = 1;
  total = 0;
  limit = 20;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private api: ApiService, public messageService: MessageService) {}

  ngOnInit(): void {
    if (!this.data.ship) {
      this.closeEvent.emit(true);
    }

    this.waypoint$ = this.api.getWaypoint(
      this.data.ship.nav.systemSymbol,
      this.data.ship.nav.waypointSymbol
    );

    // get the system that the ship is in
    this.systemsShip$ = this.api.getSystem(this.data.ship.nav.systemSymbol);
  
    // We need to find the range of this jump
    if (this.hasModules(this.jumpModules, this.data.ship)) {
      this.systems$ = this.api.getSystems(this.limit, this.page).pipe(
        map(response => {
          this.page = response.meta.page;
          this.total = response.meta.total;
          return response.data.filter(s => s.symbol != this.data.ship.nav.systemSymbol)
        })
      );
    }

    // Distance from waypoint if using a jump gate
    this.waypoint$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(waypoint => {
      if (waypoint.type == WaypointType.JUMP_GATE) {
        this.jumpSystems$ = this.api.get<JumpGate>(
          `systems/${waypoint.systemSymbol}/waypoints/${waypoint.symbol}/jump-gate`
        ).pipe(
          map(response => response.data.connectedSystems)
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  jump(ship: Ship, systemSymbol: string): void {
    this.api.postJump(ship, systemSymbol).pipe(
      take(1)
    ).subscribe(
      jumpAction => {
        this.messageService.addMessage(
          `Jumped to system ${jumpAction.nav.systemSymbol}. Cooldown refreshes ${DateTime.fromISO(jumpAction.cooldown.expiration).toRelative()}`,
          MessageType.GOOD
        );
        this.updateShip.emit(ship);
        this.closeEvent.emit(true);
      }
    )
  }

  changeSystemsPage(event: {newPage: number}): void {
    this.systems$ = this.api.getSystems(this.limit, event.newPage).pipe(
      map(response => {
        this.page = response.meta.page;
        this.total = response.meta.total;
        return response.data
      })
    );
  }

  hasModules(modules: ModuleSymbols[], ship: Ship): boolean {
    return ship.modules.filter(
      mo => modules.map(m => m.toString()).includes(mo.symbol)
    ).length > 0;
  }
}
