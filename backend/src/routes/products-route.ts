import express from 'express';
import { getAllProducts, getFieldValues, getProduct } from '../controllers/products-controller';

const router = express.Router();

router.route('/').get(getAllProducts);

router.route('/values').get(getFieldValues);

router.route('/:pid').get(getProduct);

export default router;
