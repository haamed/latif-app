import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
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
import { UserService } from '../user.service';
import { User } from '../user.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    DatePipe,
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
    <div class="user-list">
      <div class="user-list__header">
        <div>
          <h1 class="user-list__title">{{ 'users.title' | translate }}</h1>
          <p class="user-list__subtitle">
            {{
              (users().length === 1 ? 'users.subtitleOne' : 'users.subtitleOther')
                | translate: { count: users().length }
            }}
          </p>
        </div>
      </div>

      <p-toolbar styleClass="user-list__toolbar">
        <ng-template #start>
          <p-iconfield iconPosition="left">
            <p-inputicon class="pi pi-search" />
            <input
              pInputText
              type="text"
              [placeholder]="'users.searchPlaceholder' | translate"
              (input)="table.filterGlobal($any($event.target).value, 'contains')"
            />
          </p-iconfield>
        </ng-template>
        <ng-template #end>
          <a routerLink="/users/new">
            <p-button [label]="'users.addUser' | translate" icon="pi pi-plus" />
          </a>
        </ng-template>
      </p-toolbar>

      <p-table
        #table
        [value]="users()"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[10, 25, 50]"
        [globalFilterFields]="['name', 'email']"
        styleClass="user-list__table"
        dataKey="id"
      >
        <ng-template #header>
          <tr>
            <th>{{ 'users.columnUser' | translate }}</th>
            <th>{{ 'users.columnEmail' | translate }}</th>
            <th>{{ 'users.columnJoined' | translate }}</th>
            <th style="width: 8rem">{{ 'users.columnActions' | translate }}</th>
          </tr>
        </ng-template>
        <ng-template #body let-user>
          <tr>
            <td>
              <div class="user-list__cell-user">
                <p-avatar
                  [label]="initials(user)"
                  shape="circle"
                  styleClass="user-list__avatar"
                />
                <span>{{ user.name || '—' }}</span>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <p-tag
                [value]="(user.createdAt | date: 'mediumDate') || ''"
                severity="secondary"
              />
            </td>
            <td>
              <div class="user-list__actions">
                <p-button
                  icon="pi pi-pencil"
                  [text]="true"
                  severity="secondary"
                  size="small"
                  [routerLink]="['/users', user.id, 'edit']"
                />
                <p-button
                  icon="pi pi-trash"
                  [text]="true"
                  severity="danger"
                  size="small"
                  (onClick)="confirmDelete(user)"
                />
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template #emptymessage>
          <tr>
            <td colspan="4" class="user-list__empty">
              <i class="pi pi-users"></i>
              <p>{{ 'users.empty' | translate }}</p>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <p-confirmdialog />
  `,
  styles: [
    `
      .user-list__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;
      }

      .user-list__title {
        margin: 0;
        font-size: 1.6rem;
        font-weight: 800;
        letter-spacing: -0.02em;
      }

      .user-list__subtitle {
        margin: 0.2rem 0 0;
        color: var(--p-surface-500);
        font-size: 0.9rem;
      }

      :host ::ng-deep .user-list__toolbar {
        margin-bottom: 1rem;
        border-radius: 0.9rem;
      }

      :host ::ng-deep .user-list__table {
        border-radius: 0.9rem;
        overflow: hidden;
      }

      .user-list__cell-user {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        font-weight: 500;
      }

      .user-list__actions {
        display: flex;
        gap: 0.25rem;
      }

      .user-list__empty {
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
export class UserListComponent implements OnInit {
  users = signal<User[]>([]);

  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService
      .findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => this.users.set(users),
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('users.errorSummary'),
            detail: this.translate.instant('users.loadErrorDetail'),
          });
        },
      });
  }

  initials(user: User): string {
    const source = user.name || user.email;
    return source ? source.charAt(0).toUpperCase() : '?';
  }

  confirmDelete(user: User) {
    this.confirmationService.confirm({
      header: this.translate.instant('users.deleteHeader'),
      message: this.translate.instant('users.deleteMessage', {
        name: user.name || user.email,
      }),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonProps: {
        severity: 'danger',
        label: this.translate.instant('users.delete'),
      },
      rejectButtonProps: {
        severity: 'secondary',
        outlined: true,
        label: this.translate.instant('users.cancel'),
      },
      accept: () => this.deleteUser(user.id),
    });
  }

  private deleteUser(id: number) {
    this.userService
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('users.deletedSummary'),
            detail: this.translate.instant('users.deletedDetail'),
          });
          this.loadUsers();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('users.errorSummary'),
            detail: this.translate.instant('users.deleteErrorDetail'),
          });
        },
      });
  }
}
