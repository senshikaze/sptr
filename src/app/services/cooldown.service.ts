import { Injectable } from '@angular/core';
import { Ship } from '../interfaces/ship';
import { Cooldown } from '../interfaces/cooldown';
import { take, timer } from 'rxjs';
import { DateTime } from 'luxon';

export type ShipCooldown = {
  ship: Ship
  cooldown: Cooldown
};

@Injectable({
  providedIn: 'root'
})
export class CooldownService {
  private cooldown: ShipCooldown[] = [];

  constructor() { }

  /**
   * Add a cooldown for this ship, replacing any existing one,
   * starts a timer for when the cooldown expires
   * @param ship the ship with the cooldown
   * @param cooldown the cooldown
   */
  addCooldown(ship: Ship, cooldown: Cooldown): void {
    this.removeShipCooldown(ship.symbol);
    this.cooldown.push({ship: ship, cooldown: cooldown});
    timer(DateTime.fromISO(cooldown.expiration).diff(DateTime.now()).milliseconds).pipe(
      take(1)
    ).subscribe(
      _ => this.removeShipCooldown(ship.symbol)
    );
  }

  /**
   * Get any cooldown that exists for this ship
   * @param shipSymbol the shipSymbol
   * @returns Cooldown if found, else null
   */
  getShipCooldown(shipSymbol: string): Cooldown | null {
    // this seems weird, but addCooldown will enfoce there only being one cooldown per ship
    return this.cooldown.filter(sc => sc.ship.symbol == shipSymbol).map(sc => sc.cooldown)[0];
  }

  /**
   * Remove entry from cooldown with the shipSymbol if exists
   * @param shipSymbol 
   */
  removeShipCooldown(shipSymbol: string): void {
    this.cooldown = this.cooldown.filter(cd => cd.ship.symbol != shipSymbol);
  }
}
