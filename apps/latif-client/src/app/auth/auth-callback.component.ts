import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="callback">
      <p>Finishing sign-in...</p>
    </div>
  `,
  styles: [
    `
      .callback {
        text-align: center;
        margin-top: 40px;
      }
    `,
  ],
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') || undefined;
    if (token) {
      this.auth.completeOAuthLogin(token, returnUrl);
    }
  }
}
