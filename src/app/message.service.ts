import { Injectable } from '@angular/core';
import { MessageType } from './enums/message-type';
import { Message } from './interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];

  constructor() { }

  addMessage(message: string, type: MessageType): void {
    this.messages.push({message: message, type: type});
  }

  removeMessage(message: Message): void {
    this.messages.splice(this.messages.indexOf(message), 1);
  }
}
