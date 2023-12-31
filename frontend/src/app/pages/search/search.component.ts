import { ChangeDetectorRef, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Movies } from 'src/app/models/movies';
import { CartService } from 'src/app/services/cart.service';
import { MovieService } from 'src/app/services/movie.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  Genre = '';
  name = '';
  loading = true;
  error = false;
  movies!: Movies[];

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private cartService: CartService,
    private titleService: Title
  ) {
    route.queryParams.subscribe((p) => {
      this.Genre = p.Genre || '';
      this.name = p.name || '';
      this.searchMovies();
    });

    this.titleService.setTitle('Book My Show');
  }

  ngOnInit() {}
  searchMovies() {
    this.movieService
      .searchMovies({ Genre: this.Genre, name: this.name })
      .subscribe(
        (movies: Movies[]) => {
          this.loading = false;
          this.movies = movies;
          this.cd.detectChanges();
        },
        (err) => {
          this.loading = false;
          this.error = true;
          this.snackBar.open(err, '', { panelClass: 'error-snackbar' });
        }
      );
  }

  
}
