import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { Ship } from '../interfaces/ship';
import { NavStatus } from '../enums/nav-status';

@Component({
  selector: 'app-ships',
  templateUrl: './ships.component.html'
})
export class ShipsComponent implements OnInit {
  ships$!: Observable<Ship[]>;
  navStatus = NavStatus;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    if (this.api.getAccessCode()) {
      this.ships$ = this.api.getShips();
    }
  }
}
