import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Movies } from 'src/app/models/movies';
import { CartService } from 'src/app/services/cart.service';
import { MovieService } from 'src/app/services/movie.service';

import SwiperCore, { Navigation, Pagination } from 'swiper';
SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  loading = true;
  error = false;
  movies!: Movies[];

  constructor(
    private movieService: MovieService,
    private snackBar: MatSnackBar,
    private cartService: CartService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Book My Show');
  }

  ngOnInit() {
    this.movieService.getMovies().subscribe(
      (movies: Movies[]) => {
        this.loading = false;
        this.movies = movies;
      },
      (err) => {
        this.loading = false;
        this.error = true;
        this.snackBar.open(err, '', { panelClass: 'error-snackbar' });
      }
    );
  }

  getSlugClass(slug: string): string {
    // Convert spaces to hyphens and make it lowercase
    return slug.replace(/\s+/g, '-').toLowerCase();
  }

  onSwiper(swiper: any) {
    console.log(swiper);
  }

  onSlideChange() {
    console.log('slide change');
  }
}

