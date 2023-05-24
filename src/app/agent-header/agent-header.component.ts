import { Component, OnDestroy, OnInit } from '@angular/core';
import { timer, Observable, Subject, takeUntil, repeat} from 'rxjs';
import { ApiService } from '../services/api.service';
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
  `
})
export class AgentHeaderComponent implements OnInit, OnDestroy {
  private agentSubject$: Subject<Agent> = new Subject<Agent>();
  agent$: Observable<Agent> = this.agentSubject$.asObservable();

  private contractsSubject$: Subject<Contract[]> = new Subject<Contract[]>();
  contracts$: Observable<Contract[]> = this.contractsSubject$.asObservable();

  private shipsSubject$: Subject<Ship[]> = new Subject<Ship[]>();
  ships$: Observable<Ship[]> = this.shipsSubject$.asObservable();

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private api: ApiService, private router: Router) {

  }

  ngOnInit() {
    this.api.getAgent().pipe(
      takeUntil(this.destroy$),
      repeat({delay: 30000})
    ).subscribe(
      agent => this.agentSubject$.next(agent)
    );

    // Get only accepted contracts
    this.api.getContracts("accepted").pipe(
      takeUntil(this.destroy$),
      repeat({delay: 30000})
    ).subscribe(
      contracts => this.contractsSubject$.next(contracts)
    );
  
    this.api.getShips().pipe(
      takeUntil(this.destroy$),
      repeat({delay: 30000})
    ).subscribe(
      ships => this.shipsSubject$.next(ships)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
