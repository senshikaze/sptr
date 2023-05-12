import { Inventory } from "./inventory"

export interface Cargo {
    capacity: number
    units: number
    inventory: Inventory[]
}
