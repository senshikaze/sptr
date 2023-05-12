import { Faction } from "./faction"

export interface Waypoint {
    symbol: string
    type: string
    systemSymbol: string
    x: number
    y: number
    orbitals: {
        symbol: string
    }[]
    faction: { 
        symbol: string
    }
    traits: {
        symbol: string
        name: string
        description: string
    }[]
    chart: {
        waypointSybmol: string
        submittedBy: string
        submittedOn: string
    }
}
