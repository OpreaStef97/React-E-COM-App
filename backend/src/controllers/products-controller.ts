import Product from '../models/product-model';
import APIFeatures from '../utils/api-features';
import catchAsync from '../utils/catch-async';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handler-factory';

export const getAllProducts = getAll(Product);
export const getProduct = getOne(Product);
export const createProduct = createOne(Product);
export const updateProduct = updateOne(Product);
export const deleteProduct = deleteOne(Product);

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
