import { Requirements } from "./requirements"

export interface Engine {
    symbol: string
    name: string
    description: string
    condition: number
    speed: string
    requirements: Requirements
}
