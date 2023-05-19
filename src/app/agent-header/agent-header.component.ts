import { Component, OnInit } from '@angular/core';
import { timer, Observable} from 'rxjs';
import { ApiService } from '../api.service';
import { Agent } from '../interfaces/agent';
import { Contract } from '../interfaces/contract';
import { Router } from '@angular/router';
import { Ship } from '../interfaces/ship';

@Component({
  selector: 'app-agent-header',
  template: `
    <div class="flex flex-col" *ngIf="agent$ | async as agent">
    <a class="mr-6 hover:text-blue" routerLink="/agent">{{ agent.symbol }}</a>
    <a class="mr-6 hover:text-blue" routerLink="/agent">Credits: <b>{{ agent.credits | number : '1.0-0' }} c</b></a>
    <a class="mr-6 hover:text-blue" routerLink="/ships" *ngIf="ships$ | async as ships">Ships: {{ ships.length }}</a>
    <a class="mr-6 hover:text-blue" routerLink="/contracts/my" *ngIf="contracts$ | async as contracts">Contracts: {{ contracts.length }}</a>

  </div>
  `,
  styles: [
  ]
})
export class AgentHeaderComponent implements OnInit {
  agent$!: Observable<Agent>;
  contracts$!: Observable<Contract[]>;
  ships$!: Observable<Ship[]>;

  constructor(private api: ApiService, private router: Router) {

  }

  ngOnInit() {
    timer(0, 30000).subscribe(
      _ => {
        this.agent$ = this.api.getAgent();
        // Get only accepted contracts
        this.contracts$ = this.api.getContracts("accepted");
        this.ships$ = this.api.getShips();
      }
    );
  }

}
