import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ModalDirective]'
})
export class ModalDirectiveDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
