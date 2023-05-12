import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { Ship } from 'src/app/interfaces/ship';

@Component({
  selector: 'app-ship',
  templateUrl: './ship.component.html'
})
export class ShipComponent {
  ship$!: Observable<Ship>;
  constructor(private api: ApiService, private router: ActivatedRoute) {}

  ngOnInit() {
    this.ship$ = this.router.paramMap.pipe(
      switchMap((params: ParamMap) => 
        this.api.getShip(params.get('symbol')!)
      )
    );
  }
}
