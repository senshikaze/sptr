import { Requirements } from "./requirements"

export interface Reactor {
    symbol: string
    name: string
    description: string
    condition: number
    powerOutput: number
    requirements: Requirements
}
