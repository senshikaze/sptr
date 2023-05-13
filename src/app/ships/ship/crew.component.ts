import { Component, Input } from '@angular/core';
import { Ship } from 'src/app/interfaces/ship';

@Component({
  selector: 'app-shipcrew',
  template: `
  <h2 class="text-2xl">Crew</h2>
  <ul class="mb-6">
      <li>{{ ship.crew.current }} / {{ ship.crew.capacity }}</li>
      <li>Required: {{ ship.crew.required }}</li>
      <li>Rotation: {{ ship.crew.rotation }}</li>
      <li>Morale {{ ship.crew.morale }}</li>
      <li>Wages: {{ ship.crew.wages }}</li>
  </ul>
  `,
  styles: [
  ]
})
export class ShipCrewComponent {
  @Input() ship!: Ship;
}
