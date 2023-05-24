import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ModalDirective]'
})
export class ModalDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
