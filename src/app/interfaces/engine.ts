import { Requirements } from "./requirements"

export interface Engine {
    symbol: string
    name: string
    description: string
    condition: string
    speed: string
    requirements: Requirements
}
