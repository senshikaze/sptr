import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute} from '@angular/router';
import { Contract } from '../interfaces/contract';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html'
})
export class ContractsComponent {
  contracts$!: Observable<Contract[]>;

  constructor(private api: ApiService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.data.subscribe(d =>
      this.contracts$ = this.api.getContracts(d['filter'])
    ).unsubscribe();
  }

  accept() {

  }
}
