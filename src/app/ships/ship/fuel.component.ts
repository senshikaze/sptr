import { Component, Input, OnInit } from '@angular/core';
import { Ship } from 'src/app/interfaces/ship';

@Component({
  selector: 'app-fuel',
  template: `
    <div class="ml-4 mb-4">
      <h2 class="text-xl" title="Recent Consumption: {{ ship.fuel.consumed.amount }} ({{ ship.fuel.consumed.timestamp }})">Fuel:</h2>
      <ul class="mb-6 flex w-full" title="{{ship.fuel.current}} / {{ship.fuel.capacity}}">
          <li *ngFor="let c of fuelPips" [class]="pipsFilled >= c ? 'bg-teal' : ''" class="w-[10%] h-6 border-2 border-teal mr-1"></li>
      </ul>
      <span class="text-sm" *ngIf="ship.fuel.consumed.amount > 0"></span>
    </div>
  `,
  styles: [
  ]
})
export class FuelComponent implements OnInit {
  @Input() ship!: Ship;
  pips = 20;
  fuelPips = [...Array(this.pips).keys()];
  pipsFilled = 0;

  ngOnInit(): void {
    this.pipsFilled = Math.floor(this.ship.fuel.current / ((this.ship.fuel.capacity) / this.pips));
  }
}
