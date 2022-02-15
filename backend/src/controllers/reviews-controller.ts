import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import Review from '../models/review-model';
import catchAsync from '../utils/catch-async';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handler-factory';

export const setProductUserIds = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.product) req.body.product = req.params.pid;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

export const getAllReviews = getAll(Review);
export const getReview = getOne(Review, 'product', '-status');
export const createReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);

export const getReviewRatingsPerProduct = catchAsync(async (req, res) => {
    console.log(req.params.pid);
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
