import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInfo } from 'src/app/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Movies } from 'src/app/models/movies';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-Movie-details',
  templateUrl: './Movie-details.component.html',
  styleUrls: ['./Movie-details.component.css'],
})
export class MovieDetailsComponent implements OnInit {
  form: FormGroup;
  currentUser: UserInfo | null = null;
  submitted = false;
  error = false;
  loading = true;
  createReviewLoading = false;
  movie: Movies = {
    _id: '',
    name: '',
    slug: '',
    year:0,
    price: 0,
    image: '',
    Genre: '',
    description: '',
    TicketsAvailable: 0,
    
    like: 0,
    dislike: 0,
    rating: 0,
    numReviews: 0,
    reviews: [],
  };
  likeDislike!: string;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private titleService: Title,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.formBuilder.group({
      comment: ['', Validators.required],
      rating: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    this.getMovie();
  }
  getMovie() {
    const routeParams = this.route.snapshot.paramMap;
    const slug = routeParams.get('slug');
    if (slug) {
      this.movieService.getMovieBySlug(slug).subscribe(
        (data) => {
          this.loading = false;
          this.movie = data;
          this.titleService.setTitle(this.movie.name);
        },
        (err) => {
          this.error = true;
          this.loading = false;
          this.snackBar.open(err, '', {
            panelClass: 'error-snackbar',
          });
        }
      );
    } else {
      this.error = true;
      this.loading = false;
      this.snackBar.open('Movie not found', '', {
        panelClass: 'error-snackbar',
      });
    }
  }
  addToBooking() {
    const { _id, image, name, slug, price } = this.movie;
    this.cartService
      .add({ _id, image, name, slug, price, quantity: 1 })
      .subscribe(
        (movieName) => {
          this.snackBar.open(`${movieName} Proceeding Further`, '', {
            panelClass: 'success-snackbar',
          });
          this.router.navigate(['/Booking']);
        },
        (err) => {
          this.snackBar.open(err.message, '', { panelClass: 'error-snackbar' });
        }
      );
  }
  
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const {  comment, rating } = this.form.controls;
    this.createReviewLoading = true;
    this.movieService
      .createReview(this.movie._id, comment.value, rating.value)
      .subscribe(
        (data) => {
          this.getMovie();
          this.createReviewLoading = false;
        },
        (error) => {
          this.snackBar.open(error, '', { panelClass: 'error-snackbar' });
          this.createReviewLoading = false;
        }
      );
  }
}
