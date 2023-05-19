import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { ParamMap } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { Contract } from 'src/app/interfaces/contract';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html'
})
export class ContractComponent implements OnInit {
  contract$!: Observable<Contract>;

  constructor(private api: ApiService, private router: ActivatedRoute) {}

  ngOnInit() {
    this.contract$ = this.router.paramMap.pipe(
      switchMap((params: ParamMap) => this.api.getContract(params.get('id')!))
    )
  }

  accept(id: string) {
    this.contract$ = this.api.post<Contract>(`contracts/${id}`).pipe(
      map(response => response.data)
    );
  }
}
