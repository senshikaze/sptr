import { Injectable } from '@angular/core';
import { Ship } from '../interfaces/ship';
import { Cooldown } from '../interfaces/cooldown';
import { Observable, map, of, take, timer } from 'rxjs';
import { DateTime } from 'luxon';
import { NodeWithI18n } from '@angular/compiler';

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
    // save to local storage
    this.saveShipCooldown();
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
  getShipCooldown(shipSymbol: string): Observable<ShipCooldown | null> {
    if (this.cooldown.length == 0) {
      // try loading from local storage, we may have refreshed
      this.cooldown = JSON.parse(localStorage.getItem('cooldowns') ?? '[]') as ShipCooldown[];
    }
    return of(this.cooldown).pipe(
      map(cd => {
        // remove any expired cooldowns and resave
        cd = cd.filter(sc => DateTime.fromISO(sc.cooldown.expiration) > DateTime.now());
        this.cooldown = cd;
        this.saveShipCooldown();
        // there can be only one ShipCooldown per ship
        let shipCd = cd.filter(sc => sc.ship.symbol == shipSymbol);
        if (shipCd.length == 0) {
          return null;
        }
        return shipCd[0];
      })
    )
  }

  /**
   * Remove entry from cooldown with the shipSymbol if exists
   * @param shipSymbol 
   */
  removeShipCooldown(shipSymbol: string): void {
    this.cooldown = this.cooldown.filter(cd => cd.ship.symbol != shipSymbol);
    this.saveShipCooldown();
  }

  /**
   * cache cooldown to local storage
   * @param shipCooldown 
   */
  saveShipCooldown(): void {
    localStorage.setItem('cooldowns', JSON.stringify(this.cooldown));
  }
}
