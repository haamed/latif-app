import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';

import { AuthService } from './auth/auth.service';
import { LanguageService } from './core/language.service';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslatePipe,
    Avatar,
    Button,
    ConfirmDialog,
    Select,
    Toast,
    Tooltip,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'latif-client';
  protected auth = inject(AuthService);
  protected languageService = inject(LanguageService);

  protected get currentUser() {
    return this.auth.getCurrentUser();
  }

  protected get userInitials(): string {
    return this.currentUser?.email?.charAt(0).toUpperCase() ?? '?';
  }

  protected logout() {
    this.auth.logout();
  }
}
