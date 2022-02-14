import { Document } from 'mongoose';
import ProductDoc from './product-interface';
import UserDoc from './user-interface';

export default interface ReviewDoc extends Document {
    review: string;
    rating: number;
    createdAt: Date;
    product: ProductDoc;
    user: UserDoc;
}
