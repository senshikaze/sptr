import { Trait } from "./trait"

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
    traits: Trait[]
    chart: {
        waypointSybmol: string
        submittedBy: string
        submittedOn: string
    }
}
