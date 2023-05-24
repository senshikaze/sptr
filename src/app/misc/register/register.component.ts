import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { RegisterFactions } from 'src/app/enums/factions';

@Component({
  selector: 'app-register',
  template: `
  <div class="fixed min-h-screen min-w-screen inset-0 bg-opacity-80 bg-gray-dark backdrop-blur-sm">
    <div class="w-72 border-2 border-teal m-auto p-8 bg-gray-dark translate-y-1/2">
        <h2 class="text-2xl">Register</h2>
        <p *ngIf="registerForm.invalid && (registerForm.dirty || registerForm.touched)" class="text-light-red">Form Status: {{ registerForm.status }}</p>
        <form [formGroup]="registerForm" (ngSubmit)="register()">
            <label for="symbol" aria-label="Agent Callsign">Symbol: </label>
            <input class="mb-4 text-black p-1 w-4/5" id="symbol" type="text" formControlName="symbol">
            <label for="faction" aria-label="Agent faction">Faction: </label>
            <select class="mb-4 text-black p-1 w-4/5" id="faction" formControlName="faction">
                <option *ngFor="let faction of factions" [ngValue]="faction">{{faction}}</option>
            </select>
            <button class="border-2 bg-gray-light text-black p-2" type="submit">Register</button>
        </form>
    </div>
  </div>
  `
})
export class RegisterComponent {
  factions: RegisterFactions[] = Object.values(RegisterFactions);

  registerForm = new FormGroup({
    symbol: new FormControl(
      '',
      [
        Validators.required, Validators.minLength(3), Validators.maxLength(14)
      ]
    ),
    faction: new FormControl(this.factions[0], Validators.required)
  });

  constructor(private api: ApiService, private router: Router) {}

  register(): void {
    if (!this.registerForm.value.faction || !this.registerForm.value.symbol) {
      return; // TODO invalidate form
    }
    if (!this.factions.includes(this.registerForm.value.faction)) {
      return; // TODO invalidate form
    }
    this.api.register(
      this.registerForm.value.symbol,
      this.registerForm.value.faction
    ).subscribe(
      access => {
        if (access.token) {
          this.router.navigate(['/']);
        }
      }
    );
  }
}
