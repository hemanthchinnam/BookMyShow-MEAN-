import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MovieFilter, Movies } from '../models/movies';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  getAdminMovies() {
    return this.http.get(`${environment.apiUrl}/api/movies`, {
      responseType: 'json',
    });
  }
  constructor(private http: HttpClient) {}

  getMovies(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/movies`, {
      responseType: 'json',
    });
  }

  createMovie(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/movies`, {
      responseType: 'json',
    });
  }

  createReview(
    movieId: string,
    comment: string,
    rating: number
  ): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/movies/${movieId}/reviews`,
      {  comment, rating },
      {
        responseType: 'json',
      }
    );
  }

  deleteMovie(movieId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/movies/${movieId}`, {
      responseType: 'json',
    });
  }

  searchMovies(movieFilter: MovieFilter): Observable<any> {
    let qs = '';
    if (movieFilter.Genre) {
      qs += `Genre=${movieFilter.Genre}&`;
    }
    if (movieFilter.name) {
      qs += `name=${movieFilter.name}&`;
    }
    
    return this.http.get(`${environment.apiUrl}/api/movies?${qs}`, {
      responseType: 'json',
    });
  }

  getCategories(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/movies/categories`, {
      responseType: 'json',
    });
  }

  getMovie(movieId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/movies/${movieId}`, {
      responseType: 'json',
    });
  }

  getMovieBySlug(slug: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/movies/slug/${slug}`, {
      responseType: 'json',
    });
  }
  postFile(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    return this.http.post(`${environment.apiUrl}/api/uploads`, formData);
  }

  update(movie: Movies) {
    return this.http.put<Movies>(
      `${environment.apiUrl}/api/movies/${movie._id}`,
     movie
    );
  }
}
