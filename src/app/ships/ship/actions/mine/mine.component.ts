import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { MessageType } from 'src/app/enums/message-type';
import { Extract } from 'src/app/interfaces/extract';
import { Ship } from 'src/app/interfaces/ship';
import { Survey } from 'src/app/interfaces/survey';
import { MessageService } from 'src/app/message.service';

@Component({
  selector: 'app-mine',
  template: `
    <div class="fixed min-h-screen min-w-screen inset-0 bg-opacity-80 bg-gray-dark backdrop-blur-sm">
      <div class="w-96 border-2 border-teal m-auto p-8 bg-gray-dark translate-y-1/2">
        <div class="mb-8">  
          <h2 class="text-xl">Select Survey:</h2>
          <ul *ngIf="surveys$ | async as surveys">
            <li class="px-4 cursor-pointer odd:bg-gray-hover" *ngFor="let survey of surveys" (click)="mine(survey)" title="Expires: {{survey.expiration | relativedate}}">{{ survey.signature }} ({{ survey.deposits | joinDeposits }}) {{ survey.size }}</li>
          </ul>
        </div>
        <button class="absolute right-2 bottom-2 border-2 border-teal p-2 m-2 bg-gray-dark hover:text-gray" (click)="close()">Cancel</button>
      </div>
    </div>
  `
})
export class MineComponent implements OnInit, OnDestroy {
  @Input() ship!: Ship;
  surveys$!: Observable<Survey[]>;

  @Output() mineEmitter: EventEmitter<Ship> = new EventEmitter<Ship>();
  @Output() mineClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private api: ApiService, public messageServie: MessageService) {}

  ngOnInit(): void {
    // get surveys (may be cached)
    this.surveys$ = this.api.postSurvey(this.ship).pipe(
      map(surveys => {
        if (surveys.length == 0) {
          this.close();
        }
        return surveys;
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  close() {
    this.mineClose.emit(true);
  }

  mine(survey: Survey): void {
    this.api.post<Extract>(
      `my/ships/${this.ship.symbol}/extract`,
      {
        'survey': survey
      }
    ).pipe(
      takeUntil(this.destroy$),
      map(response => response.data)
    ).subscribe(
      extract => {
        this.messageServie.addMessage(
          `Mined ${extract.extraction.yield.units} units of ${extract.extraction.yield.symbol}; Refresh ${DateTime.fromISO(extract.cooldown.expiration).toRelative()}`,
          MessageType.GOOD
        )
        this.mineEmitter.emit(this.ship);
      }
    );
  }
}