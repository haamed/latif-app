import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>{{ isEditMode ? 'Edit' : 'Create' }} User</h2>
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="name">Name:</label>
        <input id="name" type="text" formControlName="name" />
      </div>
      <div>
        <label for="email">Email:</label>
        <input id="email" type="email" formControlName="email" />
      </div>
      @if (!isEditMode) {
        <div>
          <label for="password">Password:</label>
          <input id="password" type="password" formControlName="password" />
        </div>
      }
      <button type="submit" [disabled]="userForm.invalid">Save</button>
      <a routerLink="/users">Cancel</a>
    </form>
  `,
  styles: [
    `
      div {
        margin-bottom: 10px;
      }
      label {
        display: block;
        margin-bottom: 5px;
      }
      input {
        padding: 5px;
        width: 100%;
        max-width: 300px;
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
    if (this.userForm.valid) {
      if (this.isEditMode && this.userId) {
        this.userService
          .update(this.userId, this.userForm.value)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.router.navigate(['/users']);
          });
      } else {
        this.userService
          .create(this.userForm.value)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.router.navigate(['/users']);
          });
      }
    }
  }
}
