import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart';
import { CartService } from './cart.service';
import { environment } from '../../environments/environment';
import { Booking, PaymentResult } from '../models/bookings';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient, private cartService: CartService) {}

  create(cart: Cart): Observable<Booking> {
    return this.http.post<Booking>(
      `${environment.apiUrl}/api/bookings`,
      cart,
      httpOptions
    );
  }

  pay(bookingId: string, paymentResult: PaymentResult): Observable<Booking> {
    return this.http.put<Booking>(
      `${environment.apiUrl}/api/bookings/${bookingId}/pay`,
      paymentResult,
      httpOptions
    );
  }

  deliver(bookingId: string): Observable<Booking> {
    return this.http.put<Booking>(
      `${environment.apiUrl}/api/bookings/${bookingId}/deliver`,
      {},
      httpOptions
    );
  }

  getBooking(bookingId: string): Observable<Booking> {
    return this.http.get<Booking>(
      `${environment.apiUrl}/api/bookings/${bookingId}`,
      httpOptions
    );
  }

  getAdminBookings(): Observable<Booking> {
    return this.http.get<Booking>(
      `${environment.apiUrl}/api/bookings`,
      httpOptions
    );
  }

  getBookingSummary(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/api/bookings/summary`,
      httpOptions
    );
  }

  getBookingHistory(): Observable<Booking[]> {
    return this.http.get<Booking[]>(
      `${environment.apiUrl}/api/bookings/history`,
      httpOptions
    );
  }
}
