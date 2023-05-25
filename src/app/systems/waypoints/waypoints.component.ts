import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, switchMap, map, of} from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Waypoint } from 'src/app/interfaces/waypoint';
import { MessageService } from 'src/app/services/message.service';
import { MessageType } from 'src/app/enums/message-type';

@Component({
  selector: 'app-waypoints',
  templateUrl: './waypoints.component.html'
})
export class WaypointsComponent implements OnInit {
  @Input() systemSymbol: string = '';
  waypoints$!: Observable<Waypoint[]>;
  limit: number = 20;
  page: number = 1;
  total: number = 0;

  constructor(private api: ApiService, private router: ActivatedRoute, public messageService: MessageService) {}

  ngOnInit() {
    if (this.systemSymbol == '') {
      // we were loaded via the router, get the param
      // TODO is there a better way to do this?
      this.waypoints$ = this.router.paramMap.pipe(
          switchMap((params: ParamMap) => {
            let systemSymbol = params.get('systemSymbol');
            if (systemSymbol == null) {
              // get the system symbol from the waypoint symbol
              this.messageService.addMessage(
                `Could not find System`,
                MessageType.ERROR
              );
              return of([]);
            }
            return this.api.getWaypoints(systemSymbol, this.limit, this.page).pipe(
              map(response => {
                this.limit = response.meta.limit;
                this.page = response.meta.page;
                return response.data
              })
            )
          }
      ));
    } else {
      this.waypoints$ = this.api.getWaypoints(this.systemSymbol, this.limit, this.page).pipe(
        map(response => {
          this.limit = response.meta.limit;
          this.page = response.meta.page;
          this.total = response.meta.total;
          return response.data
        })
      );

    }
  }
}
