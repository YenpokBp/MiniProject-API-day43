import { body, validationResult } from "express-validator";
import { HttpError } from "../src/utils/HttpError";

export const titleRules = () =>
  body("title")
    .isString()
    .withMessage("Judul wajib berupa teks.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Judul wajib diisi.")
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage("Judul harus 3 sampai 150 karakter.");

export const descriptionRules = () =>
  body("description")
    .isString()
    .withMessage("Deskripsi wajib berupa teks.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Deskripsi wajib diisi.")
    .bail()
    .isLength({ min: 10 })
    .withMessage("Deskripsi minimal 10 karakter.");

export const ratingRules = () =>
  body("rating")
    .notEmpty()
    .withMessage("Rating wajib diisi.")
    .bail()
    .isFloat({ min: 1, max: 10 })
    .withMessage("Rating harus di antara 1 dan 10.");

export const levelRules = () =>
  body("level")
    .isString()
    .withMessage("Level wajib berupa teks.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Level wajib diisi.")
    .bail()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage(
      "Level harus salah satu dari beginner, intermediate, advanced.",
    );

export const durationRules = () =>
  body("duration")
    .notEmpty()
    .withMessage("Durasi wajib diisi.")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Durasi harus berupa angka bulat lebih dari 0.");

export const categoryIdRules = () =>
  body("category_id")
    .notEmpty()
    .withMessage("Kategori wajib diisi.")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Kategori tidak valid.");

export const courseValidationRules = [
  titleRules(),
  descriptionRules(),
  ratingRules(),
  levelRules(),
  durationRules(),
  categoryIdRules(),
];

export function validateCoursePayload(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = {};
  for (const err of result.array()) {
    if (!errors[err.path]) errors[err.path] = [];
    errors[err.path].push(err.msg);
  }

  next(new HttpError(400, "Validasi gagal", errors));
}
