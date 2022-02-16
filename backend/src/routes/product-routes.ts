import express from 'express';
import { protect, restrictTo } from '../controllers/auth-controller';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getFieldValues,
    getProduct,
} from '../controllers/products-controller';
import countDocs from '../middlewares/count-docs';
import Product from '../models/product-model';
import reviewRouter from './review-routes';

const router = express.Router();

router.use('/:pid/reviews', reviewRouter);

router.route('/').get(countDocs(Product), getAllProducts);
router.route('/values').get(getFieldValues);
router.route('/:id').get(getProduct);

router.use(protect);
router.use(restrictTo('admin'));

router.route('/:id').delete(deleteProduct);
router.route('/create').post(createProduct);

export default router;
