import { Model } from 'mongoose';
import APIFeatures from '../utils/api-features';
import catchAsync from '../utils/catch-async';

const countDocs = <T>(Model: Model<T>) => {
    return catchAsync(async (req, res, next) => {
        const count = new APIFeatures(Model.count(), req.query).filter().limitFields().count();

        const totalLength = await count.query;

        req.totalLength = totalLength;

        next();
    });
};

export default countDocs;
