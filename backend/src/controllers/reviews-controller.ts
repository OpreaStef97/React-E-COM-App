import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import Review from '../models/review-model';
import catchAsync from '../utils/catch-async';
import HandlerFactory from '../api/handler-factory';

const factory = new HandlerFactory(Review);

export const setProductUserIds = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.product) req.body.product = req.params.pid;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

export const getAllReviews = factory.getAll();
export const getReview = factory.getOne('product', '-status');
export const createReview = factory.createOne();
export const updateReview = factory.updateOne();
export const deleteReview = factory.deleteOne();

export const getReviewRatingsPerProduct = catchAsync(async (req, res) => {
    const ObjectId = mongoose.Types.ObjectId;

    const stats = await Review.aggregate([
        { $match: { product: new ObjectId(req.params.pid.toString()) } },
        {
            $group: { _id: '$rating', count: { $sum: 1 } },
        },
        { $sort: { _id: -1 } },
    ]);

    res.status(200).json({
        stats,
    });
});
