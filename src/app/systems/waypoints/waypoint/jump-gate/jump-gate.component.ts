import { Component, Input, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { JumpGate } from 'src/app/interfaces/jump-gate';
import { Waypoint } from 'src/app/interfaces/waypoint';
import { Ship } from 'src/app/interfaces/ship';
import { System } from 'src/app/interfaces/system';
import { ModalService } from 'src/app/services/modal.service';
import { JumpShipComponent } from './actions/jump-ship.component';

@Component({
  selector: 'app-jump-gate',
  template: `
  <div class="ml-4 mb-4">
    <ul *ngIf="jumpGate$ | async as jumpGate">
      <li class="px-4 cursor-pointer odd:bg-gray-hover" *ngFor="let system of jumpGate.connectedSystems" (click)="jump(system)">
        {{system.symbol}} ({{system.type}})
      </li>
    </ul>
  </div>
  `
})
export class JumpGateComponent implements OnInit {
  @Input() waypoint!: Waypoint;

  jumpGate$!: Observable<JumpGate>;

  constructor(private api: ApiService, private modal: ModalService) {}

  ngOnInit() {
    this.jumpGate$ = this.api.get<JumpGate>(
      `systems/${this.waypoint.systemSymbol}/waypoints/${this.waypoint.symbol}/jump-gate`
    ).pipe(
      map(response => response.data)
    );
  }

  jump(system: System): void {
    this.modal.addModal(
      JumpShipComponent,
      {
        waypoint: this.waypoint,
        update: (ship: Ship) => this.api.postJump(ship, system.symbol)
      }
    ) 
  }
}
