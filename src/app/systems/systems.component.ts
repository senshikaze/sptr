import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { System } from '../interfaces/system';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-systems',
  templateUrl: './systems.component.html'
})
export class SystemsComponent implements OnInit {
  systems$!: Observable<System[]>;
  page: number = 1;
  total: number = 0;
  limit: number = 20;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.systems$ = this.getSystems();
  }

  getSystems(): Observable<System[]> {
    return this.api.getSystems(this.limit, this.page).pipe(
      map(response => {
        this.page = response.meta.page;
        this.total = response.meta.total;
        this.limit = response.meta.limit;
        return response.data;
      }
    ));
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.systems$ = this.getSystems();
  }
}
