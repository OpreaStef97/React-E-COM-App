import { Model } from 'mongoose';
import AppError from '../models/error-model';
import APIFeatures from './api-features';
import catchAsync from '../utils/catch-async';

export default class HandlerFactory<T> {
    private model: Model<T>;
    constructor(Model: Model<T>) {
        this.model = Model;
    }

    public getAll(select?: string) {
        return catchAsync(async (req, res) => {
            // To allow for nested GET reviews on product
            let filter = {};
            if (req.params.pid) filter = { product: req.params.pid };
            if (req.params.uid) filter = { user: req.params.uid };
            // EXECUTE QUERY
            const features = new APIFeatures(this.model.find(filter).select(select), req.query)
                .filter()
                .sort()
                .limitFields()
                .paginate();

            const docs = await features.query;

            const { totalLength } = req;

            // SEND RESPONSE
            res.status(200).json({
                status: 'success',
                totalLength,
                results: docs.length,
                docs,
            });
        });
    }

    public getOne(popOptions?: string, selectOptions?: string) {
        return catchAsync(async (req, res, next) => {
            let doc;

            if (popOptions) {
                doc = await this.model.findById(req.params.id).populate(popOptions, selectOptions);
            } else {
                doc = await this.model.findById(req.params.id);
            }

            if (!doc) {
                return next(new AppError(404, 'No document found with that ID'));
            }

            res.status(200).json({
                status: 'success',
                doc,
            });
        });
    }

    public createOne() {
        return catchAsync(async (req, res) => {
            const newDoc = await this.model.create(req.body);

            res.status(201).json({
                status: 'success',
                newDoc,
            });
        });
    }

    public updateOne() {
        return catchAsync(async (req, res, next) => {
            const doc = await this.model
                .findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                    runValidators: true,
                })
                .clone();

            if (!doc) {
                return next(new AppError(404, 'No document found with that ID'));
            }

            res.status(200).json({
                status: 'success',
                doc,
            });
        });
    }

    public deleteOne() {
        return catchAsync(async (req, res, next) => {
            const doc = await this.model.findByIdAndDelete(req.params.id).clone();
            if (!doc) {
                return next(new AppError(404, 'No document found with that ID'));
            }

            res.status(204).json({
                status: 'success',
                data: null,
            });
        });
    }
}
