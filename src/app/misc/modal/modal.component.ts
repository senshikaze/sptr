import { Component, ComponentRef, EventEmitter, OnDestroy, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalInterface } from 'src/app/interfaces/modal-interface';
import { ModalDirective } from 'src/app/modal.directive';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  template:`
     <ng-template ModalDirective></ng-template>
  `
})
export class ModalComponent implements OnInit, OnDestroy {
  @ViewChild(ModalDirective, {static: true}) modalHost!: ModalDirective;
  close: EventEmitter<boolean> = new EventEmitter<boolean>();
  modalChanged!: Subscription;
  show: boolean = false;

  constructor(public modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modalsChanged$.subscribe(
      modal => this.loadModal(modal)
    );
  }
  ngOnDestroy(): void {
    this.modalChanged.unsubscribe();
  }

  loadModal(modal: {modal: Type<ModalInterface>, data: any}) {
    this.show = true;
    const viewContainerRef = this.modalHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<ModalInterface>(modal.modal)
    componentRef.instance.data = modal.data;
    componentRef.instance.closeEvent.subscribe(_ => viewContainerRef.clear());
    componentRef.instance.update.subscribe(data => modal.data.update.emit(data));
    this.close.subscribe(_ => viewContainerRef.clear());
  }
}
