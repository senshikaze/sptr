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
  <modal-container (close)="closeEvent.emit(true)">
    <div class="mb-8">  
      <h2 class="text-xl mb-2">Transit to Waypoint:</h2>
      <ul *ngIf="waypoints$ | async as waypoints">
        <li class="px-4 cursor-pointer odd:bg-gray-hover" *ngFor="let waypoint of waypoints" (click)="startTransit(data.ship, waypoint)" title="{{waypoint.traits | joinTraits}}">{{waypoint.symbol}} ({{waypoint.type}})</li>
      </ul>
      <paginator [page]="page" [limit]="limit" [total]="total"></paginator>
    </div>
  </modal-container>  
  `
})
export class TransitComponent implements OnInit, OnDestroy, ModalInterface {
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() update: EventEmitter<Ship> = new EventEmitter<Ship>();

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
    this.api.postNavigate(ship, waypoint).pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      transit => {
        this.messageService.addMessage(
          `Starting transit to ${this.data.ship.nav.waypointSymbol}, estimated arrival: ${DateTime.fromISO(transit.nav.route.arrival).toRelative()}`,
          MessageType.GOOD
        );
        this.update.emit(ship);
        this.closeEvent.emit(true);
      }
    );
  }

}
