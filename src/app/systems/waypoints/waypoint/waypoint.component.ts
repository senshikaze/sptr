import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { Waypoint } from 'src/app/interfaces/waypoint';

@Component({
  selector: 'app-waypoint',
  templateUrl: './waypoint.component.html',
  styleUrls: ['./waypoint.component.css']
})
export class WaypointComponent {
  waypoint$!: Observable<Waypoint>;
  constructor(private api: ApiService, private router: ActivatedRoute) {}

  ngOnInit() {
    this.waypoint$ = this.router.paramMap.pipe(
      switchMap((params: ParamMap) => this.api.getWaypoint(
        params.get('systemSymbol')!, params.get('waypointSymbol')!
      ))
    );
  }
}
