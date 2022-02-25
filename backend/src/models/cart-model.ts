import mongoose, { Schema } from 'mongoose';
import CartDoc from '../interfaces/cart-interface';
import AppError from './error-model';
import Product from './product-model';

const cartSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    products: {
        type: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    validate: [
                        function (val: number) {
                            return val <= 10;
                        },
                        'You exceed the maximum quantity for this product!',
                    ],
                    required: [true, 'A product in a cart must have a quantity!'],
                },
            },
        ],
        required: true,
        validate: [
            function (val: any) {
                return val.length <= 20;
            },
            'Number of items exceeds 20. Please contact sales for larger orders',
        ],
    },
    totalQuantity: Number,
    totalAmount: Number,
    modifiedAt: {
        type: Date,
        default: Date.now(),
        expires: '30d',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

cartSchema.index({ user: 1 }, { unique: true });

cartSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'products.product',
        select: 'name _id images slug price',
    });
    next();
});

const calculateAmount = async (products: { product: string; quantity: number }[]) => {
    let totalQuantity = 0;
    let totalAmount = 0;

    await Promise.all(
        products.map(async ({ product, quantity }: { product: string; quantity: number }) => {
            const orderProduct = await Product.findById(product);

            if (!orderProduct)
                throw new AppError(404, 'Could not find the product for the provided ID');

            totalAmount += orderProduct.price * 100 * quantity;
            totalQuantity += quantity;
        })
    );

    return { totalAmount, totalQuantity };
};

cartSchema.pre('save', async function (next) {
    const { totalAmount, totalQuantity } = await calculateAmount(this.products);
    this.totalAmount = Math.ceil(totalAmount);
    this.totalQuantity = totalQuantity;

    next();
});

cartSchema.post('findOneAndUpdate', async function (result, next) {
    const { totalAmount, totalQuantity } = await calculateAmount(result.products);
    result.totalAmount = Math.ceil(totalAmount);
    result.totalQuantity = totalQuantity;
    await result.save();
    next();
});

const Cart = mongoose.model<CartDoc>('Cart', cartSchema);

export default Cart;
