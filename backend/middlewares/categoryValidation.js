import { body } from "express-validator";

export const nameRules = () =>
  body("name")
    .isString()
    .withMessage("Nama wajib berupa teks.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Nama wajib diisi.")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Nama harus 3 sampai 100 karakter.");

export const descriptionRules = () =>
  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("Deskripsi wajib berupa teks.")
    .bail()
    .isLength({ max: 1000 })
    .withMessage("Deskripsi maksimal 1000 karakter.");

export const categoryValidationRules = [nameRules(), descriptionRules()];
