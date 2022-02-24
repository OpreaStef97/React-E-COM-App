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

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);

router.use(protect, restrictTo('admin'));

router.route('/').get(getAllPurchaseRecords).post(createPurchaseRecord);
router
    .route('/:id')
    .get(getOnePurchaseRecord)
    .patch(updatePurchaseRecord)
    .delete(deletePurchaseRecord);

export default router;
