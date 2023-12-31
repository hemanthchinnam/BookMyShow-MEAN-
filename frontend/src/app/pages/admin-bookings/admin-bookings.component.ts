import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { Booking } from 'src/app/models/bookings';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-admin-bookings',
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.css']
})
export class AdminBookingsComponent implements OnInit {

  loading = true;
  error = false;
  bookings: Booking[] = [];
  bookingService: BookingService;
  displayedColumns: string[] = [
    '_id',
    'user',
    'createdAt',
    'totalPrice',
    'action',
  ];

  constructor(
    private titleService: Title,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    bookingService: BookingService,
    private cd: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.bookingService = bookingService;
  }

  ngOnInit() {
    this.getAdminBookings();
  }

  private getAdminBookings() {
    this.loading = true;
    this.bookingService.getAdminBookings().subscribe(
      (data: any) => {
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