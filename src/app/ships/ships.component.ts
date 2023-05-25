import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
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

  page = 1;
  limit = 20;
  total = 0;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.ships$ = this.api.getShips(this.limit, this.page).pipe(
      map(response => {
        this.total = response.meta.total;
        return response.data;
      })
    );
  }
}
