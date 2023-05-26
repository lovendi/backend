import express from "express";
import {
    generateInvoiceNumber,
    createOrder,
    productList,
    orderList,
    getOmzet,
    getProfit
} from "../controllers/OrderController.js";

const router = express.Router();

router.get('/order/invoice-number', generateInvoiceNumber);
router.post('/order/create', createOrder);
router.post('/order/product-list', productList);
router.post('/order/list', orderList);
router.post('/order/omzet', getOmzet);
router.post('/order/profit', getProfit);

export default router;
