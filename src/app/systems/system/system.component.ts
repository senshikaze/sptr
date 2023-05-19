import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { SystemType } from 'src/app/enums/system-type';
import { System } from 'src/app/interfaces/system';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html'
})
export class SystemComponent implements OnInit {
  systemType = Object.entries(SystemType).map(([key, value]) => ({key: key, value: value}));

  system$!: Observable<System>;

  constructor(private api: ApiService, private router: ActivatedRoute) {}

  ngOnInit() {
    this.system$ = this.router.paramMap.pipe(
      switchMap((params: ParamMap) => 
        this.api.getSystem(params.get('systemSymbol')!)
      )
    );
  }

}
