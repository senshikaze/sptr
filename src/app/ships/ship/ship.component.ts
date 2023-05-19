import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription, map, switchMap, take } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { Ship } from 'src/app/interfaces/ship';
import { NavStatus } from 'src/app/enums/nav-status';
import { Nav } from 'src/app/interfaces/nav';

@Component({
  selector: 'app-ship',
  templateUrl: './ship.component.html'
})
export class ShipComponent implements OnInit, OnDestroy {
  navStatus = NavStatus;
  ship$!: Observable<Ship>;

  private subscription: Subscription = new Subscription();

  constructor(private api: ApiService, private router: ActivatedRoute) {}

  ngOnInit() {
    this.ship$ = this.router.paramMap.pipe(
      switchMap((params: ParamMap) => 
        this.api.getShip(params.get('symbol')!)
      )
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Move the ship between orbit and docked at waypoint
   */
  move(ship: Ship) {
    // TODO handle response about the move
    if (ship.nav.status == NavStatus.DOCKED) {
      this.subscription.add(this.api.post<Nav>(
        `my/ships/${ship.symbol}/orbit`,
        {}
      ).subscribe(
        _ => this.ship$ = this.api.getShip(ship.symbol)
      ));
      return;
    }
    if (ship.nav.status == NavStatus.IN_ORBIT) {
      this.subscription.add(this.api.post<Nav>(
        `my/ships/${ship.symbol}/dock`,
        {}
      ).subscribe(
        _ => this.ship$ = this.api.getShip(ship.symbol)
      ));
      return;
    }
    if (ship.nav.status == NavStatus.IN_TRANSIT) {
      // do nothing
      return;
    }
  }

  refuel(ship: Ship) {

  }

  transit(ship: Ship) {
    // TODO modal with waypoint selector
  }

}
