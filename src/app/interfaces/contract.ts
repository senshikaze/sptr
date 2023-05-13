export interface Contract {
    id: string
    factionSymbol: string
    type: string
    terms: {
        deadline: string
        payment: {
            onAccepted: number
            onFulfilled: number
        }
        deliver:
        {
            tradeSymbol: string
            destinationSymbol: string
            unitsRequired: number
            unitsFulfilled: number
        }[]
    }
    accepted: boolean
    fulfilled: boolean
    expiration: string
}
