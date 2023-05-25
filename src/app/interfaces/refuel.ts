import { Agent } from "./agent";
import { Fuel } from "./fuel";
import { Transaction } from "./transaction";

export interface RefuelTransaction {
    agent: Agent
    fuel: Fuel
    transaction: Transaction
}
