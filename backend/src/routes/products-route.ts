import express from 'express';
import { protect, restrictTo } from '../controllers/auth-controller';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getFieldValues,
    getProduct,
} from '../controllers/products-controller';

const router = express.Router();

router.route('/').get(getAllProducts);

router.route('/values').get(getFieldValues);

router.route('/:pid').get(getProduct);

router.use(protect);

router.route('/:pid').delete(restrictTo(['admin']), deleteProduct);

router.route('/create').post(restrictTo(['admin']), createProduct);

export default router;
