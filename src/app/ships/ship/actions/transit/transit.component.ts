import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { Ship } from 'src/app/interfaces/ship';
import { Waypoint } from 'src/app/interfaces/waypoint';

@Component({
  selector: 'app-transit',
  template: `
    <div class="fixed min-h-screen min-w-screen inset-0 bg-opacity-80 bg-gray-dark backdrop-blur-sm">
      <div class="w-96 border-2 border-teal m-auto p-8 bg-gray-dark translate-y-1/2">
        <div class="mb-8">  
          <h2 class="text-xl">Select Waypoint</h2>
          <ul *ngIf="waypoints$ | async as waypoints">
            <li class="px-4 cursor-pointer odd:bg-gray-hover" *ngFor="let waypoint of waypoints" (click)="startTransit(waypoint)" title="{{waypoint.traits | joinTraits}}">{{waypoint.symbol}} ({{waypoint.type}})</li>
          </ul>
        </div>
        <button class="absolute right-2 bottom-2 border-2 border-teal p-2 m-2 bg-gray-dark hover:text-gray" (click)="close()">Cancel</button>
      </div>
    </div>
  `
})
export class TransitComponent implements OnInit, OnDestroy {
  @Input() ship!: Ship;
  @Output() tranistEvent = new EventEmitter<Waypoint | null>();

  waypoints$!: Observable<Waypoint[]>;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    // TODO handle more than 20 waypoints in a system
    this.waypoints$ = this.api.getWaypoints(this.ship.nav.systemSymbol).pipe(
      map(response => response.data)
    );
  }

  ngOnDestroy(): void {
    
  }

  close(): void {
    this.tranistEvent.emit(null);
  }

  startTransit(waypoint: Waypoint): void {
    this.tranistEvent.emit(waypoint);
  }

}
