import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { Subject, interval, takeUntil, timeInterval, timer } from 'rxjs';
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
      In Transit to <a class="hover:text-blue underline" [routerLink]="['/systems', ship.nav.route.destination.systemSymbol, 'waypoints', ship.nav.route.destination.symbol]">{{ ship.nav.route.destination.symbol }}</a> | Estimated Arrival: <span title="{{ ship.nav.route.arrival | formatdate }}">{{ ship.nav.route.arrival | relativedate }}...</span>
    </span>
  `,
  styles: [
  ]
})
export class ShipStatusComponent implements OnInit, OnDestroy {
  navStatus = NavStatus;
  @Input() ship!: Ship;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    if (this.ship.nav.status == NavStatus.IN_TRANSIT) {
      interval(1000).pipe(
        takeUntil(this.destroy$)
      ).subscribe(
        _ => {
          let arrival = DateTime.fromISO(this.ship.nav.route.arrival);
          let now = DateTime.now()
          this.ship.nav.route.arrival = arrival.diff(now, 'seconds').toISO() ?? this.ship.nav.route.arrival;
        }
      )
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.subscribe();
  }
}
