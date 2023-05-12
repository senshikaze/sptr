import { Cargo } from "./cargo"
import { Crew } from "./crew"
import { Engine } from "./engine"
import { Frame } from "./frame"
import { Fuel } from "./fuel"
import { Module } from "./module"
import { Mount } from "./mount"
import { Nav } from "./nav"
import { Reactor } from "./reactor"
import { Registration } from "./registration"

export interface Ship {
    symbol: string
    registration: Registration
    nav: Nav
    crew: Crew
    frame: Frame
    reactor: Reactor
    engine: Engine
    modules: Module[]
    mounts: Mount[]
    cargo: Cargo
    fuel: Fuel
}
