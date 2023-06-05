import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'src/app/services/message.service';
import { Inventory } from 'src/app/interfaces/inventory';
import { Ship } from 'src/app/interfaces/ship';
import { Subject, map, take, takeUntil } from 'rxjs';
import { MessageType } from 'src/app/enums/message-type';
import { ModalInterface } from 'src/app/interfaces/modal-interface';
import { Marketplace } from 'src/app/interfaces/marketplace';

@Component({
  selector: 'app-shipsell',
  template: `
    <div class="fixed min-h-screen min-w-screen inset-0 bg-opacity-80 bg-gray-dark backdrop-blur-sm" *ngIf="data.ship && data.inventory" (click)="closeEvent.emit(true)">
      <div class="relative w-3/12 max-h-5/6 border-2 border-teal mx-auto my-44 p-8 bg-gray-dark" (click)="$event.stopPropagation()">
        <div class="mb-8">  
          <h2 class="text-xl">Sell Units for {{price}}:</h2>
          <input class="p-2 text-black" type="number" min="0" max="{{data.inventory?.units ?? 0}}" [(ngModel)]="units">
        </div>
        <div class="absolute right-2 bottom-2">
          <button class="border-2 border-teal p-2 m-2 bg-gray-dark hover:text-gray" (click)="sell(data.ship, data.inventory)">Sell</button>
          <button class="border-2 border-teal p-2 m-2 bg-gray-dark hover:text-gray" (click)="closeEvent.emit(true)">Cancel</button>
        </div>
      </div>
    </div>
  `
})
export class SellComponent implements OnInit, OnDestroy, ModalInterface {
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() update: EventEmitter<Ship> = new EventEmitter<Ship>();

  data!: any;
  units: number = 0;
  price: number = 0;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private api: ApiService, public messageService: MessageService) {}
  ngOnInit(): void {
    if (this.data.ship && this.data.inventory) {
      this.units = this.data.inventory.units;

      this.api.get<Marketplace>(
        `/systems/${this.data.ship.nav.systemSymbol}/waypoints/${this.data.ship.nav.waypointSymbol}/market`
      ).pipe(
        takeUntil(this.destroy$),
        map(response => response.data)
      ).subscribe(
        m => m.tradeGoods.filter(tg => tg.symbol == this.data.inventory.symbol)[0].sellPrice
      )
    } else {
      this.closeEvent.emit(true);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  sell(ship: Ship, inventory: Inventory) {
    if (this.units > 0 && inventory) {
      this.api.postSellCargo(ship, inventory, this.units).pipe(
        take(1)
      ).subscribe(transaction => {
        this.messageService.addMessage(
          `Sold ${transaction.transaction.units} ${transaction.transaction.tradeSymbol} for ${transaction.transaction.totalPrice} c`,
          MessageType.GOOD
        )
        this.update.emit(ship);
        this.closeEvent.emit(true);
      });
    }
  }
}
