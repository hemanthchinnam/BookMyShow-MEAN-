export interface Item {
  _id: string;
  image: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
}
export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

export interface Order {
  _id: string;
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string;
  items: Item[];

  paymentMethod: string;
  itemsCount: number;
  itemsPrice: number;
  taxPrice: number;

  totalPrice: number;
}
