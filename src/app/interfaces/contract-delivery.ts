import { Cargo } from "./cargo";
import { Contract } from "./contract";

export interface ContractDelivery {
    contract: Contract
    cargo: Cargo
}
