import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Agent } from '../interfaces/agent';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styles: [
  ]
})
export class AgentComponent implements OnInit {
  agent$!: Observable<Agent>;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.agent$ = this.api.getAgent();
  }
}
