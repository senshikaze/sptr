import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterFactions } from '../enums/factions';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
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
