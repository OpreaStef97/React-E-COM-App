import { Document } from 'mongoose';
import ProductDoc from './product-interface';
import UserDoc from './user-interface';

export default interface CartDoc extends Document {
    modifiedAt: Date;
    id: string;
    user: UserDoc | string;
    products: {
        product: ProductDoc | string;
        quantity: number;
    }[];
    totalQuantity: number;
    totalAmount: number;
    createdAt: Date;
}
