import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { take } from 'rxjs';
import { NavStatus } from 'src/app/enums/nav-status';
import { Ship } from 'src/app/interfaces/ship';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-fuel',
  template: `
    <div class="ml-4 mb-4">
      <h2 class="text-xl" title="Recent Consumption: {{ ship.fuel.consumed.amount }} ({{ ship.fuel.consumed.timestamp }})">Fuel:</h2>
      <ul class="mb-6 flex w-full" title="{{ship.fuel.current}} / {{ship.fuel.capacity}}">
          <li *ngFor="let c of fuelPips" [class]="pipsFilled >= c ? 'bg-teal' : ''" class="w-[10%] h-6 border-2 border-teal mr-1"></li>
      </ul>
      <button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="refuel()" *ngIf="docked && ship.fuel.current != ship.fuel.capacity && marketplaceWaypoint">Refuel</button>
    </div>
  `,
  styles: [
  ]
})
export class FuelComponent implements OnInit, OnChanges {
  @Input() ship!: Ship;
  @Input() marketplaceWaypoint: boolean = false;
  @Output() updateShip = new EventEmitter<Ship>();
 
  pips = 20;
  fuelPips = [...Array(this.pips).keys()];
  pipsFilled = 0;

  docked = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.docked = this.ship.nav.status == NavStatus.DOCKED;
  
    this.pipsFilled = Math.floor(this.ship.fuel.current / ((this.ship.fuel.capacity) / this.pips));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.docked = this.ship.nav.status == NavStatus.DOCKED;
  
    this.pipsFilled = Math.floor(this.ship.fuel.current / ((this.ship.fuel.capacity) / this.pips));
  }

  refuel(): void {
    this.api.postRefuel(this.ship).pipe(
      take(1)
    ).subscribe(
      _ => this.updateShip.emit(this.ship)
    )
  }
}
