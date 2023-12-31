import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { Booking } from 'src/app/models/bookings';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-Booking-history',
  templateUrl: './Booking-history.component.html',
  styleUrls: ['./Booking-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  loading = true;
  error = false;
  bookings: Booking[] = [];
  bookingService: BookingService;
  displayedColumns: string[] = [
    '_id',
    'createdAt',
    'totalPrice',
    
    'action',
  ];

  constructor(
    private titleService: Title,
    private snackBar: MatSnackBar,
    bookingService: BookingService,
    private cd: ChangeDetectorRef  ) {
    this.bookingService = bookingService;
  }

  ngOnInit() {
    this.getbookinghistory();
  }

  private getbookinghistory() {
    this.loading = true;
    this.bookingService.getBookingHistory().subscribe(
      (data) => {
        this.bookings = data;

        this.titleService.setTitle(`Booking History`);
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        this.error = true;
        this.snackBar.open(err, '', { panelClass: 'error-snackbar' });
      }
    );
  }
}
