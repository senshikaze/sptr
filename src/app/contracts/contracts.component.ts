import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute} from '@angular/router';
import { Contract } from '../interfaces/contract';
import { Observable, Subject, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html'
})
export class ContractsComponent implements OnInit, OnDestroy {
  contracts$!: Observable<Contract[]>;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  page = 1;
  limit = 20;
  total = 0;

  constructor(private api: ApiService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.data.pipe(
      takeUntil(this.destroy$)
    ).subscribe(d =>
      this.contracts$ = this.api.getContracts(this.limit, this.page).pipe(
        map(response => {
          this.total = response.meta.total;
          return response.data;
        })
      )
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
