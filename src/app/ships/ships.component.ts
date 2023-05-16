import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Ship } from '../interfaces/ship';

@Component({
  selector: 'app-ships',
  templateUrl: './ships.component.html'
})
export class ShipsComponent {
  ships$!: Observable<Ship[]>;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    if (this.api.getAccessCode()) {
      this.ships$ = this.api.getShips();
    }
  }
}
