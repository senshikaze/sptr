import { Cargo } from "./cargo"
import { Cooldown } from "./cooldown"
import { Yield } from "./yield"

export interface Extract {
    cooldown: Cooldown
    extraction: {
        shipSymbol: string
        yield: Yield
    }
    cargo: Cargo
}
