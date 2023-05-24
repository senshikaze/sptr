import { Cooldown } from "./cooldown";
import { Nav } from "./nav";

export interface JumpAction {
    cooldown: Cooldown
    nav: Nav
}
