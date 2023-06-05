import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DateTime, Duration } from 'luxon';
import { Subject, interval, take, takeUntil, timeInterval, timer } from 'rxjs';
import { NavStatus } from 'src/app/enums/nav-status';
import { Ship } from 'src/app/interfaces/ship';

@Component({
  selector: 'app-ship-status',
  template: `
    <span *ngIf="ship.nav.status == navStatus.DOCKED">
      Docked at <a class="hover:text-blue underline" [routerLink]="['/systems', ship.nav.systemSymbol, 'waypoints', ship.nav.waypointSymbol]">{{ ship.nav.waypointSymbol }}</a>
    </span>
    <span *ngIf="ship.nav.status == navStatus.IN_ORBIT">
      Orbiting <a class="hover:text-blue underline" [routerLink]="['/systems', ship.nav.systemSymbol, 'waypoints', ship.nav.waypointSymbol]">{{ ship.nav.waypointSymbol }}</a>
    </span>
    <span *ngIf="ship.nav.status == navStatus.IN_TRANSIT">
      In Transit to <a class="hover:text-blue underline" [routerLink]="['/systems', ship.nav.route.destination.systemSymbol, 'waypoints', ship.nav.route.destination.symbol]">{{ ship.nav.route.destination.symbol }}</a> | Estimated Arrival: <span title="{{ ship.nav.route.arrival | formatdate }}">{{ this.arrival | relativedate }}...</span>
    </span>
  `
})
export class ShipStatusComponent implements OnInit, OnDestroy {
  navStatus = NavStatus;
  @Input() ship!: Ship;
  @Output() updateShip: EventEmitter<Ship> = new EventEmitter<Ship>();

  arrival: string = "";

  private destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    if (this.ship.nav.status == NavStatus.IN_TRANSIT) {
      interval(1000).pipe(
        takeUntil(this.destroy$)
      ).subscribe(
        _ => {
          this.arrival = this.ship.nav.route.arrival;
        }
      )
      timer(DateTime.fromISO(this.ship.nav.route.arrival).diff(DateTime.now()).milliseconds).pipe(
        take(1)
      ).subscribe(
        _ => this.updateShip.emit(this.ship)
      )
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.subscribe();
  }
}
