import { Component, Input } from '@angular/core';
import { Ship } from 'src/app/interfaces/ship';

@Component({
  selector: 'app-shipregistration',
  template: `
    <h2 class="text-2xl">Registration Information</h2>
        <ul class="mb-6">
            <li>Faction: {{ ship.registration.factionSymbol }}</li>
            <li>Role: {{ ship.registration.role }}</li>
        </ul>
  `,
  styles: [
  ]
})
export class ShipRegistrationComponent {
  @Input() ship!: Ship;
}
