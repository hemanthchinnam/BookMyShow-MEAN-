export interface Item {
  _id: string;
  image: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: Item[];
  
  paymentMethod: string;
  itemsCount: number;
  itemsPrice: number;
  taxPrice: number;
  
  totalPrice: number;
}
