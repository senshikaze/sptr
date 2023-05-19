import { SystemType } from "../enums/system-type"

export interface System {
    symbol: string
    sectorSymbol: string
    type: SystemType
    x: number
    y: number
    waypoints: {
        symbol: string
        type: string
        x: number
        y: number
    }[]
    factions: {
        symbol: string
    }[]
    distance: number
}
