import db from "../config/database.js";

export async function findUserByEmail(email) {
  const [rows] = await db.query(
    "SELECT id, nama AS name, email, password FROM users WHERE email = ?",
    [email],
  );
  return rows[0] ?? null;
}

export async function createUser({ name, email, passwordHash }) {
  try {
    const [result] = await db.query(
      "INSERT INTO users (nama, email, password) VALUES (?, ?, ?)",
      [name, email, passwordHash],
    );
    return { id: result.insertId, name, email };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return null; // email sudah dipakai
    throw err;
  }
}
