import { Requirements } from "./requirements"

export interface Mount {
    symbol: string
    name: string
    description: string
    strength: number
    deposits: Array<String>
    requirements: Requirements
}
