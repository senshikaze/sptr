import { Component, Input, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { ShipYard } from 'src/app/interfaces/ship-yard';
import { Waypoint } from 'src/app/interfaces/waypoint';

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
export class ShipyardComponent implements OnInit {
  @Input() waypoint!: Waypoint;

  shipyard$!: Observable<ShipYard>;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.shipyard$ = this.api.get<ShipYard>(
      `systems/${this.waypoint.systemSymbol}/waypoints/${this.waypoint.symbol}/shipyard`
    ).pipe(
      map(response => response.data)
    );
  }

  buy(shipType: string) {

  }
}
