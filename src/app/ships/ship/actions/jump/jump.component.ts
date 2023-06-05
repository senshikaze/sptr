import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, Subject, map, of, take, takeUntil, timer } from 'rxjs';
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
import { CooldownService, ShipCooldown } from 'src/app/services/cooldown.service';

@Component({
  selector: 'app-jump',
  templateUrl: './jump.component.html'
})
export class JumpComponent implements OnInit, OnDestroy, ModalInterface {
  data!: any;
  @Output() update: EventEmitter<any> = new EventEmitter<any>();
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

  cooldown: ShipCooldown | null = null;
  title = ""
  selected = "drive";

  page = 1;
  total = 0;
  limit = 20;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private api: ApiService, public messageService: MessageService, private cooldownService: CooldownService) {}

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

    // check to see if we are in cooldown
    // check to see if we are in cooldown
    this.cooldownService.getShipCooldown(this.data.ship.symbol).pipe(
      take(1)
    ).subscribe(
      cd => {
        if (cd != null) {
          this.cooldown = cd;
          this.title =`Cooldown expires ${DateTime.fromISO(cd.cooldown.expiration).toRelative()}`;
          timer(DateTime.fromISO(cd.cooldown.expiration).diff(DateTime.now()).milliseconds).pipe(
            take(1)
          ).subscribe(_ => {
            this.title = "";
            this.cooldown = null
          });
        }
      }
    );
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
        this.update.emit(ship);
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

  switch(tab: string): void {
    // TODO switch to an enum?
    this.selected = tab;
  }
}
