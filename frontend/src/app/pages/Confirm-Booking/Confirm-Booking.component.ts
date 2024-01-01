import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { Title } from '@angular/platform-browser';
import { Cart, Item } from 'src/app/models/cart';
import { MatSnackBar } from '@angular/material/snack-bar';

import { StepperOrientation } from '@angular/cdk/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookingService } from 'src/app/services/booking.service';
@Component({
  selector: 'app-Confirm-Booking',
  templateUrl: './Confirm-Booking.component.html',
  styleUrls: ['./Confirm-Booking.component.css'],
})
export class confirmbooking implements OnInit {
  loadingPlaceBooking = false;
  cart!: Cart;
  cartService: CartService;
  bookingService: BookingService;
  stepperOrientation: Observable<StepperOrientation>;

  displayedColumns: string[] = [
    'image',
    'name',
    'price',
    'quantity',
    'subtotal',
  ];
  error: string = '';

  constructor(
    private titleService: Title,
    private router: Router,
    private snackBar: MatSnackBar,
    cartService: CartService,
    bookingService: BookingService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.cartService = cartService;
    this.bookingService = bookingService;
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    this.titleService.setTitle('Shopping Cart');
    this.cartService.currentCart.subscribe((x) => (this.cart = x));
  }
  goPayment() {
    this.router.navigate(['/payment']);
  }
  goBooking() {
    this.router.navigate(['/booking']);
  }
  placeBooking() {
    // place booking
    this.loadingPlaceBooking = true;
    this.bookingService.create(this.cart).subscribe(
      (booking) => {
        this.snackBar.open('Booked successfully.', '', {
          panelClass: 'success-snackbar',
        });
        this.loadingPlaceBooking = false;
        this.cartService.clearItems();
        this.router.navigate([`/bookings/${booking._id}`]);
      },
      (err) => {
        this.loadingPlaceBooking = false;
        this.snackBar.open(err, '', { panelClass: 'error-snackbar' });
      }
    );
  }

  add(item: Item) {
    this.cartService.add(item).subscribe(
      (movieName) =>
        this.snackBar.open(`${movieName} Movie Added`, '', {
          panelClass: 'success-snackbar',
        }),
      (err) => {
        this.snackBar.open(err.message, '', { panelClass: 'error-snackbar' });
      }
    );
  }

  remove(item: Item) {
    this.snackBar.dismiss();
    this.cartService.remove(item._id);
  }
}
