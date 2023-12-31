import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Event } from '../models/event';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private events: Event[] = []
    

  constructor(private http: HttpClient) {}

  getAdminMovies() {
    return this.http.get(`${environment.apiUrl}/api/movies`, {
      responseType: 'json',
    });
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${environment.apiUrl}/api/movies`).pipe(
      catchError((error) => {
        console.error('Error fetching events from backend', error);
        // Fallback to the static array in case of an error
        return of(this.events);
      })
    );
  }
}