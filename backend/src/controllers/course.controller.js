import {
  findAllCourses,
  findCourseById,
  categoryExists,
  findCourseOwner,
  insertCourse,
  updateCourseById,
  deleteCourseById,
} from "../models/course.model.js";

function toRatingClass(rating) {
  if (rating >= 8.5) return "Top Rated";
  if (rating >= 7.0) return "Recommended";
  return "Regular";
}

function toCourseResponse(row) {
  const rating = parseFloat(row.rating);
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    rating,
    rating_class: toRatingClass(rating),
    thumbnail: row.thumbnail,
    level: row.level,
    duration: row.duration,
    status: row.status,
    enrolled_count: row.enrolled_count,
    category: { id: row.category_id, name: row.category_name },
    instructor: { id: row.instructor_id, name: row.instructor_name },
  };
}

export async function getAllCourses(req, res) {
  try {
    const rows = await findAllCourses(req.query);
    res.json({
      success: true,
      message: "Data kursus berhasil diambil",
      data: rows.map(toCourseResponse),
    });
  } catch (err) {
    console.error("Error di getAllCourses:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getCoursesById(req, res) {
  try {
    const row = await findCourseById(req.params.id);
    if (!row)
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    res.json({
      success: true,
      message: "Data kursus berhasil diambil",
      data: toCourseResponse(row),
    });
  } catch (err) {
    console.error("Error di getCoursesById:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createCourse(req, res) {
  try {
    const body = req.body;
    const userId = req.get("X-Practice-User-Id");

    if (!(await categoryExists(body.category_id))) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: { category_id: ["Kategori tidak ditemukan"] },
      });
    }

    const newId = await insertCourse({ ...body, userId });
    const row = await findCourseById(newId);

    res
      .status(201)
      .json({
        success: true,
        message: "Kursus berhasil ditambahkan",
        data: toCourseResponse(row),
      });
  } catch (err) {
    console.error("Error di createCourse:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const body = req.body;
    const userId = req.get("X-Practice-User-Id");

    const owner = await findCourseOwner(id);
    if (!owner)
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    if (owner.user_id != userId)
      return res
        .status(403)
        .json({
          success: false,
          message: "Anda tidak memiliki akses untuk mengubah data ini",
        });

    if (!(await categoryExists(body.category_id))) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: { category_id: ["Kategori tidak ditemukan"] },
      });
    }

    await updateCourseById(id, body);
    const row = await findCourseById(id);

    res.json({
      success: true,
      message: "Kursus berhasil diperbarui",
      data: toCourseResponse(row),
    });
  } catch (err) {
    console.error("Error di updateCourse:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    const userId = req.get("X-Practice-User-Id");

    const owner = await findCourseOwner(id);
    if (!owner)
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    if (owner.user_id != userId)
      return res
        .status(403)
        .json({
          success: false,
          message: "Anda tidak memiliki akses untuk mengubah data ini",
        });

    await deleteCourseById(id);
    res.status(204).end();
  } catch (err) {
    console.error("Error di deleteCourse:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}
