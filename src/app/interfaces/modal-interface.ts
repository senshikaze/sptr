import { EventEmitter } from "@angular/core";
import { Ship } from "./ship";
import { Waypoint } from "./waypoint";

export interface ModalInterface {
    data: any;
    closeEvent: EventEmitter<boolean>;
    update: EventEmitter<any>;
}
