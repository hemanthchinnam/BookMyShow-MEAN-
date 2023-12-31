import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';

// Other Packages
import { NgxPayPalModule } from 'ngx-paypal';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SwiperModule } from 'swiper/angular';

// pages
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailsComponent } from './pages/Movie-details/Movie-details.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
//import { CartComponent } from './pages/cart/cart.component';
import { BookingDetailsComponent } from './pages/BookingDetails/BookingDetails.component';
import { PaymentMethodComponent } from './pages/payment-method/payment-method.component';
import { PlaceOrderComponent } from './pages/Confirm-Booking/Confirm-Booking.component';
import { OrderComponent } from './pages/Booked/Booked.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrderHistoryComponent } from './pages/Booking-history/Booking-history.component';
import { SearchComponent } from './pages/search/search.component';
import { ResetpasswordComponent } from './pages/resetpassword/resetpassword.component';

// helper
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';

import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminUserEditComponent } from './pages/admin-user-edit/admin-user-edit.component';
import { AdminMoviesComponent } from './pages/admin-movies/admin-movies.component';
import { AdminMovieEditComponent } from './pages/admin-movie-edit/admin-movie-edit.component';
import { AdminBookingsComponent } from './pages/admin-bookings/admin-bookings.component';
import { RatingComponent } from './rating/rating.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { TheatrelistComponent } from './pages/theatrelist/theatrelist.component';
import { SortlistComponent } from './pages/sortlist/sortlist.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ProductDetailsComponent,
    BookingDetailsComponent,
    PaymentMethodComponent,
    PlaceOrderComponent,
    OrderComponent,
    RegisterComponent,
    ProfileComponent,
    OrderHistoryComponent,
    SearchComponent,
    AdminUsersComponent,
    AdminUserEditComponent,
   
    AdminMoviesComponent,
    AdminMovieEditComponent,
    AdminBookingsComponent,
    RatingComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    TheatrelistComponent,
    SortlistComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatTableModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatRadioModule,
    FlexLayoutModule,
    NgxPayPalModule,
    MatSidenavModule,
    SwiperModule,
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500 },
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}