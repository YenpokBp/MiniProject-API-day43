import {
  findAllCategories,
  findCategoryById,
  categoryExists,
  findCoursesByCategoryId,
  insertCategory,
  updateCategoryById,
  hasCoursesInCategory,
  deleteCategoryById,
} from "../models/category.model.js";

function toCourseSummary(row, categoryId, categoryName) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    rating: parseFloat(row.rating),
    thumbnail: row.thumbnail,
    level: row.level,
    duration: row.duration,
    status: row.status,
    enrolled_count: row.enrolled_count,
    category: { id: categoryId, name: categoryName },
    instructor: { id: row.instructor_id, name: row.instructor_name },
  };
}

export async function getAllCategories(req, res) {
  try {
    const rows = await findAllCategories();
    res.json({
      success: true,
      message: "Data kategori berhasil diambil",
      data: rows,
    });
  } catch (err) {
    console.error("Error di getAllCategories:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getCategoryById(req, res) {
  try {
    const { id } = req.params;

    const category = await findCategoryById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }

    const courses = await findCoursesByCategoryId(id);
    const formattedCourses = courses.map((row) =>
      toCourseSummary(row, category.id, category.name),
    );

    res.json({
      success: true,
      message: "Data kategori berhasil diambil",
      data: { ...category, courses: formattedCourses },
    });
  } catch (err) {
    console.error("Error di getCategoryById:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createCategory(req, res) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: { name: ["Nama kategori wajib diisi"] },
      });
    }

    await insertCategory(name, description);

    res
      .status(201)
      .json({
        success: true,
        message: "Kategori berhasil ditambahkan",
        data: { name, description },
      });
  } catch (err) {
    console.error("Error di createCategory:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: { name: ["Nama kategori wajib diisi"] },
      });
    }

    if (!(await categoryExists(id))) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }

    await updateCategoryById(id, name, description);

    res.json({
      success: true,
      message: "Kategori berhasil diperbarui",
      data: { id, name, description },
    });
  } catch (err) {
    console.error("Error di updateCategory:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    if (await hasCoursesInCategory(id)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Tidak dapat menghapus kategori yang masih memiliki kursus",
        });
    }

    if (!(await categoryExists(id))) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }

    await deleteCategoryById(id);

    res.json({ success: true, message: "Kategori berhasil dihapus", data: {} });
  } catch (err) {
    console.error("Error di deleteCategory:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}
