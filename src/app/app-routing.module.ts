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
import { shipTitleResolver } from './misc/ship-title.resolver';
import { systemTitleResolver } from './misc/system-title.resolver';

const routes: Routes = [
  {
    path: 'ships',
    children: [
      { path: '', component: ShipsComponent },
      { path: ":symbol", component: ShipComponent, title: shipTitleResolver }
    ],
    title: 'Ships'
  },
  {
    path: 'systems',
    children: [
      { path: '', component: SystemsComponent, pathMatch: "full"},
      {
        path: ':systemSymbol',
        children: [
          {path: '', component: SystemComponent, pathMatch: "full"},
          {
            path: 'waypoints',
            children: [
              {path: '', component: WaypointsComponent, pathMatch: "full"},
              {path: ':waypointSymbol', component: WaypointComponent}
            ],
          }
        ]
      }
    ],
    title: systemTitleResolver
  },
  {
    path: 'contracts',
    children: [
      {path: '', component: ContractsComponent, pathMatch: "full"},
      {path: 'my', component: ContractsComponent, data: {filter: "accepted"}},
      {path: ':id', component: ContractComponent}
    ],
    title: "Contracts"
  },
  {path: 'agent', component: AgentComponent, title: "My Agent"},
  {path: '**', component: AgentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
