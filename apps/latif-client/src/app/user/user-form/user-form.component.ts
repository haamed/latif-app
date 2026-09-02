import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { Fluid } from 'primeng/fluid';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { UserService } from '../user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-form',
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
    Password,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="user-form">
      <div class="user-form__header">
        <a routerLink="/users" class="user-form__back">
          <i class="pi pi-arrow-left"></i>
        </a>
        <div>
          <h1 class="user-form__title">
            {{ (isEditMode ? 'userForm.editTitle' : 'userForm.createTitle') | translate }}
          </h1>
          <p class="user-form__subtitle">
            {{ (isEditMode ? 'userForm.editSubtitle' : 'userForm.createSubtitle') | translate }}
          </p>
        </div>
      </div>

      <p-card styleClass="user-form__card">
        <p-fluid>
          <form
            [formGroup]="userForm"
            (ngSubmit)="onSubmit()"
            class="user-form__form"
          >
            <p-floatlabel variant="on">
              <input pInputText id="name" type="text" formControlName="name" />
              <label for="name">{{ 'userForm.name' | translate }}</label>
            </p-floatlabel>

            <p-floatlabel variant="on">
              <input
                pInputText
                id="email"
                type="email"
                formControlName="email"
              />
              <label for="email">{{ 'userForm.email' | translate }}</label>
            </p-floatlabel>

            @if (!isEditMode) {
              <p-floatlabel variant="on">
                <p-password
                  id="password"
                  formControlName="password"
                  [toggleMask]="true"
                />
                <label for="password">{{ 'userForm.password' | translate }}</label>
              </p-floatlabel>
            }

            <div class="user-form__actions">
              <a routerLink="/users">
                <p-button
                  type="button"
                  [label]="'userForm.cancel' | translate"
                  severity="secondary"
                  [outlined]="true"
                />
              </a>
              <p-button
                type="submit"
                [label]="'userForm.save' | translate"
                icon="pi pi-check"
                [disabled]="userForm.invalid"
              />
            </div>
          </form>
        </p-fluid>
      </p-card>
    </div>
  `,
  styles: [
    `
      .user-form {
        max-width: 34rem;
        margin: 0 auto;
      }

      .user-form__header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .user-form__back {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.4rem;
        height: 2.4rem;
        border-radius: 0.7rem;
        background: var(--p-surface-100);
        color: var(--p-surface-700);
        text-decoration: none;
        flex-shrink: 0;

        &:hover {
          background: var(--p-surface-200);
        }
      }

      .user-form__title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 800;
        letter-spacing: -0.02em;
      }

      .user-form__subtitle {
        margin: 0.2rem 0 0;
        color: var(--p-surface-500);
        font-size: 0.9rem;
      }

      :host ::ng-deep .user-form__card {
        border-radius: 1.1rem;
        box-shadow: 0 20px 45px -25px rgba(0, 0, 0, 0.2);
      }

      .user-form__form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .user-form__actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  constructor() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
    });
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.isEditMode = true;
          this.userId = +id;
          this.loadUser(this.userId);
          this.userForm.get('password')?.clearValidators();
          this.userForm.get('password')?.updateValueAndValidity();
        } else {
          this.isEditMode = false;
          this.userId = null;
          this.userForm.get('password')?.setValidators(Validators.required);
          this.userForm.get('password')?.updateValueAndValidity();
        }
        this.cdr.markForCheck();
      });
  }

  loadUser(id: number) {
    this.userService
      .findOne(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
        });
        this.cdr.markForCheck();
      });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const request$ =
      this.isEditMode && this.userId
        ? this.userService.update(this.userId, this.userForm.value)
        : this.userService.create(this.userForm.value);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant(
            this.isEditMode ? 'userForm.updatedSummary' : 'userForm.createdSummary',
          ),
          detail: this.translate.instant(
            this.isEditMode ? 'userForm.updatedDetail' : 'userForm.createdDetail',
          ),
        });
        this.router.navigate(['/users']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('userForm.errorSummary'),
          detail: this.translate.instant('userForm.errorDetail'),
        });
      },
    });
  }
}
