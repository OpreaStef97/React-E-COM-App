import mongoose, { Schema } from 'mongoose';
import CartDoc from '../interfaces/cart-interface';
import AppError from './error-model';
import Product from './product-model';

const cartSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: Number,
        },
    ],
    totalQuantity: Number,
    totalAmount: Number,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

cartSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name _id email',
    }).populate({
        path: 'product',
        select: 'name _id images slug price',
    });
    next();
});

cartSchema.pre('save', async function (next) {
    let totalQuantity = 0;
    let totalAmount = 0;

    await Promise.all(
        this.products.map(async ({ product, quantity }: { product: string; quantity: number }) => {
            const orderProduct = await Product.findById(product);

            if (!orderProduct)
                throw new AppError(404, 'Could not find the product for the provided ID');

            totalAmount += orderProduct.price * 100 * quantity;
            totalQuantity += quantity;
        })
    );

    this.totalAmount = Math.ceil(totalAmount);
    this.totalQuantity = totalQuantity;

    next();
});

const Cart = mongoose.model<CartDoc>('Cart', cartSchema);

export default Cart;
