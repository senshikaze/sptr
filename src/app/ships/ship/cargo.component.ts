import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NavStatus } from 'src/app/enums/nav-status';
import { Inventory } from 'src/app/interfaces/inventory';
import { Ship } from 'src/app/interfaces/ship';
import { SellComponent } from './actions/sell/sell.component';
import { ModalService } from 'src/app/services/modal.service';
import { Observable } from 'rxjs';
import { Waypoint } from 'src/app/interfaces/waypoint';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-shipcargo',
  template: `
    <div class="ml-4">
      <div class="mb-4">
        <h2 class="text-xl">Cargo ({{ ship.cargo.units }} / {{ ship.cargo.capacity }})</h2>
        <table class="table-auto" *ngIf="ship.cargo.units > 0">
            <thead>
                <tr>
                    <th class="px-4 text-left">Name</th>
                    <th class="px-4 text-left">Units</th>
                </tr>
            </thead>
            <tbody>
                <tr class="odd:bg-gray-hover" *ngFor="let cargo of ship.cargo.inventory" title="{{ cargo.description }}">
                    <td class="px-4 py-2 text-left m-2">{{ cargo.name }}</td>
                    <td class="px-4 py-2 text-left m-2">{{ cargo.units }}</td>
                    <td><button *ngIf="ship.nav.status == navStatus.DOCKED && marketplaceWaypoint" class="border-2 border-teal p-2 m-2 bg-gray-dark hover:text-gray" (click)="sell(cargo)">Sell</button></td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  `
})
export class ShipCargoComponent implements OnInit, OnChanges{
  navStatus = NavStatus;
  @Input() ship!: Ship;
  @Input() marketplaceWaypoint!: boolean;
  @Output() updateShip: EventEmitter<Ship> = new EventEmitter<Ship>();

  docked = false;

  constructor(public api: ApiService, public modalService: ModalService) {}
  ngOnInit(): void {
    this.docked = this.ship.nav.status == NavStatus.DOCKED
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.docked = this.ship.nav.status == NavStatus.DOCKED
  }

  sell(cargo: Inventory) {
    this.modalService.addModal(
      SellComponent,
      {
        ship: this.ship,
        inventory: cargo,
        update: this.updateShip
      }
    )
  }
}
