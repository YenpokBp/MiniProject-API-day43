import db from "../config/database.js";

// GET sudah ada di atas...
export async function getAllCourses(req, res) {
  try {
    const { search, category_id, level } = req.query;

    let query = `
      SELECT 
        c.id, c.title, c.description, c.rating, c.thumbnail,
        c.level, c.duration, c.status, c.category_id, c.user_id,
        u.id AS instructor_id, u.nama AS instructor_name,
        cc.id AS category_id, cc.name AS category_name,
        COUNT(e.id) AS enrolled_count
      FROM courses c
      JOIN users u ON c.user_id = u.id
      JOIN course_categories cc ON c.category_id = cc.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE 1=1
    `;

    const params = [];

    // Filter search by title
    if (search) {
      query += ` AND c.title LIKE ?`;
      params.push(`%${search}%`);
    }

    // Filter by category
    if (category_id) {
      query += ` AND c.category_id = ?`;
      params.push(category_id);
    }

    // Filter by level
    if (level) {
      query += ` AND c.level = ?`;
      params.push(level);
    }

    query += ` GROUP BY c.id`;

    const [rows] = await db.query(query, params);

    const courses = rows.map((row) => {
      const rating = parseFloat(row.rating);
      let rating_class;
      if (rating >= 8.5) {
        rating_class = "Top Rated";
      } else if (rating >= 7.0) {
        rating_class = "Recommended";
      } else {
        rating_class = "Regular";
      }

      return {
        id: row.id,
        title: row.title,
        description: row.description,
        rating: rating,
        rating_class: rating_class,
        thumbnail: row.thumbnail,
        level: row.level,
        duration: row.duration,
        status: row.status,
        enrolled_count: row.enrolled_count,
        category: {
          id: row.category_id,
          name: row.category_name,
        },
        instructor: {
          id: row.instructor_id,
          name: row.instructor_name,
        },
      };
    });

    res.json({
      success: true,
      message: "Data kursus berhasil diambil",
      data: courses,
    });
  } catch (err) {
    console.error("Error di getAllCourses:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
export async function getCoursesById(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        c.id, c.title, c.description, c.rating, c.thumbnail,
        c.level, c.duration, c.status, c.category_id, c.user_id,
        u.id AS instructor_id, u.nama AS instructor_name,
        cc.id AS category_id, cc.name AS category_name,
        COUNT(e.id) AS enrolled_count
      FROM courses c
      JOIN users u ON c.user_id = u.id
      JOIN course_categories cc ON c.category_id = cc.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE c.id = ?
      GROUP BY c.id
    `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    const row = rows[0];
    const rating = parseFloat(row.rating);
    let rating_class;
    if (rating >= 8.5) {
      rating_class = "Top Rated";
    } else if (rating >= 7.0) {
      rating_class = "Recommended";
    } else {
      rating_class = "Regular";
    }

    const course = {
      id: row.id,
      title: row.title,
      description: row.description,
      rating: rating,
      rating_class: rating_class, // <-- tambah sini
      thumbnail: row.thumbnail,
      level: row.level,
      duration: row.duration,
      status: row.status,
      enrolled_count: row.enrolled_count,
      category: {
        id: row.category_id,
        name: row.category_name,
      },
      instructor: {
        id: row.instructor_id,
        name: row.instructor_name,
      },
    };

    res.json({
      success: true,
      message: "Data kursus berhasil diambil",
      data: course,
    });
  } catch (err) {
    console.error("Error di getCoursesById:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// Terus createCourse, updateCourse, deleteCourse di bawah...
export async function createCourse(req, res) {
  try {
    const {
      title,
      description,
      rating,
      level,
      duration,
      category_id,
      status,
      thumbnail,
    } = req.body;
    const userId = req.get("X-Practice-User-Id");

    // Validasi basic
    if (
      !title ||
      !description ||
      !rating ||
      !level ||
      !duration ||
      !category_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: {
          title: !title ? ["Judul wajib diisi"] : [],
          description: !description ? ["Deskripsi wajib diisi"] : [],
          rating: !rating ? ["Rating wajib diisi"] : [],
          level: !level ? ["Level wajib diisi"] : [],
          duration: !duration ? ["Durasi wajib diisi"] : [],
          category_id: !category_id ? ["Kategori wajib diisi"] : [],
        },
      });
    }

    // Cek kategori ada
    const [catCheck] = await db.query(
      "SELECT id FROM course_categories WHERE id = ?",
      [category_id],
    );
    if (catCheck.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: {
          category_id: ["Kategori tidak ditemukan"],
        },
      });
    }

    const [result] = await db.query(
      `INSERT INTO courses (title, description, rating, level, duration, category_id, user_id, status, thumbnail)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        rating,
        level,
        duration,
        category_id,
        userId,
        status || "draft",
        thumbnail || null,
      ],
    );

    const [newCourse] = await db.query(
      `SELECT 
        c.id, c.title, c.description, c.rating, c.thumbnail,
        c.level, c.duration, c.status,
        u.id AS instructor_id, u.nama AS instructor_name,
        cc.id AS category_id, cc.name AS category_name,
        COUNT(e.id) AS enrolled_count
      FROM courses c
      JOIN users u ON c.user_id = u.id
      JOIN course_categories cc ON c.category_id = cc.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE c.id = ?
      GROUP BY c.id`,
      [result.insertId],
    );

    const row = newCourse[0];
    const course = {
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
        id: row.category_id,
        name: row.category_name,
      },
      instructor: {
        id: row.instructor_id,
        name: row.instructor_name,
      },
    };

    res.status(201).json({
      success: true,
      message: "Kursus berhasil ditambahkan",
      data: course,
    });
  } catch (err) {
    console.error("Error di createCourse:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      rating,
      level,
      duration,
      category_id,
      status,
      thumbnail,
    } = req.body;
    const userId = req.get("X-Practice-User-Id");

    // Cek course ada
    const [courseCheck] = await db.query(
      "SELECT user_id FROM courses WHERE id = ?",
      [id],
    );
    if (courseCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    // Cek ownership
    if (courseCheck[0].user_id != userId) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk mengubah data ini",
      });
    }

    // Validasi
    if (
      !title ||
      !description ||
      !rating ||
      !level ||
      !duration ||
      !category_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: {
          title: !title ? ["Judul wajib diisi"] : [],
          description: !description ? ["Deskripsi wajib diisi"] : [],
          rating: !rating ? ["Rating wajib diisi"] : [],
          level: !level ? ["Level wajib diisi"] : [],
          duration: !duration ? ["Durasi wajib diisi"] : [],
          category_id: !category_id ? ["Kategori wajib diisi"] : [],
        },
      });
    }

    // Cek kategori ada
    const [catCheck] = await db.query(
      "SELECT id FROM course_categories WHERE id = ?",
      [category_id],
    );
    if (catCheck.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: {
          category_id: ["Kategori tidak ditemukan"],
        },
      });
    }

    await db.query(
      `UPDATE courses SET title = ?, description = ?, rating = ?, level = ?, duration = ?, category_id = ?, status = ?, thumbnail = ?
       WHERE id = ?`,
      [
        title,
        description,
        rating,
        level,
        duration,
        category_id,
        status || "draft",
        thumbnail || null,
        id,
      ],
    );

    const [updatedCourse] = await db.query(
      `SELECT 
        c.id, c.title, c.description, c.rating, c.thumbnail,
        c.level, c.duration, c.status,
        u.id AS instructor_id, u.nama AS instructor_name,
        cc.id AS category_id, cc.name AS category_name,
        COUNT(e.id) AS enrolled_count
      FROM courses c
      JOIN users u ON c.user_id = u.id
      JOIN course_categories cc ON c.category_id = cc.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE c.id = ?
      GROUP BY c.id`,
      [id],
    );

    const row = updatedCourse[0];
    const course = {
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
        id: row.category_id,
        name: row.category_name,
      },
      instructor: {
        id: row.instructor_id,
        name: row.instructor_name,
      },
    };

    res.json({
      success: true,
      message: "Kursus berhasil diperbarui",
      data: course,
    });
  } catch (err) {
    console.error("Error di updateCourse:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    const userId = req.get("X-Practice-User-Id");

    // Cek course ada
    const [courseCheck] = await db.query(
      "SELECT user_id FROM courses WHERE id = ?",
      [id],
    );
    if (courseCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    // Cek ownership
    if (courseCheck[0].user_id != userId) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk mengubah data ini",
      });
    }

    await db.query("DELETE FROM courses WHERE id = ?", [id]);

    res.status(204).end();
  } catch (err) {
    console.error("Error di deleteCourse:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
