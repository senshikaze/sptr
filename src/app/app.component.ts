import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { MessageService } from './message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  registered: boolean = false;
  title = 'Space Trader';

  constructor(private api: ApiService, public messageService: MessageService) { }

  ngOnInit() {
    this.registered = this.api.authenticated();
  }
}
