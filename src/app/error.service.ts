import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  errored: boolean = false;
  error: string = '';

  constructor() { }

  setError(errored: boolean, error: string) {
    this.errored = errored;
    this.error = error;
  }
}
