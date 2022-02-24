import { Document } from 'mongoose';
import ProductDoc from './product-interface';
import UserDoc from './user-interface';

export default interface CartDoc extends Document {
    id: string;
    user: UserDoc;
    products: {
        product: ProductDoc;
        quantity: number;
    }[];
    totalQuantity: number;
    totalAmount: number;
    createdAt: Date;
}
