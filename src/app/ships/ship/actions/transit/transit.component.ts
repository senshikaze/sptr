import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ModalInterface } from 'src/app/interfaces/modal-interface';
import { Ship } from 'src/app/interfaces/ship';
import { Transit } from 'src/app/interfaces/transit';
import { Waypoint } from 'src/app/interfaces/waypoint';
import { MessageService } from 'src/app/services/message.service';
import { DateTime } from 'luxon';
import { MessageType } from 'src/app/enums/message-type';

@Component({
  selector: 'app-shiptransit',
  template: `
    <div class="fixed min-h-screen min-w-screen inset-0 bg-opacity-80 bg-gray-dark backdrop-blur-sm" *ngIf="data.ship" (click)="closeEvent.emit(true)">
      <div class="relative w-96 border-2 border-teal mx-auto my-44 p-8 bg-gray-dark" (click)="$event.stopPropagation()">
        <div class="mb-8">  
          <h2 class="text-xl mb-2">Transit to Waypoint:</h2>
          <ul *ngIf="waypoints$ | async as waypoints">
            <li class="px-4 cursor-pointer odd:bg-gray-hover" *ngFor="let waypoint of waypoints" (click)="startTransit(data.ship, waypoint)" title="{{waypoint.traits | joinTraits}}">{{waypoint.symbol}} ({{waypoint.type}})</li>
          </ul>
          <app-paginator [page]="page" [limit]="limit" [total]="total"></app-paginator>
        </div>
        <button class="absolute right-2 bottom-2 border-2 border-teal p-2 m-2 bg-gray-dark hover:text-gray" (click)="this.closeEvent.emit(true)">Cancel</button>
      </div>
    </div>
  `
})
export class TransitComponent implements OnInit, OnDestroy, ModalInterface {
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updateShip: EventEmitter<Ship> = new EventEmitter<Ship>();

  data!: any;

  waypoints$!: Observable<Waypoint[]>;

  page = 1;
  limit = 20;
  total = 0;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private api: ApiService, public messageService: MessageService) {}

  ngOnInit(): void {
    if (this.data.ship) {
      this.waypoints$ = this.api.getWaypoints(this.data.ship.nav.systemSymbol, this.limit, this.page).pipe(
        map(response => {
          this.total = response.meta.total;
          return response.data.filter(w => w.symbol != this.data.ship.nav.waypointSymbol);
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  startTransit(ship: Ship, waypoint: Waypoint): void {
    this.api.post<Transit>(
      `my/ships/${ship.symbol}/navigate`,
      {
        'waypointSymbol': waypoint.symbol 
      }
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      transit => {
        let arrival = DateTime.fromISO(transit.data.nav.route.arrival).diff(DateTime.now());
        this.messageService.addMessage(
          `Starting transit to ${this.data.ship.nav.waypointSymbol}, estimated arrival: ${DateTime.fromISO(transit.data.nav.route.arrival).toRelative()}`,
          MessageType.GOOD
        );
        this.updateShip.emit(ship);
        this.closeEvent.emit(true);
      }
    );
  }

}
