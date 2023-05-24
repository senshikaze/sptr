import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, map, switchMap, takeUntil } from 'rxjs';
import { ParamMap } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Contract } from 'src/app/interfaces/contract';
import { Ship } from 'src/app/interfaces/ship';
import { ContractDelivery } from 'src/app/interfaces/contract-delivery';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html'
})
export class ContractComponent implements OnInit {
  contract$!: Observable<Contract>;
  canDeliver: boolean = false;
  canFulfill: boolean = false;

  private destroy$: Subject<boolean> = new Subject<boolean>;

  constructor(private api: ApiService, private router: ActivatedRoute) {}

  ngOnInit() {
    this.contract$ = this.router.paramMap.pipe(
      switchMap((params: ParamMap) => this.api.getContract(params.get('id')!))
    )
    // TODO can we deliever (is a ship with an accepted cargo at the correct waypoint)

    // an we fulfill (have we delivered the correct amount of cargo in our terms)
    this.contract$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      contract => {
        let fulfilled = contract.terms.deliver.filter(deliver => deliver.unitsFulfilled == deliver.unitsRequired);
        if (fulfilled.length == contract.terms.deliver.length) {
          this.canFulfill = true;
        }
      }
    )
  }

  accept(id: string) {
    this.contract$ = this.api.post<Contract>(`my/contracts/${id}/accept`).pipe(
      map(response => response.data)
    );
  }

  deliver(id: string, ship: Ship | null = null, tradeSymbol: string = '', units: number = 0) {
    if (ship == null) {
      // todo show delivery modal
    } else {
      this.contract$ = this.api.post<ContractDelivery>(
        `my/contracts/${id}/deliver`,
        {
          'shipSymbol': ship,
          'tradeSymbol': tradeSymbol,
          'units': units
        }
      ).pipe(
        map(response => response.data.contract)
      );

      this.contract$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(
        contract => {
          let fulfilled = contract.terms.deliver.filter(deliver => deliver.unitsFulfilled == deliver.unitsRequired);
          if (fulfilled.length == contract.terms.deliver.length) {
            this.canFulfill = true;
          }
        }
      );
    }
  }

  fulfill(id: string) {
    this.contract$ = this.api.post<ContractDelivery>(
      `my/contracts/${id}/fulfill`
    ).pipe(
      map(response => response.data.contract)
    );
  }
}
