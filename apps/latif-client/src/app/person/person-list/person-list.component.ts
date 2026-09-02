import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Toolbar } from 'primeng/toolbar';
import { PersonService } from '../person.service';
import { Person } from '../person.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-person-list',
    standalone: true,
    imports: [
        RouterModule,
        TranslatePipe,
        Avatar,
        Button,
        ConfirmDialog,
        IconField,
        InputIcon,
        InputText,
        TableModule,
        Tag,
        Toolbar,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="person-list">
      <div class="person-list__header">
        <div>
          <h1 class="person-list__title">{{ 'people.title' | translate }}</h1>
          <p class="person-list__subtitle">
            {{
              (people().length === 1 ? 'people.subtitleOne' : 'people.subtitleOther')
                | translate: { count: people().length }
            }}
          </p>
        </div>
      </div>

      <p-toolbar styleClass="person-list__toolbar">
        <ng-template #start>
          <p-iconfield iconPosition="left">
            <p-inputicon class="pi pi-search" />
            <input
              pInputText
              type="text"
              [placeholder]="'people.searchPlaceholder' | translate"
              (input)="table.filterGlobal($any($event.target).value, 'contains')"
            />
          </p-iconfield>
        </ng-template>
        <ng-template #end>
          <a routerLink="/people/new">
            <p-button [label]="'people.addPerson' | translate" icon="pi pi-plus" />
          </a>
        </ng-template>
      </p-toolbar>

      <p-table
        #table
        [value]="people()"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[10, 25, 50]"
        [globalFilterFields]="['firstName', 'lastName', 'email', 'phone', 'city', 'country']"
        styleClass="person-list__table"
        dataKey="id"
      >
        <ng-template #header>
          <tr>
            <th>{{ 'people.columnName' | translate }}</th>
            <th>{{ 'people.columnContact' | translate }}</th>
            <th>{{ 'people.columnAddress' | translate }}</th>
            <th style="width: 8rem">{{ 'people.columnActions' | translate }}</th>
          </tr>
        </ng-template>
        <ng-template #body let-person>
          <tr>
            <td>
              <div class="person-list__cell-name">
                <p-avatar
                  [label]="initials(person)"
                  shape="circle"
                  styleClass="person-list__avatar"
                />
                <span>{{ person.firstName }} {{ person.lastName }}</span>
              </div>
            </td>
            <td>
              <div class="person-list__cell-contact">
                @if (person.email) {
                  <span
                    ><i class="pi pi-envelope"></i> {{ person.email }}</span
                  >
                }
                @if (person.phone) {
                  <span><i class="pi pi-phone"></i> {{ person.phone }}</span>
                }
                @if (!person.email && !person.phone) {
                  <span class="person-list__muted">—</span>
                }
              </div>
            </td>
            <td>
              @if (person.city || person.country) {
                <p-tag [value]="location(person)" severity="secondary" />
              } @else {
                <span class="person-list__muted">—</span>
              }
            </td>
            <td>
              <div class="person-list__actions">
                <p-button
                  icon="pi pi-pencil"
                  [text]="true"
                  severity="secondary"
                  size="small"
                  [routerLink]="['/people', person.id, 'edit']"
                />
                <p-button
                  icon="pi pi-trash"
                  [text]="true"
                  severity="danger"
                  size="small"
                  (onClick)="confirmDelete(person)"
                />
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template #emptymessage>
          <tr>
            <td colspan="4" class="person-list__empty">
              <i class="pi pi-address-book"></i>
              <p>{{ 'people.empty' | translate }}</p>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <p-confirmdialog />
  `,
    styles: [
        `
      .person-list__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;
      }

      .person-list__title {
        margin: 0;
        font-size: 1.6rem;
        font-weight: 800;
        letter-spacing: -0.02em;
      }

      .person-list__subtitle {
        margin: 0.2rem 0 0;
        color: var(--p-surface-500);
        font-size: 0.9rem;
      }

      :host ::ng-deep .person-list__toolbar {
        margin-bottom: 1rem;
        border-radius: 0.9rem;
      }

      :host ::ng-deep .person-list__table {
        border-radius: 0.9rem;
        overflow: hidden;
      }

      .person-list__cell-name {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        font-weight: 500;
      }

      .person-list__cell-contact {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        font-size: 0.88rem;
        color: var(--p-surface-600);

        i {
          margin-right: 0.35rem;
          color: var(--p-surface-400);
        }
      }

      .person-list__muted {
        color: var(--p-surface-400);
      }

      .person-list__actions {
        display: flex;
        gap: 0.25rem;
      }

      .person-list__empty {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--p-surface-400);

        i {
          font-size: 1.75rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        p {
          margin: 0;
        }
      }
    `,
    ],
})
export class PersonListComponent implements OnInit {
    people = signal<Person[]>([]);

    private personService = inject(PersonService);
    private destroyRef = inject(DestroyRef);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
    private translate = inject(TranslateService);

    ngOnInit() {
        this.loadPeople();
    }

    loadPeople() {
        this.personService
            .findAll()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (people) => this.people.set(people),
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translate.instant('people.errorSummary'),
                        detail: this.translate.instant('people.loadErrorDetail'),
                    });
                },
            });
    }

    initials(person: Person): string {
        const source = `${person.firstName ?? ''} ${person.lastName ?? ''}`.trim();
        return source ? source.charAt(0).toUpperCase() : '?';
    }

    location(person: Person): string {
        return [person.city, person.country].filter(Boolean).join(', ');
    }

    confirmDelete(person: Person) {
        this.confirmationService.confirm({
            header: this.translate.instant('people.deleteHeader'),
            message: this.translate.instant('people.deleteMessage', {
                name: `${person.firstName} ${person.lastName}`,
            }),
            icon: 'pi pi-exclamation-triangle',
            acceptButtonProps: {
                severity: 'danger',
                label: this.translate.instant('people.delete'),
            },
            rejectButtonProps: {
                severity: 'secondary',
                outlined: true,
                label: this.translate.instant('people.cancel'),
            },
            accept: () => this.deletePerson(person.id),
        });
    }

    private deletePerson(id: number) {
        this.personService
            .delete(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translate.instant('people.deletedSummary'),
                        detail: this.translate.instant('people.deletedDetail'),
                    });
                    this.loadPeople();
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translate.instant('people.errorSummary'),
                        detail: this.translate.instant('people.deleteErrorDetail'),
                    });
                },
            });
    }
}
