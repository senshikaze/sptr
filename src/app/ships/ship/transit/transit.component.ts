import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { Ship } from 'src/app/interfaces/ship';
import { Waypoint } from 'src/app/interfaces/waypoint';

@Component({
  selector: 'app-transit',
  template: `
    <div class="fixed min-h-screen min-w-screen inset-0 bg-opacity-80 bg-gray-dark backdrop-blur-sm">
      <div class="w-72 border-2 border-teal m-auto p-8 bg-gray-dark translate-y-1/2">
        <h2 class="text-xl">Transit To</h2>
        <ul class="odd:bg-gray-hover"  *ngIf="waypoints$ | async as waypoints">
          <li class="px-4 cursor-pointer" *ngFor="let waypoint of waypoints" (click)="startTransit(waypoint)">{{waypoint.symbol}}</li>
        </ul>
        <button class="float-right border-2 border-teal p-2 m-2 bg-gray-dark hover:text-gray" (click)="close()">Cancel</button>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class TransitComponent implements OnInit, OnDestroy {
  @Input() ship!: Ship;

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

  }

  startTransit(waypoint: Waypoint): void {
    
  }

}
