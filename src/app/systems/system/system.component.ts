import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subject, map, switchMap, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SystemType } from 'src/app/enums/system-type';
import { System } from 'src/app/interfaces/system';
import { Ship } from 'src/app/interfaces/ship';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html'
})
export class SystemComponent implements OnInit, OnDestroy {
  systemType = Object.entries(SystemType).map(([key, value]) => ({key: key, value: value}));

  system$!: Observable<System>;
  shipsIn$!: Observable<Ship[]>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private api: ApiService, private router: ActivatedRoute) {}

  ngOnInit() {
    this.system$ = this.router.paramMap.pipe(
      switchMap((params: ParamMap) => 
        this.api.getSystem(params.get('systemSymbol')!)
      )
    );

    // TODO pagination
    this.system$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      system => {
        this.shipsIn$ = this.api.getShips(20, 1).pipe(
          map(response => response.data.filter(s => s.nav.systemSymbol == system.symbol))
        );
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
