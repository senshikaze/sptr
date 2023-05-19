import { Component, Input } from '@angular/core';
import { Ship } from 'src/app/interfaces/ship';

@Component({
  selector: 'app-shipcrew',
  template: `
  <div class="ml-4 mb-4">
    <h2 class="text-xl">Crew</h2>
    <ul>
        <li>{{ ship.crew.current }} / {{ ship.crew.capacity }}</li>
        <li>Required: {{ ship.crew.required }}</li>
        <li>Rotation: {{ ship.crew.rotation }}</li>
        <li>Morale {{ ship.crew.morale }}</li>
        <li>Wages: {{ ship.crew.wages }}</li>
    </ul>
  </div>
  `,
  styles: [
  ]
})
export class ShipCrewComponent {
  @Input() ship!: Ship;
}
