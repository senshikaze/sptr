import { Component, Input } from '@angular/core';
import { Ship } from 'src/app/interfaces/ship';

@Component({
  selector: 'app-shipcrew',
  template: `
  <div class="ml-4 mb-4">
    <h2 class="text-xl cursor-pointer" (click)="toggleShow()">Crew {{show ? "⌄" : ">"}}</h2>
    <div *ngIf="show">
    <div class="" *ngIf="ship.crew.required == 0; else elseBlock">
      <h2 class="text-base">Not Applicable</h2>
    </div>
    <ng-template #elseBlock>
    <div class="ml-4 mb-4" >
      <h2 class="text-xl">{{ ship.crew.current }} / {{ ship.crew.capacity }}</h2>
      <ul>
          <li>Required: {{ ship.crew.required }}</li>
          <li>Rotation: {{ ship.crew.rotation }}</li>
          <li>Morale <span [ngClass]="ship.crew.morale | condition">{{ ship.crew.morale }}</span></li>
          <li>Wages: {{ ship.crew.wages }} c</li>
      </ul>
    </div>
    </ng-template>
    </div>
  </div>
  `,
  styles: [
  ]
})
export class ShipCrewComponent {
  @Input() ship!: Ship;
  show: boolean = false;

  toggleShow() {
    this.show = !this.show;
  }
}
