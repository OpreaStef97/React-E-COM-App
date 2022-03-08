import express from 'express';
import { protect, restrictTo } from '../controllers/auth-controller';
import {
    getAllReviews,
    createReview,
    getReview,
    updateReview,
    deleteReview,
    setProductUserIds,
    getReviewRatingsPerProduct,
} from '../controllers/reviews-controller';
import { checkUserReview } from '../middlewares/check-user-review';
import countDocs from '../middlewares/count-docs';
import Review from '../models/review-model';

const router = express.Router({ mergeParams: true });
router.get('/', countDocs(Review), getAllReviews);
router.get('/stats', getReviewRatingsPerProduct);

router.use(protect);

router.post('/', restrictTo('user', 'admin'), setProductUserIds, (req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        createReview(req, res, next);
    } else {
        res.status(403).json({
            status: 'error',
            message: 'Posting reviews feature is currently disabled',
        });
    }
});

router
    .route('/:id')
    .get(getReview)
    .patch(checkUserReview, restrictTo('user', 'admin'), updateReview)
    .delete(checkUserReview, restrictTo('user', 'admin'), deleteReview);

export default router;
