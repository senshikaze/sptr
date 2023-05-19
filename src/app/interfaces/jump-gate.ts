import { System } from "./system"

export interface JumpGate {
    jumpRange: number
    factionSymbol: string
    connectedSystems: System[]
}
