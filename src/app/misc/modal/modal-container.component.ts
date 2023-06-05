import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'modal-container',
  template: `
    <div class="fixed min-h-full min-w-full inset-0 bg-opacity-80 bg-gray-dark backdrop-blur-sm" (click)="close.emit(true)">
      <div class="relative w-3/12 max-h-5/6 min-h-1/4 border-2 border-teal mx-auto my-32 p-8 bg-gray-dark max-h-1/2" (click)="$event.stopPropagation()">
        <ng-content></ng-content>
        <div class="absolute right-2 bottom-2 mt-8">
          <ng-content select="[actions]"></ng-content>
          <button class="border-2 border-teal p-2 m-2 bg-gray-dark hover:text-gray" (click)="close.emit(true)">Cancel</button>
        </div>
      </div>
    </div>
  `
})
export class ModalContainerComponent {
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
}
