import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Movies } from 'src/app/models/movies';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-admin-movie-edit',
  templateUrl: './admin-movie-edit.component.html',
  styleUrls: ['./admin-movie-edit.component.css']
})
export class AdminMovieEditComponent implements OnInit {
  form: FormGroup;
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
    like:0,
    dislike:0,
    rating: 0,
    numReviews: 0,
    reviews: [],
  };
  uploadLoading = false;
  loading = false;
  error = false;

  submitted = false;
  returnUrl: string;

  constructor(
    private titleService: Title,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private movieService: MovieService
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      price: ['', Validators.required],
      image: ['', Validators.required],
      year:['', Validators.required],
      Genre: ['', Validators.required],
      description: ['', Validators.required],
      TicketsAvailable: ['', Validators.required],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const movieId = routeParams.get('id');
    if (movieId) {
      this.movieService.getMovie(movieId).subscribe(
        (movie: Movies) => {
          this.movie = movie;
          this.loading = false;
          this.form.patchValue({ name: movie.name });
          this.form.patchValue({ slug: movie.slug });
          this.form.patchValue({ year: movie.year });
          this.form.patchValue({ price: movie.price });
          this.form.patchValue({ image: movie.image });
          this.form.patchValue({ Genre: movie.Genre });
          this.form.patchValue({ description: movie.description });
          this.form.patchValue({ TicketsAvailable: movie.TicketsAvailable });
          this.titleService.setTitle(`Admin Edit Movie ${movie._id}`);
        },
        (err: any) => {
          this.error = true;
          this.snackBar.open(err, '', {
            panelClass: 'error-snackbar',
          });
        }
      );
    } else {
      this.snackBar.open('Movie Not Found', '', {
        panelClass: 'error-snackbar',
      });
    }
  }
  uploadImage(event: any) {
    const file: File = event.target.files[0];
    this.uploadLoading = true;
    this.movieService.postFile(file).subscribe(
      (data) => {
        this.uploadLoading = false;
        this.form.patchValue({ image: data.secure_url });
        this.snackBar.open('Image uploaded successfully', '', {
          panelClass: 'success-snackbar',
        });
      },
      (err) => {
        this.uploadLoading = false;
        this.snackBar.open(err, '', {
          panelClass: 'error-snackbar',
        });
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    const {
      name,
      slug,
      year,
      price,
      image,
      Genre,

      TicketsAvailable,
      description,
    } = this.form.controls;
    this.loading = true;
    this.movieService
      .update({
        _id: this.movie._id,
        name: name.value,
        slug: slug.value,
        year: year.value,
        price: price.value,
        image: image.value,
        Genre: Genre.value,

        TicketsAvailable: TicketsAvailable.value,
        description: description.value,
        like: this.movie.like,
        dislike: this.movie.dislike,
        rating: this.movie.rating,
        numReviews: this.movie.numReviews,
        reviews: [],
      })
      .subscribe(
        () => {
          this.snackBar.open('Movie updated successfully', '', {
            panelClass: 'success-snackbar',
          });
          this.loading = false;
          this.router.navigate(['/admin/movies']);
        },
        (err: any) => {
          this.snackBar.open(err, '', { panelClass: 'error-snackbar' });
          this.loading = false;
        }
      );
  }
}

