export function usuarioModel(pool) {
 return {
  async byEmail(correo) { const [rows] = await pool.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]); return rows[0]; },
  async byId(id) { const [rows] = await pool.execute('SELECT * FROM usuarios WHERE id = ?', [id]); return rows[0]; },
  async revoke(id) { await pool.execute('UPDATE usuarios SET session_version = session_version + 1 WHERE id = ?', [id]); },
 };
}
