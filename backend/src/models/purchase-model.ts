import mongoose from 'mongoose';
import PurchaseDoc from '../interfaces/purchase-interface';

const purchaseSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: Number,
        },
    ],
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
    sessionLifetime: {
        type: Date,
        default: Date.now(),
        expires: 600,
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
        path: 'products',
        select: 'name price _id',
    });
    next();
});

const Purchase = mongoose.model<PurchaseDoc>('Purchase', purchaseSchema);

export default Purchase;
