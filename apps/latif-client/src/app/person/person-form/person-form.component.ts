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
import { Divider } from 'primeng/divider';
import { FloatLabel } from 'primeng/floatlabel';
import { Fluid } from 'primeng/fluid';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { PersonService } from '../person.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-person-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterModule,
        TranslatePipe,
        Button,
        Card,
        Divider,
        FloatLabel,
        Fluid,
        InputText,
        Textarea,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="person-form">
      <div class="person-form__header">
        <a routerLink="/people" class="person-form__back">
          <i class="pi pi-arrow-left"></i>
        </a>
        <div>
          <h1 class="person-form__title">
            {{ (isEditMode ? 'personForm.editTitle' : 'personForm.createTitle') | translate }}
          </h1>
          <p class="person-form__subtitle">
            {{ (isEditMode ? 'personForm.editSubtitle' : 'personForm.createSubtitle') | translate }}
          </p>
        </div>
      </div>

      <p-card styleClass="person-form__card">
        <p-fluid>
          <form
            [formGroup]="personForm"
            (ngSubmit)="onSubmit()"
            class="person-form__form"
          >
            <div class="person-form__row">
              <p-floatlabel variant="on">
                <input pInputText id="firstName" type="text" formControlName="firstName" />
                <label for="firstName">{{ 'personForm.firstName' | translate }}</label>
              </p-floatlabel>

              <p-floatlabel variant="on">
                <input pInputText id="lastName" type="text" formControlName="lastName" />
                <label for="lastName">{{ 'personForm.lastName' | translate }}</label>
              </p-floatlabel>
            </div>

            <div class="person-form__row">
              <p-floatlabel variant="on">
                <input pInputText id="email" type="email" formControlName="email" />
                <label for="email">{{ 'personForm.email' | translate }}</label>
              </p-floatlabel>

              <p-floatlabel variant="on">
                <input pInputText id="phone" type="tel" formControlName="phone" />
                <label for="phone">{{ 'personForm.phone' | translate }}</label>
              </p-floatlabel>
            </div>

            <p-divider align="left">
              <span class="person-form__divider-label">{{ 'personForm.address' | translate }}</span>
            </p-divider>

            <p-floatlabel variant="on">
              <input pInputText id="addressLine1" type="text" formControlName="addressLine1" />
              <label for="addressLine1">{{ 'personForm.addressLine1' | translate }}</label>
            </p-floatlabel>

            <p-floatlabel variant="on">
              <input pInputText id="addressLine2" type="text" formControlName="addressLine2" />
              <label for="addressLine2">{{ 'personForm.addressLine2' | translate }}</label>
            </p-floatlabel>

            <div class="person-form__row">
              <p-floatlabel variant="on">
                <input pInputText id="city" type="text" formControlName="city" />
                <label for="city">{{ 'personForm.city' | translate }}</label>
              </p-floatlabel>

              <p-floatlabel variant="on">
                <input pInputText id="state" type="text" formControlName="state" />
                <label for="state">{{ 'personForm.state' | translate }}</label>
              </p-floatlabel>
            </div>

            <div class="person-form__row">
              <p-floatlabel variant="on">
                <input pInputText id="postalCode" type="text" formControlName="postalCode" />
                <label for="postalCode">{{ 'personForm.postalCode' | translate }}</label>
              </p-floatlabel>

              <p-floatlabel variant="on">
                <input pInputText id="country" type="text" formControlName="country" />
                <label for="country">{{ 'personForm.country' | translate }}</label>
              </p-floatlabel>
            </div>

            <p-floatlabel variant="on">
              <textarea pTextarea id="notes" rows="3" formControlName="notes"></textarea>
              <label for="notes">{{ 'personForm.notes' | translate }}</label>
            </p-floatlabel>

            <div class="person-form__actions">
              <a routerLink="/people">
                <p-button
                  type="button"
                  [label]="'personForm.cancel' | translate"
                  severity="secondary"
                  [outlined]="true"
                />
              </a>
              <p-button
                type="submit"
                [label]="'personForm.save' | translate"
                icon="pi pi-check"
                [disabled]="personForm.invalid"
              />
            </div>
          </form>
        </p-fluid>
      </p-card>
    </div>
  `,
    styles: [
        `
      .person-form {
        max-width: 40rem;
        margin: 0 auto;
      }

      .person-form__header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .person-form__back {
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

      .person-form__title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 800;
        letter-spacing: -0.02em;
      }

      .person-form__subtitle {
        margin: 0.2rem 0 0;
        color: var(--p-surface-500);
        font-size: 0.9rem;
      }

      :host ::ng-deep .person-form__card {
        border-radius: 1.1rem;
        box-shadow: 0 20px 45px -25px rgba(0, 0, 0, 0.2);
      }

      .person-form__form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .person-form__row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;

        @media (min-width: 560px) {
          grid-template-columns: 1fr 1fr;
        }
      }

      .person-form__divider-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--p-surface-500);
      }

      .person-form__actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }
    `,
    ],
})
export class PersonFormComponent implements OnInit {
    personForm: FormGroup;
    isEditMode = false;
    personId: number | null = null;
    private fb = inject(FormBuilder);
    private personService = inject(PersonService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly messageService = inject(MessageService);
    private readonly translate = inject(TranslateService);

    constructor() {
        this.personForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.email],
            phone: [''],
            addressLine1: [''],
            addressLine2: [''],
            city: [''],
            state: [''],
            postalCode: [''],
            country: [''],
            notes: [''],
        });
    }

    ngOnInit() {
        this.route.paramMap
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((params) => {
                const id = params.get('id');
                if (id) {
                    this.isEditMode = true;
                    this.personId = +id;
                    this.loadPerson(this.personId);
                } else {
                    this.isEditMode = false;
                    this.personId = null;
                }
                this.cdr.markForCheck();
            });
    }

    loadPerson(id: number) {
        this.personService
            .findOne(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((person) => {
                this.personForm.patchValue(person);
                this.cdr.markForCheck();
            });
    }

    onSubmit() {
        if (this.personForm.invalid) return;

        const request$ =
            this.isEditMode && this.personId
                ? this.personService.update(this.personId, this.personForm.value)
                : this.personService.create(this.personForm.value);

        request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: this.translate.instant(
                        this.isEditMode ? 'personForm.updatedSummary' : 'personForm.createdSummary',
                    ),
                    detail: this.translate.instant(
                        this.isEditMode ? 'personForm.updatedDetail' : 'personForm.createdDetail',
                    ),
                });
                this.router.navigate(['/people']);
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: this.translate.instant('personForm.errorSummary'),
                    detail: this.translate.instant('personForm.errorDetail'),
                });
            },
        });
    }
}
