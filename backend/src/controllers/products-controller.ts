import Product from '../models/product-model';
import APIFeatures from '../api/api-features';
import catchAsync from '../utils/catch-async';
import HandlerFactory from '../api/handler-factory';


const factory = new HandlerFactory(Product);

export const getAllProducts = factory.getAll({});
export const getProduct = factory.getOne();
export const createProduct = factory.createOne();
export const updateProduct = factory.updateOne();
export const deleteProduct = factory.deleteOne();

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