import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  registered: boolean = false;

  constructor(private api: ApiService) {
    this.registered = this.api.authenticated();
  }
  title = 'Space Trader';
}
