import { Document } from 'mongoose';

export default interface ProductDoc extends Document {
    name: string;
    brand: string;
    category: string;
    price: number;
    priceDiscount?: number;
    type?: string[];
    rating?: number;
    ratingsAverage?: number;
    ratingsQuantity?: number;
    images?: string[];
    promoImage?: string;
    status?: string;
    default?: {
        color: string;
        storage: string;
        RAM: string;
    };
    options?: {
        color: string[];
        storage: string[];
        RAM: string[];
    };
}
