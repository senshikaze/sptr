import { Good } from "./good"
import { Transaction } from "./transaction"

export interface Marketplace {
    symbol: string
    exports: Good[]
    imports: Good[]
    exchange: Good[]
    transactions: Transaction[]
    tradeGoods: {
        symbol: string
        tradeVolume: number
        supply: string
        purchasePrice: number
        sellPrice: number
    }[]
}
