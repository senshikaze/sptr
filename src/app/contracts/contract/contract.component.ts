import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { ParamMap } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { Contract } from 'src/app/interfaces/contract';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html'
})
export class ContractComponent {
  contract$!: Observable<Contract>;

  constructor(private api: ApiService, private router: ActivatedRoute) {}

  ngOnInit() {
    this.contract$ = this.router.paramMap.pipe(
      switchMap((params: ParamMap) => this.api.getContract(params.get('id')!))
    )
  }

  accept() {
    
  }
}
