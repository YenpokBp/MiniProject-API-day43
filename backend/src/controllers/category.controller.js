import db from "../config/database.js";

export async function getAllCategories(req, res) {
  try {
    const [rows] = await db.query(
      "SELECT id, name, description FROM course_categories",
    );

    res.json({
      success: true,
      message: "Data kategori berhasil diambil",
      data: rows,
    });
  } catch (err) {
    console.error("Error di getAllCategories:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getCategoryById(req, res) {
  try {
    const { id } = req.params;

    const [category] = await db.query(
      "SELECT id, name, description FROM course_categories WHERE id = ?",
      [id],
    );

    if (category.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    const [courses] = await db.query(
      `
      SELECT 
        c.id, c.title, c.description, c.rating, c.thumbnail,
        c.level, c.duration, c.status,
        u.id AS instructor_id, u.nama AS instructor_name,
        COUNT(e.id) AS enrolled_count
      FROM courses c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE c.category_id = ?
      GROUP BY c.id
      `,
      [id],
    );

    const formattedCourses = courses.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      rating: parseFloat(row.rating),
      thumbnail: row.thumbnail,
      level: row.level,
      duration: row.duration,
      status: row.status,
      enrolled_count: row.enrolled_count,
      category: {
        id: id,
        name: category[0].name,
      },
      instructor: {
        id: row.instructor_id,
        name: row.instructor_name,
      },
    }));

    const result = {
      id: category[0].id,
      name: category[0].name,
      description: category[0].description,
      courses: formattedCourses,
    };

    res.json({
      success: true,
      message: "Data kategori berhasil diambil",
      data: result,
    });
  } catch (err) {
    console.error("Error di getCategoryById:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function createCategory(req, res) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: {
          name: ["Nama kategori wajib diisi"],
        },
      });
    }

    await db.query(
      "INSERT INTO course_categories (name, description) VALUES (?, ?)",
      [name, description || null],
    );

    res.status(201).json({
      success: true,
      message: "Kategori berhasil ditambahkan",
      data: { name, description },
    });
  } catch (err) {
    console.error("Error di createCategory:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
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
        errors: {
          name: ["Nama kategori wajib diisi"],
        },
      });
    }

    const [check] = await db.query(
      "SELECT id FROM course_categories WHERE id = ?",
      [id],
    );

    if (check.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    await db.query(
      "UPDATE course_categories SET name = ?, description = ? WHERE id = ?",
      [name, description || null, id],
    );

    res.json({
      success: true,
      message: "Kategori berhasil diperbarui",
      data: { id, name, description },
    });
  } catch (err) {
    console.error("Error di updateCategory:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    const [courses] = await db.query(
      "SELECT id FROM courses WHERE category_id = ?",
      [id],
    );

    if (courses.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak dapat menghapus kategori yang masih memiliki kursus",
      });
    }

    const [check] = await db.query(
      "SELECT id FROM course_categories WHERE id = ?",
      [id],
    );

    if (check.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    await db.query("DELETE FROM course_categories WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Kategori berhasil dihapus",
      data: {},
    });
  } catch (err) {
    console.error("Error di deleteCategory:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
