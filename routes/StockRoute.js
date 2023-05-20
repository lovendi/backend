import express from "express";
import {
    getStocks,
    createStock,
    deleteStock
} from "../controllers/StockController.js";

const router = express.Router();

router.get('/stocks', getStocks);
router.post('/stocks', createStock);
router.delete('/stocks/:id', deleteStock);

export default router;
