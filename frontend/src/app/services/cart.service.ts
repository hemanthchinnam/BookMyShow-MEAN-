import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cart, Item } from '../models/cart';

import { environment } from '../../environments/environment';
import { Movies } from '../models/movies';

export const round2 = (num: number) =>
  Math.round(num * 100 + Number.EPSILON) / 100;

const defaultCart: Cart = {
  items: [],
  
  paymentMethod: '',
  itemsCount: 0,
  itemsPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
};
@Injectable({ providedIn: 'root' })
export class CartService {
  private currentCartSubject: BehaviorSubject<Cart>;
  public currentCart: Observable<Cart>;

  constructor(private http: HttpClient) {
    this.currentCartSubject = new BehaviorSubject<Cart>(
      localStorage.getItem('currentCart')
        ? JSON.parse(localStorage.getItem('currentCart') || '{}')
        : defaultCart
    );
    this.currentCart = this.currentCartSubject.asObservable();
  }

  public get currentCartValue(): Cart {
    return this.currentCartSubject.value;
  }

  add(item: Item): Observable<string> {
    return this.http
      .get<Movies>(`${environment.apiUrl}/api/movies/${item._id}`, {
        responseType: 'json',
      })
      .pipe(
        map((movie) => {
          const cart = this.currentCartSubject.value;
          const existItem = cart.items.find((x) => x._id === item._id);
          if (
            (existItem && movie.TicketsAvailable < existItem.quantity + 1) ||
            (!existItem && movie.TicketsAvailable <= 0)
          ) {
            throw new Error('movie is housefull');
          }
          const items = existItem
            ? cart.items.map((x) =>
                x._id === existItem._id
                  ? { ...existItem, quantity: existItem.quantity + 1 }
                  : x
              )
            : [...cart.items, item];
          const newCart = { ...cart, ...calcCart(items) };
          localStorage.setItem('currentCart', JSON.stringify(newCart));
          this.currentCartSubject.next(newCart);
          return movie.name;
        })
      );
  }

  remove(movieId: String) {
    const cart = this.currentCartSubject.value;
    let items: Item[] = cart.items;
    const existItem = cart.items.find((x) => x._id === movieId);
    if (existItem) {
      if (existItem.quantity > 1) {
        items = cart.items.map((x) =>
          x._id === existItem._id
            ? { ...existItem, quantity: existItem.quantity - 1 }
            : x
        );
      } else {
        items = cart.items.filter((x) => x._id !== movieId);
      }
    }
    const newCart = { ...cart, ...calcCart(items) };
    localStorage.setItem('currentCart', JSON.stringify(newCart));
    this.currentCartSubject.next(newCart);
  }

  clearItems() {
    const cart = this.currentCartSubject.value;
    const newCart = { ...cart, ...calcCart([]) };
    localStorage.setItem('currentCart', JSON.stringify(newCart));
    this.currentCartSubject.next(newCart);
  }

  
  savePaymentMethod(paymentMethod: string) {
    const cart = this.currentCartSubject.value;
    cart.paymentMethod = paymentMethod;
    localStorage.setItem('currentCart', JSON.stringify(cart));
    this.currentCartSubject.next(cart);
  }
}

const calcCart = (items: Item[]) => {
  const itemsPrice = round2(
    items.reduce((a, c) => a + c.price * c.quantity, 0)
  );
  const itemsCount = items.reduce((a, c) => a + c.quantity, 0);
  
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice  + taxPrice);

  return {
    items: items,
    itemsCount,
    itemsPrice,
    taxPrice,

    totalPrice,
  };
};
