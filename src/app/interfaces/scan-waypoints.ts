import { Cooldown } from "./cooldown";
import { Waypoint } from "./waypoint";

export interface ScanWaypoints {
    cooldown: Cooldown
    waypoints: Waypoint[];
}
