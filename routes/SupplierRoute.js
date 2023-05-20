import express from "express";
import {
    getSuppliers,
    getSuppliersById,
    createSupplier,
    updateSupplier,
    deleteSupplier
} from "../controllers/SupplierController.js";

const router = express.Router();

router.get('/suppliers', getSuppliers);
router.get('/suppliers/:id', getSuppliersById);
router.post('/suppliers', createSupplier);
router.patch('/suppliers/edit/:id', updateSupplier);
router.delete('/suppliers/:id', deleteSupplier);

export default router;