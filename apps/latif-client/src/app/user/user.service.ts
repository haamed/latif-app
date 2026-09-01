import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUserDto, UpdateUserDto, User } from './user.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = '/api/users'; // Using proxy

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  findOne(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  update(id: number, user: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
