import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, Subject, map, take, timer } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'src/app/services/message.service';
import { MessageType } from 'src/app/enums/message-type';
import { ModalInterface } from 'src/app/interfaces/modal-interface';
import { Ship } from 'src/app/interfaces/ship';
import { Survey } from 'src/app/interfaces/survey';
import { CooldownService, ShipCooldown } from 'src/app/services/cooldown.service';

@Component({
  selector: 'app-shipmine',
  template: `
  <modal-container (close)="closeEvent.emit(true)">
    <div class="mb-8" *ngIf="data.ship">
      <h2 class="text-xl">Select Survey:</h2>
      <div *ngIf="surveys$ | async as surveys">
        <ul *ngIf="surveys.length > 0 ; else none">
          <li class="px-4 odd:bg-gray-hover" *ngFor="let survey of surveys" title="Survey Expires {{survey.expiration | relativedate }}">
            <div class="flex" [ngClass]="cooldown != null ? 'cursor-wait': 'cursor-pointer'" [title]="title" (click)="mine(data.ship, survey)">
              <spinner *ngIf="cooldown != null" class="my-auto"></spinner>
              {{ survey.signature }} ({{ survey.deposits | joinDeposits }}) {{ survey.size }} <span class="text-red cursor-pointer ml-2 text-lg" (click)="deleteSurvey(survey)" title="Delete this survey">X</span>
            </div>
          </li>
        </ul>
        <ng-template #none><ul><li>No surveys found</li></ul></ng-template>
      </div>
    </div>
    <span actions>
      <button class="border-2 border-teal p-2 m-2 bg-gray-dark hover:text-gray" [ngClass]="cooldown != null ? ['cursor-wait', 'disabled']: []" *ngIf="canSurvey" (click)="survey(data.ship)" title="Survey this waypoint">Survey</button>
      <button class="border-2 border-teal p-2 m-2 bg-gray-dark hover:text-gray" [ngClass]="cooldown != null ? ['cursor-wait', 'disabled']: []" (click)="mine(data.ship)" title="Mine without a survey">Mine</button>
    </span>
  </modal-container>
  `
})
export class MineComponent implements OnInit, OnDestroy, OnChanges, ModalInterface {
  data!: any;

  surveys$!: Observable<Survey[]>;
  cooldown: ShipCooldown | null = null;
  canSurvey: boolean = false;

  @Output() update: EventEmitter<Ship> = new EventEmitter<Ship>();
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  title = "";

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private api: ApiService, public messageService: MessageService, private cooldownService: CooldownService) {}

  ngOnInit(): void {
    // get surveys (may be cached)
    if (this.data.ship) {
      let ship: Ship = this.data.ship as Ship;
      this.surveys$ = this.api.getSurvey(ship);
      this.canSurvey = ship.mounts.filter(m => m.symbol.includes("SURVEYOR")).length > 0;
    } else {
      this.closeEvent.emit(true);
    }

    // check to see if we are in cooldown
    this.cooldownService.getShipCooldown(this.data.ship.symbol).pipe(
      take(1)
    ).subscribe(
      cd => {
        if (cd != null) {
          this.cooldown = cd;
          this.title =`Cooldown expires ${DateTime.fromISO(cd.cooldown.expiration).toRelative()}`;
          timer(DateTime.fromISO(cd.cooldown.expiration).diff(DateTime.now()).milliseconds).pipe(
            take(1)
          ).subscribe(_ => {
            this.title = "";
            this.cooldown = null
          });
        }
      }
    );
  }

  ngOnChanges(): void {
    if (this.data.ship) {
      let ship: Ship = this.data.ship as Ship;
      this.canSurvey = ship.mounts.filter(m => m.symbol.includes("SURVEYOR")).length > 0;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  deleteSurvey(survey: Survey): void {
    this.surveys$ = this.api.deleteSurvey(survey);
  }

  mine(ship: Ship, survey: Survey | null = null): void {
    if (this.cooldown != null) {
      return;
    }
    this.api.postMine(ship, survey).pipe(
      take(1)
    ).subscribe(
      extract => {
        this.messageService.addMessage(
          `Mined ${extract.extraction.yield.units} units of ${extract.extraction.yield.symbol}; Refresh ${DateTime.fromISO(extract.cooldown.expiration).toRelative()}`,
          MessageType.GOOD
        )
        this.update.emit(ship);
        this.closeEvent.emit(true);
      }
    );
  }

  survey(ship: Ship): void {
    this.api.postSurvey(ship).pipe(
      take(1)
    ).subscribe(
      surveys => {
        this.messageService.addMessage(
          `Surveyed ${ship.nav.waypointSymbol}, found ${surveys.length} locations to mine.`,
          MessageType.GOOD
        )
      }
    );
    this.surveys$ = this.api.getSurvey(ship);
  }
}
