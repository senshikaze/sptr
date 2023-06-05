import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { AgentHeaderComponent } from './agent-header/agent-header.component';
import { AgentComponent } from './agent/agent.component';
import { PaginatorComponent } from './misc/paginator/paginator.component';
import { LuxonDatePipe } from './pipes/luxon-date.pipe';
import { LuxonRelativePipe } from './pipes/luxon-relative.pipe';
import { ShipyardComponent } from './systems/waypoints/waypoint/shipyard/shipyard.component';
import { MarketplaceComponent } from './systems/waypoints/waypoint/marketplace/marketplace.component';
import { JumpGateComponent } from './systems/waypoints/waypoint/jump-gate/jump-gate.component';
import { TransitComponent } from './ships/ship/actions/transit/transit.component';
import { ModalDirective } from './modal.directive';
import { ConditionPipe } from './pipes/condition.pipe';
import { JoinTraitsPipe } from './pipes/join-traits.pipe';
import { ShipStatusComponent } from './ships/ship/ship-status.component';
import { ShipActionsComponent } from './ships/ship/ship-actions.component';
import { MineComponent } from './ships/ship/actions/mine/mine.component';
import { JoinPipe } from './pipes/join.pipe';
import { JoinDepositsPipe } from './pipes/join-deposits.pipe';
import { MessageComponent } from './misc/message.component';
import { SellComponent } from './ships/ship/actions/sell/sell.component';
import { JumpComponent } from './ships/ship/actions/jump/jump.component';
import { FuelComponent } from './ships/ship/fuel.component';
import { ModalComponent } from './misc/modal/modal.component';
import { InRangePipe } from './pipes/in-range.pipe';
import { DistancePipe } from './pipes/distance.pipe';
import { ShipMoveActionsComponent } from './ships/ship/ship-move-actions.component';
import { SpinnerComponent } from './misc/spinner.component';
import { TransitShipComponent } from './systems/waypoints/waypoint/actions/transit-ship/transit-ship.component';
import { ModalContainerComponent } from './misc/modal/modal-container.component';
import { JumpShipComponent } from './systems/waypoints/waypoint/jump-gate/actions/jump-ship.component';

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
    AgentHeaderComponent,
    AgentComponent,
    PaginatorComponent,
    LuxonDatePipe,
    LuxonRelativePipe,
    ShipyardComponent,
    MarketplaceComponent,
    JumpGateComponent,
    TransitComponent,
    ModalDirective,
    ConditionPipe,
    JoinTraitsPipe,
    ShipStatusComponent,
    ShipActionsComponent,
    MineComponent,
    JoinPipe,
    JoinDepositsPipe,
    MessageComponent,
    SellComponent,
    JumpComponent,
    FuelComponent,
    ModalComponent,
    InRangePipe,
    DistancePipe,
    ShipMoveActionsComponent,
    SpinnerComponent,
    TransitShipComponent,
    ModalContainerComponent,
    JumpShipComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
