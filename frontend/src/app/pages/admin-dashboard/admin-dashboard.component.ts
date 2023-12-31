import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BookingService } from 'src/app/services/booking.service';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  // bar
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
  };
  barChartType: ChartType = 'bar';
  barChartData!: ChartData<'bar'>;

  // pie
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  pieChartType: ChartType = 'pie';
  public pieChartData!: ChartData<'pie', number[], string | string[]>;

  loading = true;
  error = false;
  numUsers = 0;
  totalSales = 0;
  numBookings = 0;
  bookingService: BookingService;

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
    this.titleService.setTitle(`Admin Dashboard`);
    this.getBookingSummary();
  }

  private getBookingSummary() {
    this.loading = true;
    this.bookingService.getBookingSummary().subscribe(
      (summary) => {
        this.numUsers =
          summary.users.length > 0 ? summary.users[0].numUsers : 0;
        this.totalSales =
          summary.bookings.length > 0 ? summary.bookings[0].totalSales : 0;
        this.numBookings =
          summary.bookings.length > 0 ? summary.bookings[0].numBookings : 0;

        this.barChartData = {
          labels: summary.dailyBookings.map((x: any) => x._id),
          datasets: [
            {
              data: summary.dailyBookings.map((x: any) => x.sales),
              label: 'Sales',
            },
            {
              data: summary.dailyBookings.map((x: any) => x.bookings),
              label: 'Bookings',
            },
          ],
        };
        this.pieChartData = {
          labels: summary.movieCategories.map((x: any) => x._id),
          datasets: [
            {
              data: summary.movieCategories.map((x: any) => x.count),
            },
          ],
        };

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
