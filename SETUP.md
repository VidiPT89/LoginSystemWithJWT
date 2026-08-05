# 🚀 GUIA DE CONFIGURAÇÃO - Login System JWT

## ⚡ Resumo Rápido

Você tem um sistema de login completo com JWT pronto para uso! Siga os passos abaixo para colocá-lo em funcionamento.

---

## 1️⃣ Pré-requisitos

Certifique-se de ter instalado:
- ✅ **Node.js** (v14+) - [Download](https://nodejs.org/)
- ✅ **PostgreSQL** (v12+) - [Download](https://www.postgresql.org/download/)
- ✅ **npm** ou **yarn** (incluso com Node.js)

### Verificar Instalação

```bash
node --version      # v14+
npm --version       # 8+
psql --version      # 12+
```

---

## 2️⃣ Configurar PostgreSQL

### macOS (Homebrew)

```bash
# Instalar PostgreSQL
brew install postgresql

# Iniciar serviço
brew services start postgresql

# Conectar ao PostgreSQL
psql -U postgres
```

### Windows

1. Abra o SQL Shell (psql)
2. Pressione Enter para usar defaults
3. Digite sua senha de master

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib

# Iniciar serviço
sudo service postgresql start

# Conectar
sudo -u postgres psql
```

### Criar Banco de Dados

```sql
-- No psql, execute:
CREATE DATABASE login_system;

-- Saia
\q
```

---

## 3️⃣ Configurar Variáveis de Ambiente

O arquivo `.env` já foi criado com valores padrão. Se necessário, edite:

```bash
# Abrir arquivo
nano .env
```

Configurações importantes:

```env
# Database
DB_HOST=localhost          # Seu host PostgreSQL
DB_PORT=5432             # Porta padrão PostgreSQL
DB_NAME=login_system     # Nome do banco criado
DB_USER=postgres         # Seu usuário PostgreSQL
DB_PASSWORD=postgres     # Sua senha PostgreSQL

# JWT - MUDE ISSO EM PRODUÇÃO!
JWT_SECRET=sua_chave_super_secreta
JWT_REFRESH_SECRET=sua_chave_refresh_secreta
```

### Para Email (Optional)

Se quer testar reset de senha:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_app_password  # Gere em: https://myaccount.google.com/apppasswords
```

---

## 4️⃣ Executar Migrations

Cria a tabela de usuários automaticamente:

```bash
npm run migrate
```

Esperado:
```
✅ Tabela de usuários criada com sucesso!
```

---

## 5️⃣ Iniciar o Servidor

### Modo Desenvolvimento (com auto-reload)

```bash
npm run dev
```

### Modo Produção

```bash
npm start
```

Você deve ver:

```
╔════════════════════════════════════════╗
║     🔐 LOGIN SYSTEM COM JWT 🔐        ║
║          Servidor iniciado!            ║
╚════════════════════════════════════════╝

📍 URL: http://localhost:3000
🗄️  Banco de dados: PostgreSQL
🔑 JWT Ativo
📧 Email Service: gmail
🌍 Ambiente: development

⚡ Servidor pronto para receber requisições!
```

---

## 6️⃣ Testar a API

### Com cURL (Terminal)

#### Registrar usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu_email@exemplo.com",
    "username": "seu_usuario",
    "password": "senha123",
    "passwordConfirm": "senha123"
  }'
```

#### Fazer login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu_email@exemplo.com",
    "password": "senha123"
  }'
```

#### Obter Perfil (use o accessToken do login)

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI"
```

### Com Postman

1. Abra [Postman](https://www.postman.com/downloads/)
2. Crie uma nova requisição
3. Use os exemplos em `CURL_EXAMPLES.txt`
4. Ou importe a collection JSON

### Com VS Code

Use a extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

```bash
# Instalar
code --install-extension humao.rest-client
```

Crie arquivo `test.http`:
```http
### Registrar
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "teste@exemplo.com",
  "username": "teste_user",
  "password": "senha123",
  "passwordConfirm": "senha123"
}

### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "teste@exemplo.com",
  "password": "senha123"
}
```

Clique em "Send" acima de cada requisição!

---

## 7️⃣ Integrar em uma Aplicação Frontend

Veja arquivo `EXAMPLES.md` para:
- ✅ Função `register()`
- ✅ Função `login()`
- ✅ Função `getProfile()`
- ✅ Função `refreshAccessToken()`
- ✅ Interceptador automático `fetchWithAuth()`

Copie e cole as funções no seu projeto!

---

## 🐛 Troubleshooting

### Erro: "ECONNREFUSED" - Banco de dados não conecta

```bash
# Verificar se PostgreSQL está rodando
brew services list

# Iniciar PostgreSQL
brew services start postgresql

# Ou conectar manualmente
psql -U postgres
```

### Erro: "database does not exist"

```bash
# No psql:
CREATE DATABASE login_system;
```

### Erro: "Port 3000 already in use"

```bash
# Mudar porta no .env
PORT=3001

# Ou matar processo que usa a porta
lsof -i :3000
kill -9 <PID>
```

### Email não está sendo enviado

1. Certifique-se que tem App Password do Google
2. Verifique credenciais no `.env`
3. Teste com:
```bash
npm install -g nodemailer-cli
nodemailer-cli send --to seu_email@gmail.com
```

### Erro de validação JWT

- Access Token expirou? Use refresh token
- Refresh Token expirou? Faça login novamente
- Formato errado? Use `Authorization: Bearer TOKEN`

---

## 📚 Documentação Completa

- **README.md** - Documentação completa
- **EXAMPLES.md** - Exemplos de código JavaScript
- **CURL_EXAMPLES.txt** - Exemplos de cURL e Postman

---

## 🔐 Segurança em Produção

Antes de colocar em produção:

```bash
# 1. Gerar chaves fortes
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Usar HTTPS
# 3. Definir NODE_ENV=production
# 4. Usar Rate Limiting
# 5. Configurar CORS corretamente
# 6. Usar variáveis de ambiente seguras
# 7. Fazer backup regular do PostgreSQL
```

---

## ✅ Checklist de Implementação

- [ ] PostgreSQL instalado e rodando
- [ ] Banco de dados `login_system` criado
- [ ] `.env` configurado corretamente
- [ ] `npm install` executado
- [ ] `npm run migrate` executado com sucesso
- [ ] `npm run dev` iniciado
- [ ] Teste de registro funcionando
- [ ] Teste de login funcionando
- [ ] Teste de perfil protegido funcionando
- [ ] Tokens sendo renovados corretamente

---

## 🎯 Próximas Etapas

1. **Criar Frontend** com React/Vue/Angular
2. **Integrar com API** usando exemplos em `EXAMPLES.md`
3. **Adicionar 2FA** (Two Factor Authentication)
4. **Implementar Rate Limiting** com `express-rate-limit`
5. **Configurar CI/CD** com GitHub Actions
6. **Fazer Deploy** no Heroku/Vercel/AWS

---

## 💬 Suporte

- 📖 Veja documentação em README.md
- 🔍 Procure por erros em CURL_EXAMPLES.txt
- 💻 Veja exemplos de código em EXAMPLES.md
- 🐛 Confira a seção Troubleshooting acima

---

**Desenvolvido com ❤️ usando Node.js, Express e PostgreSQL**

Bom desenvolvimento! 🚀
