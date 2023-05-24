export interface Transaction {
    waypointSymbol: string
    shipSymbol: string
    tradeSymbol: string
    type: string
    units: number
    pricePerUnit: number
    totalPrice: number
    timestamp: string
}
