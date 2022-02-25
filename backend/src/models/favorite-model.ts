import mongoose from 'mongoose';
import FavoriteDoc from '../interfaces/fav-interface';

const favoriteSlice = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    products: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
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
    modifiedAt: {
        type: Date,
        default: Date.now(),
    },
});

favoriteSlice.index({ user: 1 }, { unique: true });

favoriteSlice.pre(/^find/, function (next) {
    this.populate({
        path: 'products',
        select: 'name _id images slug price',
    });

    next();
});

const Favorite = mongoose.model<FavoriteDoc>('Favorite', favoriteSlice);
export default Favorite;
