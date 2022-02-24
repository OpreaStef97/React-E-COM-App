import express from 'express';
import { protect, restrictTo } from '../controllers/auth-controller';
import {
    createOneCart,
    createOrPutCart,
    deleteOneCart,
    getAllCarts,
} from '../controllers/cart-controller';

const router = express.Router();

router.use(protect);

router.put('/', createOrPutCart);

router.use(restrictTo('admin'));
router.get('/', getAllCarts);

router.route('/:id').post(createOneCart).delete(deleteOneCart);

export default router;
