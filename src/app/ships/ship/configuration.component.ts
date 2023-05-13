import { Component, Input } from '@angular/core';
import { Ship } from 'src/app/interfaces/ship';

@Component({
  selector: 'app-shipconfiguration',
  template: `
    <h2 class="text-2xl">Frame</h2>
        <ul class="mb-6">
            <li>Name: {{ ship.frame.name }} <span class="text-xs">({{ship.frame.symbol}})</span></li>
            <li>Description: {{ ship.frame.description }}</li>
            <li>Condition: {{ ship.frame.condition }}</li>
            <li>Module Slots: {{ ship.frame.moduleSlots }}</li>
            <li>Fuel Capacity {{ ship.frame.fuelCapacity }}</li>
            <li><em class="text-sm italic">Requirements: power: {{ ship.frame.requirements.power }} | crew: {{ship.frame.requirements.crew}} | slots: {{ship.frame.requirements.slots}}</em></li>
        </ul>
        <h2 class="text-2xl">Reactor</h2>
        <ul class="mb-6">
            <li>Name: {{ ship.reactor.name }} <span class="text-xs">({{ship.reactor.symbol}})</span></li>
            <li>Description: {{ ship.reactor.description }}</li>
            <li>Condition: {{ ship.reactor.condition }}</li>
            <li>Power Output: {{ ship.reactor.powerOutput }}</li>
            <li><em class="text-sm italic">Requirements: power: {{ ship.reactor.requirements.power }} | crew: {{ship.reactor.requirements.crew}} | slots: {{ship.reactor.requirements.slots}}</em></li>
        </ul>
        <h2 class="text-2xl">Engine</h2>
        <ul class="mb-6">
            <li>Name: {{ ship.engine.name }} <span class="text-xs">({{ship.engine.symbol}})</span></li>
            <li>Description: {{ ship.engine.description }}</li>
            <li>Condition: {{ ship.engine.condition }}</li>
            <li>Speed: {{ ship.engine.speed }}</li>
            <li><em class="text-sm italic">Requirements: power: {{ ship.engine.requirements.power }} | crew: {{ship.engine.requirements.crew}} | slots: {{ship.engine.requirements.slots}}</em></li>
        </ul>
        <h2 class="text-2xl">Modules</h2>
        <ul class="mb-6">
            <li>TODO: {{ ship.modules.length }}</li>
        </ul>
        <h2 class="text-2xl">Fuel</h2>
        <ul class="mb-6">
            <li>{{ ship.fuel.current }} / {{ ship.fuel.capacity }}</li>
            <li>Most Recent Consumption: {{ ship.fuel.consumed.amount }} ({{ ship.fuel.consumed.timestamp }})</li>
        </ul>
  `,
  styles: [
  ]
})
export class ShipConfigurationComponent {
  @Input() ship!: Ship;
}
