import express from "express";
import {
    getProducts,
    getProductsOutOfStock,
    getExpiredProducts,
    getProductsById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/ProductController.js";

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/outofstock', getProductsOutOfStock);
router.get('/products/expired', getExpiredProducts);
router.get('/products/:id', getProductsById);
router.post('/products', createProduct);
router.patch('/products/edit/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;