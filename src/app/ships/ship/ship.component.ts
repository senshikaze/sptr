import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subject, map, of, repeat, switchMap, take, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Ship } from 'src/app/interfaces/ship';
import { NavStatus } from 'src/app/enums/nav-status';
import { WaypointsTraits } from 'src/app/enums/waypoints-traits';
import { Waypoint } from 'src/app/interfaces/waypoint';
import { WaypointType } from 'src/app/enums/waypoint-type';

@Component({
  selector: 'app-ship',
  templateUrl: './ship.component.html'
})
export class ShipComponent implements OnInit, OnDestroy {
  navStatus = NavStatus;

  private shipSubject$: Subject<Ship> = new Subject<Ship>();
  ship$: Observable<Ship> = this.shipSubject$.asObservable();

  waypointsTraits = WaypointsTraits;
  miningTraits = [
    WaypointsTraits.COMMON_METAL_DEPOSITS,
    WaypointsTraits.MINERAL_DEPOSITS,
    WaypointsTraits.PRECIOUS_METAL_DEPOSITS,
    WaypointsTraits.RARE_METAL_DEPOSITS,
  ];
  marketplaceWaypoint = false;
  miningWaypoint = false;
  jumpGateWaypoint = false;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private api: ApiService, private router: ActivatedRoute) {}

  ngOnInit() {
    let ship$ = this.router.paramMap.pipe(
      switchMap((params: ParamMap) => 
        this.api.getShip(params.get('symbol')!).pipe(
          repeat({delay: 30000}),
          switchMap(ship => {
            this.api.getWaypoint(ship.nav.systemSymbol, ship.nav.waypointSymbol).pipe(
              take(1)
            ).subscribe(
              waypoint => {
                this.miningWaypoint = this.waypointHasTraits(waypoint, this.miningTraits);
                this.marketplaceWaypoint = this.waypointHasTraits(waypoint, [WaypointsTraits.MARKETPLACE]);
                this.jumpGateWaypoint = waypoint.type == WaypointType.JUMP_GATE;
              }
            );
            return of(ship)
          })
        )
      )
    );
    ship$.subscribe(
      ship => this.shipSubject$.next(ship)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  updateShip(ship: Ship): void {
    this.api.getShip(ship.symbol).pipe(
      take(1)
    ).subscribe(
      ship => this.shipSubject$.next(ship)
    );
  }

  waypointHasTraits(waypoint: Waypoint, traits: WaypointsTraits[]): boolean {
    return waypoint.traits.filter(
        tr => traits.map(t => t.toString()).includes(tr.symbol)
      ).length > 0;
  }
}
