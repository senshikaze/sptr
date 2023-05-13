import { Component, Input } from '@angular/core';
import { Ship } from 'src/app/interfaces/ship';

@Component({
  selector: 'app-shipcargo',
  template: `
    <h2 class="text-2xl">Cargo</h2>
    <ul class="mb-6">
        <li>{{ ship.cargo.units }} / {{ ship.cargo.capacity }}</li>
        <li>{{ ship.cargo.inventory.length}}</li>
    </ul>
  `,
  styles: [
  ]
})
export class ShipCargoComponent {
  @Input() ship!: Ship;
}
