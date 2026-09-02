import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePersonDto, Person, UpdatePersonDto } from './person.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class PersonService {
    private http = inject(HttpClient);
    private apiUrl = '/api/people'; // Using proxy

    findAll(): Observable<Person[]> {
        return this.http.get<Person[]>(this.apiUrl);
    }

    findOne(id: number): Observable<Person> {
        return this.http.get<Person>(`${this.apiUrl}/${id}`);
    }

    create(person: CreatePersonDto): Observable<Person> {
        return this.http.post<Person>(this.apiUrl, person);
    }

    update(id: number, person: UpdatePersonDto): Observable<Person> {
        return this.http.patch<Person>(`${this.apiUrl}/${id}`, person);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
