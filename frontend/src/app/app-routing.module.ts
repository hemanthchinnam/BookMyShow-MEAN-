import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailsComponent } from './pages/Movie-details/Movie-details.component';
import { ResetpasswordComponent } from './pages/resetpassword/resetpassword.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { LoginComponent } from './pages/login/login.component';
import { BookingDetailsComponent } from './pages/BookingDetails/BookingDetails.component';
import { PaymentMethodComponent } from './pages/payment-method/payment-method.component';
import { PlaceOrderComponent } from './pages/Confirm-Booking/Confirm-Booking.component';
import { OrderComponent } from './pages/Booked/Booked.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrderHistoryComponent } from './pages/Booking-history/Booking-history.component';
import { SearchComponent } from './pages/search/search.component';
import { AdminGuard } from './helpers/admin.guard';

import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminUserEditComponent } from './pages/admin-user-edit/admin-user-edit.component';
import { AdminMovieEditComponent } from './pages/admin-movie-edit/admin-movie-edit.component';
import { AdminMoviesComponent } from './pages/admin-movies/admin-movies.component';
import { AdminBookingsComponent } from './pages/admin-bookings/admin-bookings.component';
import { TheatrelistComponent } from './pages/theatrelist/theatrelist.component';
import { SortlistComponent } from './pages/sortlist/sortlist.component';
const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'forgot', component: ForgotpasswordComponent},
  { path: 'reset-password', component: ResetpasswordComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'TheatreList', component:TheatrelistComponent},
  { path: 'sort', component:SortlistComponent},
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'order-history',
    component: OrderHistoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Booking',
    component: BookingDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'payment',
    component: PaymentMethodComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'place-order',
    component: PlaceOrderComponent,
    canActivate: [AuthGuard],
  },
  
  { path: 'bookings/:id', canActivate: [AuthGuard], component: OrderComponent },
  { path: 'movies/:slug', component: ProductDetailsComponent },
  
  {
    path: 'admin/dashboard',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('./pages/admin-dashboard/admin-dashboard.module').then(
        (m) => m.AdminDashboardModule
      ),
  },
  

  {
    path: 'admin/movies',
    component: AdminMoviesComponent,
    canActivate:[AdminGuard],
  },
  {
    path: 'admin/bookings',
    component: AdminBookingsComponent,
    canActivate:[AdminGuard],
  },
  
  {
    path:'admin/movies/:id',
    component: AdminMovieEditComponent,
    canActivate:[AdminGuard],
  },
  {
    path: 'admin/users',
    component: AdminUsersComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/user/:id',
    component: AdminUserEditComponent,
    canActivate: [AdminGuard],
  },
  { path: 'movies/:slug', component: ProductDetailsComponent },
  { path: '', component: HomeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
