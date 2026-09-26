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

const router = express.Router();
router.use(authenticate);
router.get("/", getAllCourses);
router.get("/:id", getCoursesById);
router.post(
  "/",
  authenticate,
  ...courseValidationRules,
  validateCoursePayload,
  createCourse,
);
router.put(
  "/:id",
  authenticate,
  ...courseValidationRules,
  validateCoursePayload,
  updateCourse,
);
router.delete("/:id", deleteCourse);

export default router;
