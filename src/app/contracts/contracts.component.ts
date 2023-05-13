import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Contract } from '../interfaces/contract';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html'
})
export class ContractsComponent {
  contracts$!: Observable<Contract[]>;

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.contracts$ = this.api.getContracts()
  }

  accept() {
    
  }
}
