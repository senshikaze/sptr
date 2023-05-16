import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { Agent } from '../interfaces/agent';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styles: [
  ]
})
export class AgentComponent {
  agent$!: Observable<Agent>;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.agent$ = this.api.getAgent();
  }
}
