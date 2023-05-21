import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute} from '@angular/router';
import { Contract } from '../interfaces/contract';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html'
})
export class ContractsComponent implements OnInit, OnDestroy {
  contracts$!: Observable<Contract[]>;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private api: ApiService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.data.pipe(
      takeUntil(this.destroy$)
    ).subscribe(d =>
      this.contracts$ = this.api.getContracts(d['filter'])
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
