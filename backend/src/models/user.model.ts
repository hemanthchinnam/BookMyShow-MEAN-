import { modelOptions, prop, getModelForClass, DocumentType } from '@typegoose/typegoose';


@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  public _id?: string;
  @prop({ required: true })
  public name!: string;
  @prop({ required: true, unique: true })
  public email!: string;
  @prop({ required: true })
  public password!: string;
  
  @prop({ required: true, default: false })
  public isAdmin!: boolean;
  @prop()
  public resetPasswordToken?: string;

  @prop()
  public resetPasswordExpires?: Date;

}

export const UserModel = getModelForClass(User);

export type UserType = DocumentType<User>;
