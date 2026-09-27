import { param } from "express-validator";
export const validateId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID harus berupa angka positif > 0"),
];
