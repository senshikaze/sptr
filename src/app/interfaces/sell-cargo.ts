import { Agent } from "./agent";
import { Cargo } from "./cargo";
import { Transaction } from "./transaction";

export interface SellCargo {
    agent: Agent
    cargo: Cargo
    transaction: Transaction
}
