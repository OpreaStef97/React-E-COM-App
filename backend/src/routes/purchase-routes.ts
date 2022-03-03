import express from 'express';
import { protect, restrictTo } from '../controllers/auth-controller';
import {
    createPaymentIntent,
    createPurchaseRecord,
    deletePurchaseRecord,
    getAllPurchaseRecords,
    getOnePurchaseRecord,
    updatePurchaseRecord,
} from '../controllers/purchase-controller';
import { compareUserIds } from '../middlewares/compare-user-ids';

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);

router.use(protect);

router.route('/:uid').get(compareUserIds, getAllPurchaseRecords);

router.use(restrictTo('admin'));

router.route('/').get(getAllPurchaseRecords).post(createPurchaseRecord);
router
    .route('/:id')
    .get(getOnePurchaseRecord)
    .patch(updatePurchaseRecord)
    .delete(deletePurchaseRecord);

export default router;
