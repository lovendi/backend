import express from "express";
import {
    generateInvoiceNumber,
    createOrder
} from "../controllers/OrderController.js";

const router = express.Router();

router.get('/order/invoice-number', generateInvoiceNumber);
router.post('/order/create', createOrder);

export default router;
