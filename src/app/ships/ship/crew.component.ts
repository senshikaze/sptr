import { Component, Input } from '@angular/core';
import { Ship } from 'src/app/interfaces/ship';

@Component({
  selector: 'app-shipcrew',
  template: `
  <div class="ml-4 mb-4">
    <h2 class="text-xl">Crew: {{ ship.crew.current }} / {{ ship.crew.capacity }}</h2>
    <ul>
        <li>Required: {{ ship.crew.required }}</li>
        <li>Rotation: {{ ship.crew.rotation }}</li>
        <li>Morale <span [ngClass]="ship.crew.morale | condition">{{ ship.crew.morale }}</span></li>
        <li>Wages: {{ ship.crew.wages }} c</li>
    </ul>
  </div>
  `,
  styles: [
  ]
})
export class ShipCrewComponent {
  @Input() ship!: Ship;
}
