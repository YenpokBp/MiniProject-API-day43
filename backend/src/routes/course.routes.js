import express from "express";
import {
  getAllCourses,
  getCoursesById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { authenticate } from "../../middlewares/authenticate.js";
import {
  courseValidationRules,
  validateCoursePayload,
} from "../../middlewares/courseValidation.js";
import { validateId } from "../../middlewares/validateId.js";
import { validateRequest } from "../../middlewares/validateRequest.js";

const router = express.Router();
router.get("/", getAllCourses);
router.get("/:id", validateId, validateRequest, getCoursesById);
router.get("/", getAllCourses);
router.get("/:id", validateId, validateRequest, getCoursesById);
router.post(
  "/",
  authenticate,
  ...courseValidationRules,
  validateRequest,
  createCourse,
);
router.put(
  "/:id",
  authenticate,
  validateId,
  ...courseValidationRules,
  validateRequest,
  updateCourse,
);
router.delete("/:id", authenticate, validateId, validateRequest, deleteCourse);
export default router;
