import express from "express";
import {
    getCategorys,
    getCategorysById,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/CategoryController.js";

const router = express.Router();

router.get('/categorys', getCategorys);
router.get('/categorys/:id', getCategorysById);
router.post('/categorys', createCategory);
router.patch('/categorys/edit/:id', updateCategory);
router.delete('/categorys/:id', deleteCategory);

export default router;