import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div>
          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" />
        </div>
        <div>
          <label for="password">Password</label>
          <input id="password" type="password" formControlName="password" />
        </div>
        <button type="submit" [disabled]="form.invalid || loading">
          {{ loading ? 'Signing in...' : 'Login' }}
        </button>
      </form>
      <p class="error" *ngIf="error">{{ error }}</p>
    </div>
  `,
  styles: [
    `
      .login-container {
        max-width: 360px;
        margin: 40px auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      label {
        display: block;
        margin-bottom: 4px;
      }
      input {
        width: 100%;
        padding: 8px;
        margin-bottom: 12px;
        box-sizing: border-box;
      }
      button {
        width: 100%;
        padding: 10px;
      }
      .error {
        color: #c00;
        margin-top: 10px;
      }
    `,
  ],
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';

  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.cdr.markForCheck();

    this.auth
      .login(this.form.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading = false;
          this.cdr.markForCheck();
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          this.router.navigate([returnUrl || '/users']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || 'Login failed';
          this.cdr.markForCheck();
        },
      });
  }
}
