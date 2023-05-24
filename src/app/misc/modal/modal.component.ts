import { Component, OnDestroy, OnInit, Type, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalInterface } from 'src/app/interfaces/modal-interface';
import { ModalDirective } from 'src/app/modal.directive';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  template:`<ng-template ModalDirective></ng-template>`
})
export class ModalComponent implements OnInit, OnDestroy {
  @ViewChild(ModalDirective, {static: true}) modalHost!: ModalDirective;
  modalChanged!: Subscription;

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
    const viewContainerRef = this.modalHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<ModalInterface>(modal.modal)
    componentRef.instance.data = modal.data;
    componentRef.instance.closeEvent.subscribe(_ => viewContainerRef.clear());
    // TODO handle custom emitters better
    componentRef.instance.updateShip?.subscribe(ship => modal.data.updateShip?.emit(ship));
  }
}
