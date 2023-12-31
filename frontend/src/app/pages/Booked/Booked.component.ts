import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IPayPalConfig} from 'ngx-paypal';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from 'src/app/models';
import { Booking } from 'src/app/models/bookings';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-Booked',
  templateUrl: './Booked.component.html',
  styleUrls: ['./Booked.component.css'],
})
export class OrderComponent implements OnInit {
  currentUser: UserInfo | null = null;
  public payPalConfig?: IPayPalConfig;
  loading = true;
  error = false;
 booking!: Booking;
  bookingService: BookingService;
  displayedColumns: string[] = [
    'image',
    'name',
    'price',
    'quantity',
    'subtotal',
  ];
  initConfig: any;


  constructor(
    private titleService: Title,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    bookingService: BookingService,
    private cd: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.bookingService = bookingService;
  }

  ngOnInit() {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    const routeParams = this.route.snapshot.paramMap;
    const bookingId = routeParams.get('id');
    if (bookingId) {
      this.getBooking(bookingId);
    } else {
      this.snackBar.open('Booking Not Found', '', {
        panelClass: 'error-snackbar',
      });
    }
  }
  private getBooking(bookingId: string) {
    this.bookingService.getBooking(bookingId).subscribe(
      (data) => {
        this.booking = data;
        this.cd.detectChanges();
        this.titleService.setTitle(`Booking ${this.booking._id}`);
        this.loading = false;
        if (!this.booking.isPaid) {
          this.initConfig();
        }
      },
      (err) => {
        this.loading = false;
        this.error = true;
        this.snackBar.open(err, '', { panelClass: 'error-snackbar' });
      }
    );
  }
  deliverBooking() {
    this.bookingService.deliver(this.booking._id).subscribe(
      (data) => {
        this.getBooking(this.booking._id);
        this.snackBar.open('Booking confirmation successfull', '', {
          panelClass: 'success-snackbar',
        });
      },
      (err) => {
        this.snackBar.open(err, '', { panelClass: 'error-snackbar' });
      }
    );
  }
  makePayment() {
    // Add your payment processing logic here
    // For demonstration, show a simple success message using MatSnackBar
    this.snackBar.open('Payment Successful!', '', {
      panelClass: 'success-snackbar',
    });
  }
}
