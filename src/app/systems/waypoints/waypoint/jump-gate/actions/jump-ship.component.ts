import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ModalInterface } from 'src/app/interfaces/modal-interface';
import { Ship } from 'src/app/interfaces/ship';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-jump-ship',
  template: `
    <modal-container (close)="closeEvent.emit($event)">
      <div class="mb-8" *ngIf="ships$ | async as ships">
        <ul>
          <li class="px-4 cursor-pointer odd:bg-gray-hover" *ngFor="let ship of ships" (click)="update.emit(ship)">
              {{ship.symbol}}
          </li>
        </ul>
      </div>
    </modal-container>
  `
})
export class JumpShipComponent implements OnInit, ModalInterface{
  data!: any;
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() update: EventEmitter<Ship> = new EventEmitter<Ship>();

  ships$!: Observable<Ship[]>;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    if (this.data.waypoint) {
      // todo handle pagination
      this.ships$ = this.api.getShips().pipe(
        map(response => response.data.filter(ship => ship.nav.waypointSymbol == this.data.waypoint.symbol))
      )
    }
  }
}
