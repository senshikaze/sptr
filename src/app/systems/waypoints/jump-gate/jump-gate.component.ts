import { Component, Input, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { JumpGate } from 'src/app/interfaces/jump-gate';
import { Waypoint } from 'src/app/interfaces/waypoint';

@Component({
  selector: 'app-jump-gate',
  template: `
    <p>
      jump-gate works!
    </p>
  `,
  styles: [
  ]
})
export class JumpGateComponent implements OnInit {
  @Input() waypoint!: Waypoint;

  jumpGate$!: Observable<JumpGate>;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<JumpGate>(
      `systems/${this.waypoint.systemSymbol}/waypoints/${this.waypoint.symbol}/jump-gate`
    ).pipe(
      map(response => response.data)
    );
  }
}
