export interface Movies {
    _id: string;
    name: string;
    slug: string;
    year:number;
    price: number;
    image: string;
    Genre: string;
    description: string;
    TicketsAvailable: number;
    like: number;
    dislike: number;
    rating: number;
    numReviews: number;
    reviews: any[];
  }
  
  export interface MovieFilter {
    Genre: string;
    name: string;
  }
  