import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShipsComponent } from './ships/ships.component';
import { ShipComponent } from './ships/ship/ship.component';
import { SystemsComponent } from './systems/systems.component';
import { SystemComponent } from './systems/system/system.component';
import { WaypointsComponent } from './systems/waypoints/waypoints.component';
import { WaypointComponent } from './systems/waypoints/waypoint/waypoint.component';

const routes: Routes = [
  {
    path: 'ships',
    children: [
      { path: '', component: ShipsComponent },
      { path: ":symbol", component: ShipComponent }
    ]
  },
  {
    path: 'systems',
    children: [
      { path: '', component: SystemsComponent },
      {
        path: ':symbol',
        component: SystemComponent,
        children: [
          {path: 'waypoints', children: [
            {path: '', component: WaypointsComponent},
            {path: ':symbol', component: WaypointComponent}
          ]}
        ]
      }
    ]
  },
  {path: '**', component: ShipsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
