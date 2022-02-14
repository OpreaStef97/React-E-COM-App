import AppError from '../models/error-model';
import Review from '../models/review-model';
import catchAsync from '../utils/catch-async';

export const checkUserReview = catchAsync(async (req, res, next) => {
    const doc = await Review.findById(req.params.id);
    if (!doc) {
        return next(new AppError(404, "Can't find any document for the provided id"));
    }
    if (doc.user.id !== req.user.id) {
        return next(new AppError(403, 'You are not the creator for this review`'));
    }

    next();
});
