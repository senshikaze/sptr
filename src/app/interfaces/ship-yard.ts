import { Engine } from "./engine"
import { Frame } from "./frame"
import { Module } from "./module"
import { Mount } from "./mount"
import { Reactor } from "./reactor"
import { Ship } from "./ship"

export interface ShipYard {
    symbol: string
    shipTypes: string
    transactions: {
        waypointSymbol: string
        shipSymbol: string
        price: number
        agentSymbol: string
        timestamp: string
    }[]
    ships: {
        type: string
        name: string
        description: string
        purchasePrice: number
        frame: Frame
        reactor: Reactor
        engine: Engine
        modules: Module[]
        mounts: Mount[]
    }[]
}
