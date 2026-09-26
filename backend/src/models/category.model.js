import db from "../config/database.js";

export async function findAllCategories() {
  const [rows] = await db.query(
    "SELECT id, name, description FROM course_categories",
  );
  return rows;
}

export async function findCategoryById(id) {
  const [rows] = await db.query(
    "SELECT id, name, description FROM course_categories WHERE id = ?",
    [id],
  );
  return rows[0] ?? null;
}

export async function categoryExists(id) {
  const [rows] = await db.query(
    "SELECT id FROM course_categories WHERE id = ?",
    [id],
  );
  return rows.length > 0;
}

export async function findCoursesByCategoryId(id) {
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
  return courses;
}

export async function insertCategory(name, description) {
  const [result] = await db.query(
    "INSERT INTO course_categories (name, description) VALUES (?, ?)",
    [name, description || null],
  );
  return result.insertId;
}

export async function updateCategoryById(id, name, description) {
  await db.query(
    "UPDATE course_categories SET name = ?, description = ? WHERE id = ?",
    [name, description || null, id],
  );
}

export async function hasCoursesInCategory(id) {
  const [courses] = await db.query(
    "SELECT id FROM courses WHERE category_id = ?",
    [id],
  );
  return courses.length > 0;
}

export async function deleteCategoryById(id) {
  await db.query("DELETE FROM course_categories WHERE id = ?", [id]);
}
