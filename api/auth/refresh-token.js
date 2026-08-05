const jwt = require('jsonwebtoken');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function generateAccessToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_aqui_mudar_em_producao',
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
}

function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || 'sua_chave_secreta_refresh_mudar_em_producao'
    );
    return decoded;
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).json({ ok: true });
    return;
  }

  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const newAccessToken = generateAccessToken(decoded.userId);

    res.json({
      message: 'Token refreshed successfully! ✅',
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Error refreshing token' });
  }
}
