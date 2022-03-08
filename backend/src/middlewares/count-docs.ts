import { Model } from 'mongoose';
import APIFeatures from '../api/api-features';
import catchAsync from '../utils/catch-async';

const countDocs = <T>(Model: Model<T>) => {
    return catchAsync(async (req, res, next) => {
        let filter = {};

        if (req.params.pid) filter = { product: req.params.pid };
        if (req.params.uid) filter = { user: req.params.uid };
        const count = new APIFeatures(Model.count(filter), req.query).filter().count();

        const totalLength = await count.query;

        req.totalLength = totalLength;

        next();
    });
};

export default countDocs;
