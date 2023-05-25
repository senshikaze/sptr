import { Component, Input } from '@angular/core';
import { Ship } from 'src/app/interfaces/ship';

@Component({
  selector: 'app-shipconfiguration',
  template: `
  <div class="ml-4 mb-4">
    <h2 class="text-xl cursor-pointer" (click)="toggleShow()">Configuration {{show ? "⌄" : ">"}}</h2>
    <div *ngIf="show">
    <div class="mb-2">
        <h2 class="text-xl">{{ ship.frame.name }} <span class="text-xs">({{ship.frame.symbol}})</span></h2>
        <ul>
            <li>{{ ship.frame.description }}</li>
            <li>Condition: <span [ngClass]="ship.frame.condition | condition">{{ ship.frame.condition }}</span></li>
            <li>Module Slots: {{ ship.frame.moduleSlots }}</li>
            <li>Fuel Capacity {{ ship.frame.fuelCapacity }}</li>
            <li><em class="text-sm italic">Requirements: power: {{ ship.frame.requirements.power }} | crew: {{ship.frame.requirements.crew}}</em></li>
        </ul>
    </div>
    <div class="mb-2">
        <h2 class="text-xl">{{ ship.reactor.name }} <span class="text-xs">({{ship.reactor.symbol}})</span></h2>
        <ul>
            <li>{{ ship.reactor.description }}</li>
            <li>Condition: <span [ngClass]="ship.reactor.condition | condition">{{ ship.reactor.condition }}</span></li>
            <li>Power Output: {{ ship.reactor.powerOutput }}</li>
            <li><em class="text-sm italic">Requirements: power: {{ ship.reactor.requirements.power }} | crew: {{ship.reactor.requirements.crew}}</em></li>
        </ul>
    </div>
    <div class="mb-2">
        <h2 class="text-2xl">{{ ship.engine.name }} <span class="text-xs">({{ship.engine.symbol}})</span></h2>
        <ul>
            <li>{{ ship.engine.description }}</li>
            <li>Condition: <span [ngClass]="ship.engine.condition | condition">{{ ship.engine.condition }}</span></li>
            <li>Speed: {{ ship.engine.speed }}</li>
            <li><em class="text-sm italic">Requirements: power: {{ ship.engine.requirements.power }} | crew: {{ship.engine.requirements.crew}}</em></li>
        </ul>
    </div>
    <div class="mb-2">
        <h2 class="text-2xl">Modules ({{ ship.modules.length}} / {{ ship.frame.moduleSlots }})</h2>
        <table class="table-auto">
            <thead>
                <tr>
                    <th class="px-4 text-left">Name</th>
                    <th class="px-4 text-left">Range</th>
                    <th class="px-4 text-left">Capacity</th>
                    <th class="px-4 text-left">Requirements</th>
                </tr>
            </thead>
            <tbody>
                <tr class="odd:bg-gray-hover" *ngFor="let module of ship.modules" title="[{{module.symbol}}]{{ module.description }}">
                    <td class="px-4 text-left">{{ module.name }}</td>
                    <td class="px-4 text-left">{{ module.range || "N/A" }}</td>
                    <td class="px-4 text-left">{{ module.capacity || "N/A" }}</td>
                    <td class="px-4 text-left"><em class="text-sm italic">power: {{ module.requirements.power }} | crew: {{ module.requirements.crew }} | slots: {{ module.requirements.slots }}</em></td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="mb-2">
        <h2 class="text-2xl">Mounts ({{ ship.mounts.length}} / {{ ship.frame.mountingPoints }})</h2>
        <table class="table-auto">
            <thead>
                <tr>
                    <th class="px-4 text-left">Name</th>
                    <th class="px-4 text-left">Strength</th>
                    <th class="px-4 text-left">Requirements</th>
                </tr>
            </thead>
            <tbody>
                <tr class="odd:bg-gray-hover" *ngFor="let mount of ship.mounts" title="[{{mount.symbol}}] {{ mount.description }}">
                    <td class="px-4 text-left" title="{{mount.deposits || ''}}">{{ mount.name }}</td>
                    <td class="px-4 text-left">{{ mount.strength || "N/A" }}</td>
                    <td class="px-4 text-left"><em class="text-sm italic">power: {{ mount.requirements.power }} | crew: {{ mount.requirements.crew }}</em></td>
                </tr>
            </tbody>
        </table>
    </div>
    </div>
  </div>
  `,
  styles: [
  ]
})
export class ShipConfigurationComponent {
  @Input() ship!: Ship;
  show: boolean = false;

  toggleShow() {
    this.show = !this.show;
  }
}
