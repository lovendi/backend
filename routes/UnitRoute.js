import express from "express";
import {
    getUnits,
    getUnitsById,
    createUnit,
    updateUnit,
    deleteUnit
} from "../controllers/UnitController.js";

const router = express.Router();

router.get('/units', getUnits);
router.get('/units/:id', getUnitsById);
router.post('/units', createUnit);
router.patch('/units/edit/:id', updateUnit);
router.delete('/units/:id', deleteUnit);

export default router;