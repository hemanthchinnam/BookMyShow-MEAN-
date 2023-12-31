import {
  modelOptions,
  prop,
  getModelForClass,
  Ref,
} from '@typegoose/typegoose';
import { Movie } from './movie.model';
import { User, UserModel } from './user.model';



class Item {
  @prop({ required: true })
  public name!: string;
  @prop({ required: true })
  public quantity!: string;
  @prop({ required: true })
  public image!: number;
  @prop({ required: true })
  public price!: number;
  @prop({ ref: Movie })
  public movie?: Ref<Movie>;
}

class PaymentResult {
  @prop()
  public paymentId!: string;
  @prop()
  public status!: string;
  @prop()
  public update_time!: string;
  @prop()
  public email_address!: string;
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Booking {
  public _id!: string;
  @prop()
  public items!: Item[];
  @prop()
 @prop({ ref: User })
  public user?: Ref<User>;

  @prop({ required: true })
  public paymentMethod!: string;
  @prop()
  public paymentResult?: PaymentResult;
  @prop({ required: true, default: 0 })
  public itemsPrice!: number;
  @prop({ required: true, default: 0 })
  public shippingPrice!: number;
  @prop({ required: true, default: 0 })
  public taxPrice!: number;
  @prop({ required: true, default: 0 })
  public totalPrice!: number;
  @prop({ required: true, default: false })
  public isPaid!: boolean;
  @prop()
  public paidAt!: Date;
  @prop({ required: true, default: false })
  public isDelivered!: boolean;
  @prop()
  public deliveredAt!: Date;
}

export const BookingModel = getModelForClass(Booking);
