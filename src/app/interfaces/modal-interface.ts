import { EventEmitter } from "@angular/core";
import { Ship } from "./ship";

export interface ModalInterface {
    data: any;
    closeEvent: EventEmitter<boolean>;
    updateShip?: EventEmitter<Ship>;
}
