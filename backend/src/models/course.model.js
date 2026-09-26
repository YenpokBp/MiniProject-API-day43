import db from "../config/database.js";

const BASE_SELECT = `
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
`;

export async function findAllCourses({ search, category_id, level } = {}) {
  let query = `${BASE_SELECT} WHERE 1=1`;
  const params = [];

  if (search) {
    query += ` AND c.title LIKE ?`;
    params.push(`%${search}%`);
  }
  if (category_id) {
    query += ` AND c.category_id = ?`;
    params.push(category_id);
  }
  if (level) {
    query += ` AND c.level = ?`;
    params.push(level);
  }

  query += ` GROUP BY c.id`;

  const [rows] = await db.query(query, params);
  return rows;
}

export async function findCourseById(id) {
  const [rows] = await db.query(`${BASE_SELECT} WHERE c.id = ? GROUP BY c.id`, [
    id,
  ]);
  return rows[0] ?? null;
}

export async function categoryExists(categoryId) {
  const [rows] = await db.query(
    "SELECT id FROM course_categories WHERE id = ?",
    [categoryId],
  );
  return rows.length > 0;
}

export async function findCourseOwner(id) {
  const [rows] = await db.query("SELECT user_id FROM courses WHERE id = ?", [
    id,
  ]);
  return rows[0] ?? null;
}

export async function insertCourse({
  title,
  description,
  rating,
  level,
  duration,
  category_id,
  userId,
  status,
  thumbnail,
}) {
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
  return result.insertId;
}

export async function updateCourseById(
  id,
  {
    title,
    description,
    rating,
    level,
    duration,
    category_id,
    status,
    thumbnail,
  },
) {
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
}

export async function deleteCourseById(id) {
  await db.query("DELETE FROM courses WHERE id = ?", [id]);
}
