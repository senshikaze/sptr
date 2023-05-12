import { Requirements } from "./requirements"

export interface Frame {
    symbol: string
    name: string
    description: string
    condition: number
    moduleSlots: number
    mountingPoints: number
    fuelCapacity: number
    requirements: Requirements
}
