import { Component, Input } from '@angular/core';
import { MessageService } from '../services/message.service';
import { timer } from 'rxjs';
import { Message } from '../interfaces/message';
import { MessageType } from '../enums/message-type';

@Component({
  selector: 'app-message',
  template: `
    <div class="relative flex p-2 border-2 mb-2 -z-50" [ngClass]="class">  
      <p class="flex-auto">{{ message.message }}</p>
      <span class="float-right hover:cursor-pointer" (click)="close(message)">X</span>
    </div>
  `
})
export class MessageComponent {
  @Input() message!: Message;
  class: string[] = ["animation-fade-out"];
  timeout: number = 6500;

  constructor(public messageService: MessageService) {}

  ngOnInit() {
    if (this.message.type == MessageType.GOOD) {
      this.class.push("bg-gray-light", "border-gray", "text-gray-dark");
    }
    if (this.message.type == MessageType.ERROR) {
      this.class.push("bg-light-red", "border-dark-red", "text-white");
    }

    timer(5500).subscribe(
      _ => {
        timer(2000).subscribe(
          _ => this.close(this.message)
        )
      }
    )
  }

  close(message: Message) {
    this.messageService.removeMessage(message);
  }
}
