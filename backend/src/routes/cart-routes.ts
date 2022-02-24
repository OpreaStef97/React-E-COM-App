import express from 'express';
import HandlerFactory from '../api/handler-factory';
import { protect } from '../controllers/auth-controller';
import Cart from '../models/cart-model';

const factory = new HandlerFactory(Cart);

const router = express.Router();

router.use(protect);

router.route('/').get(factory.getAll()).post(factory.createOne());

export default router;
