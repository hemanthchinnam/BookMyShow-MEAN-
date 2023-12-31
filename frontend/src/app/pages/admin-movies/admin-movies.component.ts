import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import {Movies} from 'src/app/models/movies';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-admin-movies',
  templateUrl: './admin-movies.component.html',
  styleUrls: ['./admin-movies.component.css']
})
export class AdminMoviesComponent implements OnInit {

  loading = true;
  error = false;
  movies: Movies[] = [];
  movieService: MovieService;
  displayedColumns: string[] = [
    '_id',
    'name',
    'price',
    'Genre',
    'action',
  ];

  constructor(
    private titleService: Title,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    movieService: MovieService,
    private cd: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.movieService = movieService;
  }

  ngOnInit() {
    this.getAdminMovies();
  }

  private getAdminMovies() {
    this.loading = true;
    this.movieService.getAdminMovies().subscribe(
      (data: any) => {
        this.movies = data;

        this.titleService.setTitle(`Movie History`);
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        this.error = true;
        this.snackBar.open(err, '', { panelClass: 'error-snackbar' });
      }
    );
  }

  createMovie() {
    if (confirm('Are you sure to create movie?')) {
      this.movieService.createMovie().subscribe(
        (data: any) => {
          this.router.navigate(['/admin/movies/' + data._id]);
        },
        (err) => {
          this.snackBar.open(err, '', { panelClass: 'error-snackbar' });
        }
      );
    }
  }
  deleteMovie(movieId: string) {
    if (confirm('Are you sure to delete ')) {
      this.movieService.deleteMovie(movieId).subscribe(
        (data: any) => {
          this.getAdminMovies();
        },
        (err) => {
          this.snackBar.open(err, '', { panelClass: 'error-snackbar' });
        }
      );
    }
  }
}
