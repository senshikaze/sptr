import { Cooldown } from "./cooldown";
import { System } from "./system";

export interface ScanSystems {
    cooldown: Cooldown,
    systems: System[]
}
