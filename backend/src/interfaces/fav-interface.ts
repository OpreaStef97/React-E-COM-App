import { Document } from 'mongoose';
import ProductDoc from './product-interface';
import UserDoc from './user-interface';

export default interface FavoriteDoc extends Document {
    user: UserDoc | string;
    products: { product: ProductDoc | string }[];
    modifiedAt: Date;
}
