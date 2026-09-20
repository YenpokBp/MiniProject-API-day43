import db from "../config/database.js";

export async function getAllUsers(req, res) {
  try {
    const [rows] = await db.query("SELECT id, nama AS name FROM users");

    res.json({
      success: true,
      message: "Data pengguna berhasil diambil",
      data: rows,
    });
  } catch (err) {
    console.error("Error di getAllUsers:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
