export interface Fuel {
    current: number
    capacity: number
    consumed: {
        amount: number
        timestamp: number
    }
}
