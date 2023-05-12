import { Agent } from "./agent"
import { Contract } from "./contract"
import { Faction } from "./faction"
import { Ship } from "./ship"

export interface Register {
    token: string
    agent: Agent
    contract: Contract
    faction: Faction
    ship: Ship
}
