import { Component, Input } from '@angular/core';
import { NavStatus } from 'src/app/enums/nav-status';
import { Ship } from 'src/app/interfaces/ship';

@Component({
  selector: 'app-shipcargo',
  template: `
    <div class="ml-4">
      <div class="mb-4">
        <h2 class="text-xl">Cargo ({{ ship.cargo.units }} / {{ ship.cargo.capacity }})</h2>
        <table class="table-auto">
            <thead>
                <tr>
                    <th class="px-4 text-left">Name</th>
                    <th class="px-4 text-left">Units</th>
                </tr>
            </thead>
            <tbody>
                <tr class="odd:bg-gray-hover" *ngFor="let cargo of ship.cargo.inventory" title="{{ cargo.description }}">
                    <td class="px-4 py-2 text-left">{{ cargo.name }}</td>
                    <td class="px-4 py-2 text-left">{{ cargo.units }}</td>
                    <td><button *ngIf="ship.nav.status == navStatus.DOCKED" class="border-2 border-teal p-2 m-2 bg-gray-dark hover:text-gray" (click)="sell(cargo.symbol)">Sell</button></td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class ShipCargoComponent {
  navStatus = NavStatus;
  @Input() ship!: Ship;

  sell(cargoSymbol: string) {

  }
}
