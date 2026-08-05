const User = require('../models/User');
const { generateTokenPair } = require('../utils/generateTokens');
const { verifyRefreshToken } = require('../middleware/auth');
const emailService = require('../services/emailService');
const crypto = require('crypto');

class AuthController {
  // Registrar novo usuário
  static async register(req, res) {
    try {
      const { email, username, password, passwordConfirm } = req.body;

      // Validações
      if (!email || !username || !password || !passwordConfirm) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      if (password !== passwordConfirm) {
        return res.status(400).json({ error: 'As senhas não coincidem' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
      }

      // Verificar se email já existe
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ error: 'Este email já está registrado' });
      }

      // Verificar se username já existe
      const existingUsername = await User.findByUsername(username);
      if (existingUsername) {
        return res.status(409).json({ error: 'Este nome de usuário já existe' });
      }

      // Criar usuário
      const newUser = await User.create(email, username, password);

      // Enviar email de boas-vindas
      try {
        await emailService.sendWelcomeEmail(email, username);
      } catch (emailError) {
        console.warn('Aviso: Email de boas-vindas não pôde ser enviado:', emailError.message);
      }

      const { accessToken, refreshToken } = generateTokenPair(newUser.id);

      res.status(201).json({
        message: 'Usuário registrado com sucesso! ✅',
        user: newUser,
        tokens: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  }

  // Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validações
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      // Buscar usuário
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      // Comparar senhas
      const isPasswordValid = await User.comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      // Gerar tokens
      const { accessToken, refreshToken } = generateTokenPair(user.id);

      res.json({
        message: 'Login realizado com sucesso! 🎉',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          is_verified: user.is_verified,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  // Refresh token
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token é obrigatório' });
      }

      // Verificar refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Gerar novo par de tokens
      const tokens = generateTokenPair(decoded.userId);

      res.json({
        message: 'Token atualizado com sucesso!',
        tokens,
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Refresh token expirado' });
      }
      res.status(403).json({ error: 'Refresh token inválido' });
    }
  }

  // Solicitar reset de senha
  static async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
      }

      // Buscar usuário
      const user = await User.findByEmail(email);
      if (!user) {
        // Não revelar se o email existe ou não (por segurança)
        return res.json({
          message: 'Se o email existe, um link de reset foi enviado',
        });
      }

      // Gerar token de reset
      const resetToken = crypto.randomBytes(32).toString('hex');

      // Salvar token no banco
      await User.setResetToken(user.id, resetToken);

      // Enviar email
      try {
        await emailService.sendResetPasswordEmail(email, resetToken, user.username);
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        return res.status(500).json({ error: 'Erro ao enviar email de reset' });
      }

      res.json({
        message: 'Link de reset enviado para o seu email! 📧',
      });
    } catch (error) {
      console.error('Erro ao solicitar reset:', error);
      res.status(500).json({ error: 'Erro ao solicitar reset de senha' });
    }
  }

  // Resetar senha
  static async resetPassword(req, res) {
    try {
      const { token, newPassword, passwordConfirm } = req.body;

      if (!token || !newPassword || !passwordConfirm) {
        return res.status(400).json({ error: 'Token e senhas são obrigatórios' });
      }

      if (newPassword !== passwordConfirm) {
        return res.status(400).json({ error: 'As senhas não coincidem' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
      }

      // Buscar usuário com token válido
      const user = await User.findByResetToken(token);
      if (!user) {
        return res.status(400).json({ error: 'Token inválido ou expirado' });
      }

      // Atualizar senha
      const updatedUser = await User.updatePassword(user.id, newPassword);

      res.json({
        message: 'Senha resetada com sucesso! ✅',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      res.status(500).json({ error: 'Erro ao resetar senha' });
    }
  }

  // Obter dados do usuário autenticado
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json({
        message: 'Perfil carregado com sucesso!',
        user,
      });
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      res.status(500).json({ error: 'Erro ao obter perfil' });
    }
  }
}

module.exports = AuthController;
