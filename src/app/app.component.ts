import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { ErrorService } from './error.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  registered: boolean = false;
  title = 'Space Trader';

  constructor(private api: ApiService, public errorService: ErrorService) { }

  ngOnInit() {
    this.registered = this.api.authenticated();
  }
}
