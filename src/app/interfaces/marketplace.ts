import { Good } from "./good"

export interface Marketplace {
    symbol: string
    exports: Good[]
    imports: Good[]
    exchange: Good[]
    transactions: {
        waypointSymbol: string
        shipSymbol: string
        tradeSymbol: string
        type: string
        units: number
        pricePerUnit: number
        totalPrice: number
        timestamp: string
    }[]
    tradeGoods: {
        symbol: string
        tradeVolume: number
        supply: string
        purchasePrice: number
        sellPrice: number
    }[]
}
