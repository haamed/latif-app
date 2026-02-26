import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthService } from './auth/auth.service';

@Component({
  imports: [CommonModule, RouterModule],

  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'latif-client';
  protected auth = inject(AuthService);

  protected logout() {
    this.auth.logout();
  }
}
