import AppError from '../models/error-model';
import Product from '../models/product-model';
import APIFeatures from '../utils/api-features';
import catchAsync from '../utils/catch-async';

/**
 * @applies features like filtering sorting pagination
 * @returns all products by default
 */
export const getAllProducts = catchAsync(async (req, res) => {
    const features = new APIFeatures(Product.find() /*returns query obj*/, req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const products = await features.query;

    res.status(200).json({
        status: 'success',
        length: products.length,
        products,
    });
});

export const getProduct = catchAsync(async (req, res, next) => {
    const productId = req.params.pid;

    const product = await Product.findById(productId);

    if (!product) {
        return next(new AppError(404, 'Product does not exist'));
    }

    res.status(200).json({
        status: 'success',
        product,
    });
});

/**
 * @returns all values for a given field and category
 * @example1 for route './products/values?field=brand&category=Phone' will return all the brands for Phone category
 * @example2 for route './products/values?fields=brand,type&category=Phone' will return all the brands and types for Phone category
 */
export const getFieldValues = catchAsync(async (req, res) => {
    let { field } = req.query;
    const { fields, category } = req.query;

    // handle multiple fields
    /////////////////////////

    if (fields) {
        const queryStr = { ...req.query };
        delete queryStr.fields;
        const values = await Promise.all(
            (fields as string).split(',').map(async field => {
                queryStr.field = field;
                if (field && (field as string).includes('.')) {
                    field = (field as string).split('.')[1];
                }
                const fieldValues = new APIFeatures(Product.find(), queryStr).distinct();

                const value = await fieldValues.query;

                return { [field]: value };
            })
        );

        return res.status(200).json({
            status: 'success',
            [`${category ? category : 'All'}`]: values,
        });
    }

    // if only one field was specified
    //////////////////////////////////

    if (field && (field as string).includes('.')) {
        field = (field as string).split('.')[1];
    }

    const fieldValues = new APIFeatures(Product.find(), req.query).distinct();

    const values = await fieldValues.query;

    res.status(200).json({
        status: 'success',
        [`${field}`]: values,
    });
});

export const createProduct = catchAsync(async (req, res) => {
    const { name, brand, category, price, images, default: Default, options, type } = req.body;

    const newProduct = await Product.create({
        name,
        brand,
        category,
        price,
        images,
        default: Default,
        options,
        type,
    });

    res.status(201).json({
        status: 'success',
        product: newProduct,
    });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
    const productId = req.params.pid;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) return next(new AppError(404, 'No document found with that ID'));

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
