require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const createUsersTable = require('./db/migrations');

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors());

// Middlewares de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Servidor está rodando!' });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: '🔐 Sistema de Login com JWT',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        refreshToken: 'POST /api/auth/refresh-token',
        profile: 'GET /api/auth/profile (requer autenticação)',
        requestPasswordReset: 'POST /api/auth/request-password-reset',
        resetPassword: 'POST /api/auth/reset-password',
      },
    },
  });
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
  });
});

// Inicializar servidor
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Criar tabela de usuários
    await createUsersTable();

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║     🔐 LOGIN SYSTEM COM JWT 🔐        ║
║          Servidor iniciado!            ║
╚════════════════════════════════════════╝
      
📍 URL: http://localhost:${PORT}
🗄️  Banco de dados: PostgreSQL
🔑 JWT Ativo
📧 Email Service: ${process.env.EMAIL_SERVICE || 'gmail'}
🌍 Ambiente: ${process.env.NODE_ENV || 'development'}

⚡ Servidor pronto para receber requisições!
      `);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
