import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, map, take, takeUntil } from 'rxjs';
import { MessageType } from 'src/app/enums/message-type';
import { NavStatus } from 'src/app/enums/nav-status';
import { ModalInterface } from 'src/app/interfaces/modal-interface';
import { Ship } from 'src/app/interfaces/ship';
import { Waypoint } from 'src/app/interfaces/waypoint';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-transit-ship',
  template: `
    <modal-container (close)="closeEvent.emit(true)">
        <div class="mb-8">
          <h2 class="text-xl">Select Ship:</h2>
          <ul *ngIf="ships$ | async as ships">
            <li class="px-4 cursor-pointer odd:bg-gray-hover" *ngFor="let ship of ships" (click)="transit(data.waypoint, ship)" >{{ship.symbol}} | {{ship.nav.waypointSymbol}} | {{ship.nav.flightMode}}</li>
          </ul>
        </div>
    </modal-container>
  `
})
export class TransitShipComponent implements OnInit, ModalInterface{
  data!: any;
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() update: EventEmitter<Waypoint> = new EventEmitter<Waypoint>();

  ships$!: Observable<Ship[]>;

  constructor(private api: ApiService, private messageService: MessageService) {}

  ngOnInit(): void {
    if (this.data.waypoint) {
      this.ships$ = this.api.getShips().pipe(
        map(response => response.data.filter(
          s => s.nav.systemSymbol == this.data.waypoint.systemSymbol && s.nav.waypointSymbol != this.data.waypoint.symbol)
        )
      )
    } else {
      this.closeEvent.emit(true);
    }
  }

  transit(waypoint: Waypoint, ship: Ship): void {
    if (ship.nav.status == NavStatus.IN_TRANSIT) {
      this.messageService.addMessage(
        `${ship.symbol} is currently in transit to ${ship.nav.route.destination}, and will arrive ${DateTime.fromISO(ship.nav.route.arrival).toRelative()}`,
        MessageType.WARNING
      );
    }
    // first, make sure the ship is in orbit whereever it is
    if (ship.nav.status == NavStatus.DOCKED) {
      this.api.postOrbit(ship).pipe(
        take(1)
      ).subscribe(
        n => {
          this.messageService.addMessage(
            `${ship.symbol} is now orbiting ${n.waypointSymbol}, starting transit to ${waypoint.symbol}`,
            MessageType.GOOD
          );
        }
      )
    }
    this.api.postNavigate(ship, waypoint).pipe(
      take(1)
    ).subscribe(
      transit => {
        this.messageService.addMessage(
          `${ship.symbol} is now in transit to ${transit.nav.route.destination}, arrival ${DateTime.fromISO(transit.nav.route.arrival)}.`,
          MessageType.GOOD
        );
        this.update.emit(waypoint);
        this.closeEvent.emit(true);
      }
    )
  }
}
