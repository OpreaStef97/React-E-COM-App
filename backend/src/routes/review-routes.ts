import express from 'express';
import { protect, restrictTo } from '../controllers/auth-controller';
import {
    getAllReviews,
    createReview,
    getReview,
    updateReview,
    deleteReview,
    setProductUserIds,
} from '../controllers/reviews-controller';
import { checkUserReview } from '../middlewares/check-user-review';

const router = express.Router({ mergeParams: true });

router.get('/', getAllReviews);

router.use(protect);

router.post('/', restrictTo('user', 'admin'), setProductUserIds, createReview);

router
    .route('/:id')
    .get(getReview)
    .patch(checkUserReview, restrictTo('user', 'admin'), updateReview)
    .delete(checkUserReview, restrictTo('user', 'admin'), deleteReview);

export default router;
