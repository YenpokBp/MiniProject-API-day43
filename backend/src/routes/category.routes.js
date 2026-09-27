import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { validateId } from "../../middlewares/validateId.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { categoryValidationRules } from "../../middlewares/categoryValidation.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", validateId, validateRequest, getCategoryById);
router.post(
  "/",
  authenticate,
  ...categoryValidationRules,
  validateRequest,
  createCategory,
);
router.put(
  "/:id",
  authenticate,
  validateId,
  ...categoryValidationRules,
  validateRequest,
  updateCategory,
);
router.delete(
  "/:id",
  authenticate,
  validateId,
  validateRequest,
  deleteCategory,
);

export default router;
