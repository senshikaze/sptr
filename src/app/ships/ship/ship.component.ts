import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subject, repeat, switchMap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { Ship } from 'src/app/interfaces/ship';
import { NavStatus } from 'src/app/enums/nav-status';
import { Survey } from 'src/app/interfaces/survey';

@Component({
  selector: 'app-ship',
  templateUrl: './ship.component.html'
})
export class ShipComponent implements OnInit, OnDestroy {
  navStatus = NavStatus;

  private shipSubject$: Subject<Ship> = new Subject<Ship>();
  ship$: Observable<Ship> = this.shipSubject$.asObservable();
  surveys: Survey[] = [];

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private api: ApiService, private router: ActivatedRoute) {}

  ngOnInit() {
    this.ship$ = this.router.paramMap.pipe(
      switchMap((params: ParamMap) => 
        this.api.getShip(params.get('symbol')!).pipe(
          repeat({delay: 10000})
        )
      )
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  updateShip(action: {ship: Ship, optional?:{surveys?:Survey[]}}): void {
    if (action.ship) {
      this.ship$ = this.api.getShip(action.ship.symbol);
    }
  }
}
