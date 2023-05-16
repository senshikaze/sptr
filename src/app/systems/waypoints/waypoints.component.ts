import { Component, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, switchMap, map} from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { Waypoint } from 'src/app/interfaces/waypoint';

@Component({
  selector: 'app-waypoints',
  templateUrl: './waypoints.component.html'
})
export class WaypointsComponent {
  @Input() systemSymbol: string = '';
  waypoints$!: Observable<Waypoint[]>;
  limit: number = 20;
  page: number = 1;

  constructor(private api: ApiService, private router: ActivatedRoute) {}

  ngOnInit() {
    if (this.systemSymbol == '') {
      // we were loaded via the router, get the param
      // TODO is there a better way to do this?
      this.waypoints$ = this.router.paramMap.pipe(
        switchMap((params: ParamMap) => this.api.getWaypoints(params.get('systemSybmol')!, this.limit, this.page).pipe(
          map(response => {this.limit = response.meta.limit; this.page = response.meta.page; return response.data})
        )
      ));
    } else {
      this.waypoints$ = this.api.getWaypoints(this.systemSymbol, this.limit, this.page).pipe(
        map(response => {this.limit = response.meta.limit; this.page = response.meta.page; return response.data})
      );

    }
  }
}
