import mongoose, { Schema } from 'mongoose';
import PurchaseDoc from '../interfaces/purchase-interface';

const purchaseSchema = new mongoose.Schema({
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
                    min: [1, "Can't process a quantity smaller than 1"],
                    max: [10, "You exceed the maximum quantity for this product!"],
                    required: true,
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    totalAmount: {
        type: Number,
        require: [true, 'A purchase record must have a price'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    paid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },
});

purchaseSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name _id email',
    }).populate({
        path: 'products.product',
        select: 'name price _id',
    });
    next();
});

const Purchase = mongoose.model<PurchaseDoc>('Purchase', purchaseSchema);

export default Purchase;
