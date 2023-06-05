import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subject, map, switchMap, take, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { WaypointsTraits } from 'src/app/enums/waypoints-traits';
import { Waypoint } from 'src/app/interfaces/waypoint';
import { WaypointType } from 'src/app/enums/waypoint-type';
import { Ship } from 'src/app/interfaces/ship';
import { ModalService } from 'src/app/services/modal.service';
import { TransitShipComponent } from './actions/transit-ship/transit-ship.component';

@Component({
  selector: 'app-waypoint',
  template: `
  <div *ngIf="waypoint$ | async as waypoint">
    <div class="mb-2 p-4 border-b-teal border-b-2 flex">
        <h1 class="flex-auto text-4xl p-2">
          {{ waypoint.symbol }} 
          <span class="text-sm">
            (<a class="hover:text-blue" [routerLink]="['/systems', waypoint.systemSymbol]">{{ waypoint.systemSymbol }}</a>) 
            ({{waypoint.type}}) (x:{{waypoint.x}} y:{{waypoint.y}}) <span *ngIf="shipsAt$ | async as ships">(Ships: {{ships.length}})</span>
          </span>
        </h1>
        <ul>
          <li><button class="p-2 border-2 border-teal hover:bg-gray-hover mx-2" (click)="action('transit', {waypoint: waypoint})" title="Transit a ship to this waypoint">Transit Here</button></li>
        </ul>
    </div>
    <ul class="flex mb-4 ml-4">
        <li class="p-1 border-teal border-2 m-1 text-sm" *ngFor="let trait of waypoint.traits" title="{{trait.symbol}}">{{trait.name}}</li>
    </ul>
    <app-shipyard *ngIf="hasTrait(traits.SHIPYARD, waypoint.traits)" [waypoint]="waypoint" [ships$]="shipsAt$"></app-shipyard>
    <app-marketplace *ngIf="hasTrait(traits.MARKETPLACE, waypoint.traits)" [waypoint]="waypoint" [ships$]="shipsAt$"></app-marketplace>
    <app-jump-gate *ngIf="waypoint.type == types.JUMP_GATE" [waypoint]="waypoint"></app-jump-gate>
  </div>`
})
export class WaypointComponent implements OnInit, OnDestroy {
  traits = WaypointsTraits;
  types = WaypointType;
  waypointSubject: Subject<Waypoint> = new Subject<Waypoint>();
  waypoint$: Observable<Waypoint> = this.waypointSubject.asObservable();

  shipsAt$!: Observable<Ship[]>;

  private destroy$: Subject<boolean> = new Subject<boolean>()

  constructor(private api: ApiService, private router: ActivatedRoute, private modalService: ModalService) {}

  ngOnInit() {
    let waypoint = this.router.paramMap.pipe(
      switchMap((params: ParamMap) => {
        let systemSymbol = params.get('systemSymbol');
        let waypointSymbol = params.get('waypointSymbol');
        if (systemSymbol == null) {
          // Get the system from the waypoint
          systemSymbol = this.getSystemSymbol(waypointSymbol!);
        }
        return this.api.getWaypoint(systemSymbol, waypointSymbol!);
      })
    );

    waypoint.pipe(
      take(1)
    ).subscribe(
      waypoint => {
        // TODO pagination
        this.shipsAt$ = this.api.getShips(20, 1).pipe(
          map(response => response.data.filter(s => s.nav.waypointSymbol == waypoint.symbol))
        );
        this.waypointSubject.next(waypoint)
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  action(type: string, options: {waypoint?: Waypoint}): void {
    if (type == "transit") {
      this.modalService.addModal(
        TransitShipComponent,
        {
          waypoint: options.waypoint,
          update: this.updateWaypoint
        }
      );
    }
  }

  updateWaypoint(waypoint: Waypoint | null): void {
    if (waypoint) {
      this.api.getWaypoint(waypoint.systemSymbol, waypoint.symbol).pipe(
        take(1)
      ).subscribe(
        wp => this.waypointSubject.next(wp)
      );
    }
  }

  hasTrait(trait: WaypointsTraits, traits: any[]): boolean {
    return Boolean(traits.filter(t => trait.toString() == t.symbol).length)
  }

  getSystemSymbol(waypointSymbol: string): string {
    // Changes X1-VS75-70500X into X1-VS75
    // TODO: this may change.
    // there is some effort happening to change
    // the semantic meaning of systems and waypoints
    return waypointSymbol.split('-').slice(0,2).join('-');
  }
}
