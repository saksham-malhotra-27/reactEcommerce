import express from 'express';
import { addToCart, removeFromCart, getCart, change } from '../controllers/cartController.js';

const router = express.Router();

router.post('/cart/add',   addToCart);
router.post('/cart/remove',removeFromCart);
router.get('/cart/:userId',getCart);
router.post('/cart/change', change)

export default router;
