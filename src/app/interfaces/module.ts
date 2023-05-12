import { Requirements } from "./requirements"

export interface Module {
    symbol: string
    capacity: number
    range: number
    name: string
    description: string
    requirements: Requirements
}
