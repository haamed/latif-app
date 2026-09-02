import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ProgressSpinner } from 'primeng/progressspinner';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [ProgressSpinner, TranslatePipe],
  template: `
    <div class="callback">
      <p-progressspinner
        strokeWidth="4"
        styleClass="callback__spinner"
        ariaLabel="Signing in"
      />
      <p>{{ 'authCallback.finishing' | translate }}</p>
    </div>
  `,
  styles: [
    `
      .callback {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        color: var(--p-surface-500);
      }

      :host ::ng-deep .callback__spinner {
        width: 3rem;
        height: 3rem;
      }
    `,
  ],
})
export class AuthCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') || undefined;
    if (token) {
      this.auth.completeOAuthLogin(token, returnUrl);
    }
  }
}
