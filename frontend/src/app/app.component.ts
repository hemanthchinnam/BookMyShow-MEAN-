import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from './models';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MovieService } from './services/movie.service';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('sidenav')
  sidenav!: MatSidenav;
  Genre: [] = [];
  searchForm: FormGroup;
  title = 'Book My Show';
  itemsCount: number = 0;
  currentUser: UserInfo | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private movieService: MovieService
  ) {
    this.searchForm = this.formBuilder.group({
      name: [''],
    });
  }
  ngOnInit() {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    this.cartService.currentCart.subscribe(
      (x) => (this.itemsCount = x.itemsCount)
    );
    this.movieService
      .getCategories()
      .subscribe((categories) => (this.Genre = categories));
  }
  onSubmit() {
    this.router.navigate(['/search'], {
      queryParams: { name: this.searchForm.controls.name.value },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
