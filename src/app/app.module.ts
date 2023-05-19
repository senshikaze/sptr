import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShipsComponent } from './ships/ships.component';
import { RegisterComponent } from './misc/register/register.component';
import { ShipComponent } from './ships/ship/ship.component';
import { SystemsComponent } from './systems/systems.component';
import { SystemComponent } from './systems/system/system.component';
import { WaypointsComponent } from './systems/waypoints/waypoints.component';
import { WaypointComponent } from './systems/waypoints/waypoint/waypoint.component';
import { ContractsComponent } from './contracts/contracts.component';
import { ContractComponent } from './contracts/contract/contract.component';
import { ShipRegistrationComponent } from './ships/ship/registration.component';
import { ShipNavigationComponent } from './ships/ship/navigation.component';
import { ShipConfigurationComponent } from './ships/ship/configuration.component';
import { ShipCrewComponent } from './ships/ship/crew.component';
import { ShipCargoComponent } from './ships/ship/cargo.component';
import { ErrorMessageComponent } from './misc/error-message.component';
import { AgentHeaderComponent } from './agent-header/agent-header.component';
import { AgentComponent } from './agent/agent.component';
import { PaginatorComponent } from './misc/paginator/paginator.component';
import { LuxonDatePipe } from './pipes/luxon-date.pipe';
import { LuxonRelativePipe } from './pipes/luxon-relative.pipe';
import { ShipyardComponent } from './systems/waypoints/shipyard/shipyard.component';
import { MarketplaceComponent } from './systems/waypoints/marketplace/marketplace.component';
import { JumpGateComponent } from './systems/waypoints/jump-gate/jump-gate.component';
import { TransitComponent } from './ships/ship/transit/transit.component';

@NgModule({
  declarations: [
    AppComponent,
    ShipsComponent,
    RegisterComponent,
    ShipComponent,
    SystemsComponent,
    SystemComponent,
    WaypointsComponent,
    WaypointComponent,
    ContractsComponent,
    ContractComponent,
    ShipRegistrationComponent,
    ShipNavigationComponent,
    ShipConfigurationComponent,
    ShipCrewComponent,
    ShipCargoComponent,
    ErrorMessageComponent,
    AgentHeaderComponent,
    AgentComponent,
    PaginatorComponent,
    LuxonDatePipe,
    LuxonRelativePipe,
    ShipyardComponent,
    MarketplaceComponent,
    JumpGateComponent,
    TransitComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
