import { NextFunction, Request, Response } from 'express';

import Review from '../models/review-model';
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
