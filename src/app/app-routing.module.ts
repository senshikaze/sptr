import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShipsComponent } from './ships/ships.component';
import { ShipComponent } from './ships/ship/ship.component';
import { SystemsComponent } from './systems/systems.component';
import { SystemComponent } from './systems/system/system.component';
import { WaypointsComponent } from './systems/waypoints/waypoints.component';
import { WaypointComponent } from './systems/waypoints/waypoint/waypoint.component';
import { ContractsComponent } from './contracts/contracts.component';
import { ContractComponent } from './contracts/contract/contract.component';
import { AgentComponent } from './agent/agent.component';

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
  {
    path: 'contracts', children: [
      {path: '', component: ContractsComponent, pathMatch: "full"},
      {path: 'my', component: ContractsComponent, data: {filter: "accepted"}},
      {path: ':id', component: ContractComponent}
    ]
  },
  {path: 'agent', component: AgentComponent},
  {path: '**', component: AgentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
