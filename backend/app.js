import express from "express";
import cors from "cors";
import courseRoutes from "./src/routes/course.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import authRoutes from "./src/routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
const app = express();

// CORS middleware
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server layanan siap");
});

app.use("/api/courses", courseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/practice/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use(errorHandler);
export default app;
