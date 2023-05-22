import express from "express";
import {
    generateInvoiceNumber,
    createOrder,
    productList
} from "../controllers/OrderController.js";

const router = express.Router();

router.get('/order/invoice-number', generateInvoiceNumber);
router.post('/order/create', createOrder);
router.post('/order/product-list', productList);

export default router;
