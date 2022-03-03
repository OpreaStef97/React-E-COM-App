import mongoose from 'mongoose';
import ReviewDoc from '../interfaces/review-interface';
import Product from './product-model';

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, "Review can't be empty!"],
            maxlength: 500,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Review must belong to a product.'],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo',
    });

    next();
});

reviewSchema.statics.calcAverageRatings = async function (pid) {
    const stats = await this.aggregate([
        {
            $match: { product: pid },
        },
        {
            $group: {
                _id: '$product',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);

    await Product.findByIdAndUpdate(pid, {
        ratingsQuantity: (stats.length > 0 && stats[0].nRating) || 0,
        ratingsAverage: (stats.length > 0 && stats[0].avgRating) || 0,
    });
};

reviewSchema.post('save', function () {
    // this points to current review
    this.constructor.calcAverageRatings(this.product);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne().clone(); // mongoose > 6.0.0 does not allow querie query re-execution, so .clone() is used to clone the query
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    // this.r = await this.findOne(); does NOT work here
    await this.r.constructor.calcAverageRatings(this.r.product);
});

const Review = mongoose.model<ReviewDoc>('Review', reviewSchema);

export default Review;
