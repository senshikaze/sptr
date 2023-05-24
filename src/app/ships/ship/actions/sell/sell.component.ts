import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'src/app/services/message.service';
import { Inventory } from 'src/app/interfaces/inventory';
import { Ship } from 'src/app/interfaces/ship';
import { SellCargo } from 'src/app/interfaces/sell-cargo';
import { Subject, map, takeUntil } from 'rxjs';
import { MessageType } from 'src/app/enums/message-type';
import { ModalInterface } from 'src/app/interfaces/modal-interface';

@Component({
  selector: 'app-shipsell',
  template: `
    <div class="fixed min-h-screen min-w-screen inset-0 bg-opacity-80 bg-gray-dark backdrop-blur-sm" *ngIf="data.ship && data.inventory" (click)="closeEvent.emit(true)">
      <div class="w-96 border-2 border-teal mx-auto my-44 p-8 bg-gray-dark" (click)="$event.stopPropagation()">
        <div class="mb-8">  
          <h2 class="text-xl">Sell Units:</h2>
          <input class="p-2 text-black" type="number" min="0" max="{{data.inventory?.units ?? 0}}" [value]="units">
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
  data!: any;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  units: number = 0;

  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updateShip: EventEmitter<Ship> = new EventEmitter<Ship>();

  constructor(private api: ApiService, public messageService: MessageService) {}
  ngOnInit(): void {
    if (this.data.ship && this.data.inventory) {
      this.units = this.data.inventory.units;
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
      this.api.post<SellCargo>(
        `my/ships/${ship.symbol}/sell`,
        {
          'symbol': inventory.symbol,
          'units': this.units
        }
      ).pipe(
        takeUntil(this.destroy$),
        map(response => response.data)
      ).subscribe(transaction => {
        this.messageService.addMessage(
          `Sold ${transaction.transaction.units} ${transaction.transaction.tradeSymbol} for ${transaction.transaction.totalPrice} c`,
          MessageType.GOOD
        )
        this.updateShip.emit(ship);
        this.closeEvent.emit(true);
      });
    }
  }
}
