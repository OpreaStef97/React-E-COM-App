import { Model } from 'mongoose';
import AppError from '../models/error-model';
import APIFeatures from '../utils/api-features';
import catchAsync from '../utils/catch-async';

export const deleteOne = <T>(Model: Model<T>) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id).clone();
        if (!doc) {
            return next(new AppError(404, 'No document found with that ID'));
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    });

export const updateOne = <T>(Model: Model<T>) =>
    catchAsync(async (req, res, next) => {
        
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).clone();

        if (!doc) {
            return next(new AppError(404, 'No document found with that ID'));
        }

        res.status(200).json({
            status: 'success',
            doc,
        });
    });

export const createOne = <T>(Model: Model<T>) =>
    catchAsync(async (req, res) => {
        const newDoc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            newDoc,
        });
    });

export const getOne = <T>(Model: Model<T>, popOptions?: string, selectOptions?: string) =>
    catchAsync(async (req, res, next) => {
        let doc;

        if (popOptions) {
            doc = await Model.findById(req.params.id).populate(popOptions, selectOptions);
        } else {
            doc = await Model.findById(req.params.id);
        }

        if (!doc) {
            return next(new AppError(404, 'No document found with that ID'));
        }

        res.status(200).json({
            status: 'success',
            doc,
        });
    });

export const getAll = <T>(Model: Model<T>) =>
    catchAsync(async (req, res) => {
        // To allow for nested GET reviews on product
        let filter = {};
        if (req.params.pid) filter = { product: req.params.pid };
        // EXECUTE QUERY
        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const docs = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: docs.length,
            docs,
        });
    });
