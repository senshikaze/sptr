import { Component, EventEmitter, Input, Output } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-error-message',
  template: `
    <div class="flex p-2 border-2 bg-light-red border-dark-red text-white w-3/5 fixed top-8 inset-x-0 mx-auto">
      <p class="flex-auto">{{ error }}</p>
      <span class="float-right hover:cursor-pointer" (click)="close()">X</span>
    </div>
  `,
  styles: [
  ]
})
export class ErrorMessageComponent {
  class: string = 'animation-fadeIn';
  timeout: number = 1500;

  @Input() error: string = '';
  @Output() closeError = new EventEmitter<null>();

  ngOnUpdate() {
    timer(this.timeout)
      .subscribe(_ => {
        this.class = 'animation-fadeOut';
        timer(1500)
          .subscribe(_ => {
            this.class = 'animation-fadeIn';
            this.close()
          })
          .unsubscribe()
      })
      .unsubscribe();
  }

  close() {
    this.closeError.emit(null);
  }
}
