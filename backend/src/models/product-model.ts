import mongoose from 'mongoose';
import slugify from 'slugify';
import ProductDoc from '../interfaces/product-interface';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A product must have a name'],
            unique: true,
            trim: true,
            maxlength: 70,
            minlength: 10,
        },
        slug: String,
        brand: {
            type: String,
            minlength: 2,
            maxlength: 80,
            required: [true, 'A product must have a brand'],
        },
        category: {
            type: String,
            required: [true, 'A product must belong to a category'],
            maxlength: 50,
        },
        reviews: Number,
        price: {
            type: Number,
            required: [true, 'A product must have a price'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val: number) {
                    // this only points to current doc on NEW document creation
                    return val < (this as ProductDoc).price;
                },
                message: 'Discount price ({VALUE}) should be below regular price',
            },
        },
        type: [String],
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: (val: number) => Math.round(val * 10) / 10,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 4.5,
        },
        images: [String],
        promoImage: String,
        status: String,
        default: {
            color: String,
            storage: String,
            RAM: String,
        },
        options: {
            color: [String],
            storage: [String],
            RAM: [String],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });

productSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Product = mongoose.model<ProductDoc>('Product', productSchema);

export default Product;
