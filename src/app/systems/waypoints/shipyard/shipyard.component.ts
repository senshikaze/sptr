import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { PurchaseShip } from 'src/app/interfaces/purchase-ship';
import { ShipYard } from 'src/app/interfaces/ship-yard';
import { Waypoint } from 'src/app/interfaces/waypoint';
import { Ship } from 'src/app/interfaces/ship';

@Component({
  selector: 'app-shipyard',
  template: `
    <div class="ml-4 mb-4" *ngIf="shipyard$ | async as shipyard">
      <div class="mb-4">
        <h2 class="text-xl">Shipyard</h2>
        <table class="table-auto">
          <thead>
            <tr>
              <th class="px-4 text-left">Name</th>
              <th class="px-4 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr class="odd:bg-gray-hover" *ngFor="let ship of shipyard.ships" title="{{ship.description}}">
              <th class="px-4 text-left">{{ ship.name }}</th>
              <th class="px-4 text-left">{{ ship.purchasePrice | number : '1.0-0' }} c</th>
              <th><button class="border-2 border-teal p-2 m-2 bg-gray-dark hover:text-gray" (click)="buy(ship.type)">Buy</button></th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ShipyardComponent implements OnInit, OnDestroy {
  @Input() waypoint!: Waypoint;
  @Input() ships$!: Observable<Ship[]>;

  shipyard$!: Observable<ShipYard>;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.shipyard$ = this.api.get<ShipYard>(
      `systems/${this.waypoint.systemSymbol}/waypoints/${this.waypoint.symbol}/shipyard`
    ).pipe(
      map(response => response.data)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  buy(shipType: string) {
    this.api.post<PurchaseShip>(
      `my/ships`,
      {
        'shipType': shipType,
        'waypointSymbol': this.waypoint.symbol
      }
    ).pipe(
      takeUntil(this.destroy$),
      map(response => response.data)
    ).subscribe(
      purchase => this.router.navigate(['/ships', purchase.ship.symbol])
    );
  }
}
