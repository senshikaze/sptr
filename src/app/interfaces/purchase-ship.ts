import { Agent } from "./agent";
import { Ship } from "./ship";

export interface PurchaseShip {
    agent: Agent
    ship: Ship
    transaction: {
        waypointSymbol: string
        shipSymbol: string
        price: number
        agentSymbol: string
        timestamp: string
    }
}
