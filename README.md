# 🔐 Sistema de Login com JWT

Um sistema robusto e seguro de autenticação com JSON Web Tokens (JWT), desenvolvido com **Express.js**, **PostgreSQL**, **bcrypt** e **Nodemailer**.

## ✨ Funcionalidades

- ✅ **Cadastro e Login** - Registro de novos usuários e autenticação segura
- ✅ **Hash de Senha** - Senhas criptografadas com bcrypt
- ✅ **Tokens JWT** - Access token (15 minutos) + Refresh token (7 dias)
- ✅ **Middleware de Autenticação** - Proteção de rotas
- ✅ **Reset de Senha** - Solicitação e resetagem de senha via email
- ✅ **Segurança** - Helmet + CORS + Validação de entrada
- ✅ **Email** - Integração com Nodemailer para notificações

## 🛠️ Stack Tecnológico

| Tecnologia | Versão | Propósito |
|------------|--------|----------|
| **Express.js** | ^4.18.2 | Framework web |
| **PostgreSQL** | Via `pg` | Banco de dados |
| **JWT** | ^9.1.2 | Autenticação stateless |
| **bcryptjs** | ^2.4.3 | Hash de senhas |
| **Nodemailer** | ^6.9.7 | Envio de emails |
| **Helmet** | ^7.1.0 | Segurança HTTP |
| **CORS** | ^2.8.5 | Controle de origem cruzada |
| **Dotenv** | ^16.3.1 | Variáveis de ambiente |

## 📋 Pré-requisitos

- Node.js v14+
- PostgreSQL instalado e rodando
- npm ou yarn

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/VidiPT89/LoginSystemWithJWT.git
cd LoginSystemWithJWT
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Abra `.env` e configure:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=login_system
DB_USER=postgres
DB_PASSWORD=sua_senha

# JWT
JWT_SECRET=sua_chave_secreta_super_segura
JWT_REFRESH_SECRET=sua_chave_secreta_refresh
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_app_gmail  # Use App Password do Google
EMAIL_FROM=noreply@loginsystem.com

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Crie o banco de dados

```bash
# Conecte ao PostgreSQL
psql -U postgres

# Crie o banco
CREATE DATABASE login_system;

# Saia do PostgreSQL
\q
```

### 5. Execute as migrations

```bash
npm run migrate
```

Isso criará automaticamente a tabela `users` com os índices necessários.

### 6. Inicie o servidor

**Modo desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

O servidor estará disponível em: `http://localhost:3000`

## 📚 Endpoints da API

### Autenticação Pública

#### 1. **Registrar Novo Usuário**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "username": "meu_usuario",
  "password": "senha123",
  "passwordConfirm": "senha123"
}
```

**Resposta (201):**
```json
{
  "message": "Usuário registrado com sucesso! ✅",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "username": "meu_usuario",
    "is_verified": false,
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 2. **Fazer Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "message": "Login realizado com sucesso! 🎉",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "username": "meu_usuario",
    "is_verified": false
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 3. **Renovar Access Token**
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Resposta (200):**
```json
{
  "message": "Token atualizado com sucesso!",
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 4. **Solicitar Reset de Senha**
```http
POST /api/auth/request-password-reset
Content-Type: application/json

{
  "email": "usuario@exemplo.com"
}
```

**Resposta (200):**
```json
{
  "message": "Se o email existe, um link de reset foi enviado"
}
```

#### 5. **Resetar Senha**
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "token_recebido_no_email",
  "newPassword": "nova_senha123",
  "passwordConfirm": "nova_senha123"
}
```

**Resposta (200):**
```json
{
  "message": "Senha resetada com sucesso! ✅",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "username": "meu_usuario"
  }
}
```

### Autenticação Protegida

#### 6. **Obter Perfil do Usuário**
```http
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Resposta (200):**
```json
{
  "message": "Perfil carregado com sucesso!",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "username": "meu_usuario",
    "is_verified": false,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🔒 Segurança

### Boas Práticas Implementadas

1. **Criptografia de Senhas**: Usando bcryptjs com 10 rounds
2. **JWT Seguro**: Access tokens com curta duração + Refresh tokens com longa duração
3. **Validação de Entrada**: Verificação de todos os campos obrigatórios
4. **Rate Limiting**: Recomenda-se usar `express-rate-limit` em produção
5. **HTTPS**: Use HTTPS em produção
6. **Helmet**: Headers HTTP seguros
7. **CORS**: Controle de origem configurável
8. **Tokens de Reset**: Com expiração de 1 hora

### Recomendações para Produção

```bash
# Instale rate limiter
npm install express-rate-limit

# Use com HTTPS
# Configure NGINX como proxy reverso
# Use variáveis de ambiente seguras
# Configure backup do banco de dados
```

## 📊 Estrutura do Banco de Dados

### Tabela: `users`

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

## 📁 Estrutura do Projeto

```
LoginSystemWithJWT/
├── src/
│   ├── controllers/
│   │   └── authController.js      # Lógica de autenticação
│   ├── db/
│   │   ├── config.js              # Configuração do PostgreSQL
│   │   └── migrations.js           # Criação de tabelas
│   ├── middleware/
│   │   └── auth.js                # Middleware de autenticação
│   ├── models/
│   │   └── User.js                # Modelo de usuário
│   ├── routes/
│   │   └── auth.js                # Rotas de autenticação
│   ├── services/
│   │   └── emailService.js        # Serviço de email
│   ├── utils/
│   │   └── generateTokens.js      # Geração de tokens JWT
│   └── server.js                  # Entrada principal
├── .env.example                   # Variáveis de exemplo
├── .gitignore                     # Arquivos ignorados
├── package.json                   # Dependências
└── README.md                      # Este arquivo
```

## 🧪 Testando com cURL

### Registrar usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "username": "usuario_teste",
    "password": "senha123",
    "passwordConfirm": "senha123"
  }'
```

### Fazer login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "senha123"
  }'
```

### Acessar perfil protegido
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI"
```

## 📧 Configurar Email (Gmail)

1. **Ative 2FA** na sua conta Google
2. **Gere uma App Password**: https://myaccount.google.com/apppasswords
3. **Use essa senha** no `.env` como `EMAIL_PASSWORD`

## 🐛 Troubleshooting

### Erro: "ECONNREFUSED" no PostgreSQL
- Verifique se PostgreSQL está rodando: `brew services list`
- Inicie se necessário: `brew services start postgresql`

### Erro: "connect ECONNREFUSED" no servidor
- Certifique-se que não há outra aplicação na porta 3000
- Mude a porta no `.env`

### Email não sendo enviado
- Verifique credenciais no `.env`
- Use App Password do Google (não a senha da conta)
- Verifique se está em ambiente de produção seguro

## 🤝 Contribuindo

1. Faça um Fork
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

**VidiPT89**
- GitHub: [@VidiPT89](https://github.com/VidiPT89)

## 📞 Suporte

Se tiver dúvidas ou encontrar problemas, abra uma issue no GitHub!

---

**Desenvolvido com ❤️ usando Node.js e PostgreSQL**
