export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  Genre: string;
  description: string;
  TicketsAvailable: number;
  rating: number;
  numReviews: number;
  reviews: any[];
}

export interface ProductFilter {
  Genre: string;
  name: string;
}
