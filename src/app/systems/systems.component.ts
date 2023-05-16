import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { System } from '../interfaces/system';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-systems',
  templateUrl: './systems.component.html'
})
export class SystemsComponent {
  systems: System[] = [];
  page: number = 1;
  total: number = 0;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getSystems(20, 1).subscribe(
      response => {
        this.systems = response.data;
        this.page = response.meta.page;
        this.total = response.meta.total;
      }
    )
  }

}
