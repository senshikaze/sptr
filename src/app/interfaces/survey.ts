import { Deposit } from "./deposit"

export interface Survey {
    signature: string
    symbol: string
    deposits: Deposit[]
    expiration: string
    size: string
}
