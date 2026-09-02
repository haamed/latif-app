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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { Fluid } from 'primeng/fluid';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslatePipe,
    Button,
    Card,
    FloatLabel,
    Fluid,
    InputText,
    Message,
    Password,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-page">
      <div class="login-page__aside">
        <span class="login-page__brand-mark"
          ><i class="pi pi-compass"></i
        ></span>
        <h1 class="login-page__title">{{ 'app.name' | translate }}</h1>
        <p class="login-page__tagline">
          {{ 'login.tagline' | translate }}
        </p>
      </div>

      <div class="login-page__panel">
        <p-card styleClass="login-card">
          <h2 class="login-card__title">{{ 'login.welcome' | translate }}</h2>
          <p class="login-card__subtitle">
            {{ 'login.subtitle' | translate }}
          </p>

          <p-fluid>
            <form
              [formGroup]="form"
              (ngSubmit)="onSubmit()"
              class="login-form"
              autocomplete="on"
            >
              <p-floatlabel variant="on" class="login-form__field">
                <input
                  pInputText
                  id="email"
                  type="email"
                  formControlName="email"
                />
                <label for="email">{{ 'login.email' | translate }}</label>
              </p-floatlabel>

              <p-floatlabel variant="on" class="login-form__field">
                <p-password
                  id="password"
                  formControlName="password"
                  [feedback]="false"
                  [toggleMask]="true"
                />
                <label for="password">{{ 'login.password' | translate }}</label>
              </p-floatlabel>

              @if (error) {
                <p-message severity="error" [text]="error" styleClass="w-full" />
              }

              <p-button
                type="submit"
                [label]="(loading ? 'login.signingIn' : 'login.login') | translate"
                [loading]="loading"
                [disabled]="form.invalid"
                styleClass="w-full"
              />
            </form>
          </p-fluid>

          <div class="login-form__divider"><span>{{ 'login.or' | translate }}</span></div>

          <p-button
            type="button"
            [label]="'login.google' | translate"
            icon="pi pi-google"
            [outlined]="true"
            styleClass="w-full"
            (onClick)="onGoogle()"
          />
        </p-card>
      </div>
    </div>
  `,
  styles: [
    `
      .login-page {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 1fr;

        @media (min-width: 900px) {
          grid-template-columns: 1.1fr 1fr;
        }
      }

      .login-page__aside {
        display: none;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
        padding: 4rem;
        color: #fff;
        background: linear-gradient(
          135deg,
          var(--p-primary-600),
          var(--p-primary-800)
        );

        @media (min-width: 900px) {
          display: flex;
        }
      }

      .login-page__brand-mark {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
        height: 3rem;
        border-radius: 1rem;
        background: rgba(255, 255, 255, 0.15);
        font-size: 1.4rem;
        margin-bottom: 0.5rem;
      }

      .login-page__title {
        font-size: 2.4rem;
        font-weight: 800;
        margin: 0;
        letter-spacing: -0.02em;
      }

      .login-page__tagline {
        max-width: 26rem;
        font-size: 1.05rem;
        opacity: 0.85;
        line-height: 1.6;
      }

      .login-page__panel {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem 1.25rem;
        background: var(--p-surface-50);
      }

      :host ::ng-deep .login-card {
        width: 100%;
        max-width: 26rem;
        border-radius: 1.25rem;
        box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.15);
      }

      .login-card__title {
        margin: 0 0 0.25rem;
        font-size: 1.5rem;
        font-weight: 700;
      }

      .login-card__subtitle {
        margin: 0 0 1.75rem;
        color: var(--p-surface-500);
        font-size: 0.95rem;
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .login-form__field {
        display: block;
      }

      .login-form__divider {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin: 1.5rem 0;
        color: var(--p-surface-400);
        font-size: 0.85rem;

        &::before,
        &::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--p-surface-200);
        }
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
  private readonly translate = inject(TranslateService);

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
          this.error =
            err?.error?.message || this.translate.instant('login.genericError');
          this.cdr.markForCheck();
        },
      });
  }

  onGoogle() {
    const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') || undefined;
    this.auth.startGoogleLogin(returnUrl);
  }
}
