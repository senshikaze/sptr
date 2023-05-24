import { Injectable, Type } from '@angular/core';
import { ModalInterface } from '../interfaces/modal-interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalsChanged$: Subject<{modal: Type<ModalInterface>, data: any}> = new Subject<{modal: Type<ModalInterface>, data: any}>();

  constructor() {}

  addModal(component: Type<ModalInterface>, data: any) {
    this.modalsChanged$.next({modal: component, data: data});
  }

}
