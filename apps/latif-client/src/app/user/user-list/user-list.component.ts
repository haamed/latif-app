import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Users</h2>
    <a routerLink="/users/new" class="btn">Add User</a>
    <ul>
      @for (user of users(); track user.id) {
        <li>
          {{ user.name }} ({{ user.email }})
          <button (click)="deleteUser(user.id)">Delete</button>
          <a [routerLink]="['/users', user.id, 'edit']">Edit</a>
        </li>
      }
    </ul>
  `,
  styles: [
    `
      .btn {
        display: inline-block;
        padding: 5px 10px;
        background: #eee;
        text-decoration: none;
        margin-bottom: 10px;
      }
      ul {
        list-style: none;
        padding: 0;
      }
      li {
        margin: 5px 0;
        padding: 10px;
        border: 1px solid #ccc;
      }
      button {
        margin-left: 10px;
      }
    `,
  ],
})
export class UserListComponent implements OnInit {
  users = signal<User[]>([]);

  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService
      .findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((users) => {
        this.users.set(users);
      });
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService
        .delete(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.loadUsers());
    }
  }
}
