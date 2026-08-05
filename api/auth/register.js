const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Generate tokens
function generateTokenPair(userId) {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_aqui_mudar_em_producao',
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'sua_chave_secreta_refresh_mudar_em_producao',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
}

export default async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.status(200).json({ ok: true });
    return;
  }

  // Set CORS headers
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, username, password, passwordConfirm } = req.body;

    // Validations
    if (!email || !username || !password || !passwordConfirm) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const emailResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailResult.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Check if username already exists
    const usernameResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (usernameResult.rows.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, username, password, is_verified, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id, email, username, is_verified, created_at',
      [email, username, hashedPassword, false]
    );

    const user = result.rows[0];
    const { accessToken, refreshToken } = generateTokenPair(user.id);

    res.status(201).json({
      message: 'User registered successfully! ✅',
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
}
