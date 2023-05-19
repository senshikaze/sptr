import { Component, Input, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { Marketplace } from 'src/app/interfaces/marketplace';
import { Waypoint } from 'src/app/interfaces/waypoint';

@Component({
  selector: 'app-marketplace',
  template: `
    <div class="ml-4 mb-4" *ngIf="marketplace$ | async as marketplace">
      <div class="mb-4">
        <h2 class="text-xl">Market</h2>
        <table class="table-auto">
          <thead>
            <tr>
              <th class="px-4 text-left">Symbol</th>
              <th class="px-4 text-left">Trade Volume</th>
              <th class="px-4 text-left">Supply</th>
              <th class="px-4 text-left" title="Credits per unit">Buy</th>
              <th class="px-4 text-left" title="Credits per unit">Sell</th>
            </tr>
          </thead>
          <tbody>
            <tr class="odd:bg-gray-hover" *ngFor="let good of marketplace.tradeGoods">
              <th class="px-4 text-left">{{ good.symbol }}</th>
              <th class="px-4 text-left">{{ good.tradeVolume }}</th>
              <th class="px-4 text-left">{{ good.supply }}</th>
              <th class="px-4 text-left">{{ good.purchasePrice }} c</th>
              <th class="px-4 text-left">{{ good.sellPrice }} c</th>
              <th><button class="border-2 border-teal p-2 m-2 bg-gray-dark hover:text-gray" (click)="buy(good.symbol)">Buy</button></th>
              <th><button class="border-2 border-teal p-2 m-2 bg-gray-dark hover:text-gray" (click)="sell(good.symbol)">Sell</button></th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class MarketplaceComponent implements OnInit {
  @Input() waypoint!: Waypoint;

  marketplace$!: Observable<Marketplace>;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.marketplace$ = this.api.get<Marketplace>(
      `systems/${this.waypoint.systemSymbol}/waypoints/${this.waypoint.symbol}/market`
    ).pipe(
      map(response => response.data)
    );
  }

  buy(goodSymbol: string) {

  }

  sell(goodSymbol: string) {

  }
}
