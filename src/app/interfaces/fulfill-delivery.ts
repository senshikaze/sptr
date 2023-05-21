import { Agent } from "./agent";
import { Contract } from "./contract";

export interface FulfillDelivery {
    contract: Contract
    agent: Agent
}
