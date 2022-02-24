import { Document } from 'mongoose';
import ProductDoc from './product-interface';
import UserDoc from './user-interface';

export default interface PurchaseDoc extends Document {
    user: UserDoc;
    products: {
        product: ProductDoc;
        quantity: number;
    }[];
    totalAmount: number;
    createdAt: Date;
    sessionLifetime?: Date;
    paidAt: Date;
    paid: boolean;
}
