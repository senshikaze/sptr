import { Component, Input } from '@angular/core';
import { Ship } from 'src/app/interfaces/ship';

@Component({
  selector: 'app-shipnavigation',
  template: `
    <h2 class="text-2xl">Navigation</h2>
      <ul class="mb-6">
          <li>System: {{ ship.nav.systemSymbol }}</li>
          <li>Waypoint: {{ ship.nav.waypointSymbol }}</li>
          <li>Status: {{ ship.nav.status }}</li>
          <li>Flight Mode: {{ ship.nav.flightMode }}</li>
      </ul>
  `,
  styles: [
  ]
})
export class ShipNavigationComponent {
  @Input() ship!: Ship;
}
