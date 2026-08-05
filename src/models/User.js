const pool = require('../db/config');
const bcrypt = require('bcryptjs');

class User {
  // Criar novo usuário
  static async create(email, username, password) {
    try {
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `
        INSERT INTO users (email, username, password)
        VALUES ($1, $2, $3)
        RETURNING id, email, username, is_verified, created_at
      `;

      const result = await pool.query(query, [email, username, hashedPassword]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por ID
  static async findById(id) {
    try {
      const query = 'SELECT id, email, username, is_verified, created_at FROM users WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por username
  static async findByUsername(username) {
    try {
      const query = 'SELECT * FROM users WHERE username = $1';
      const result = await pool.query(query, [username]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Comparar senha
  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Atualizar reset token
  static async setResetToken(userId, token, expiresIn = 3600000) {
    try {
      const expiresAt = new Date(Date.now() + expiresIn);

      const query = `
        UPDATE users
        SET reset_token = $1, reset_token_expires = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING id, email, username
      `;

      const result = await pool.query(query, [token, expiresAt, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Encontrar usuário por reset token
  static async findByResetToken(token) {
    try {
      const query = `
        SELECT * FROM users
        WHERE reset_token = $1 AND reset_token_expires > CURRENT_TIMESTAMP
      `;

      const result = await pool.query(query, [token]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Atualizar senha
  static async updatePassword(userId, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const query = `
        UPDATE users
        SET password = $1, reset_token = NULL, reset_token_expires = NULL, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, email, username
      `;

      const result = await pool.query(query, [hashedPassword, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Verificar e-mail
  static async verifyEmail(userId) {
    try {
      const query = `
        UPDATE users
        SET is_verified = TRUE, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, email, username, is_verified
      `;

      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
