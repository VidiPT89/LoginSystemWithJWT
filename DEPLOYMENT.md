# 🚀 Guia de Deployment - Vercel + Neon

Siga os passos abaixo para fazer o deploy do seu Login System JWT no Vercel com PostgreSQL no Neon.

---

## 📋 Pré-requisitos

- ✅ Conta no [Vercel](https://vercel.com/)
- ✅ Conta no [Neon](https://console.neon.tech/) (já tem!)
- ✅ Repositório GitHub com o código
- ✅ Node.js 18+ instalado localmente

---

## 🔧 Passo 1: Configurar o Neon Database

### 1.1 Obter a Connection String

1. Acesse seu projeto no [Neon Console](https://console.neon.tech/app/projects)
2. Clique no seu projeto
3. Vá para **Connection Details**
4. Copie a **Connection String** (algo como: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`)
5. Guarde este valor, vai precisar!

### 1.2 Criar as Tabelas no Neon

```bash
# Clone o repositório localmente (se ainda não tiver)
git clone https://github.com/seu-usuario/LoginSystemWithJWT.git
cd LoginSystemWithJWT

# Instale dependências
npm install

# Configure a variável de ambiente
export DATABASE_URL="sua_connection_string_do_neon_aqui"

# Execute as migrations
node scripts/migrate-neon.js
```

✅ As tabelas serão criadas no Neon automaticamente!

---

## 🎯 Passo 2: Deploy no Vercel

### 2.1 Conectar Repositório ao Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **Add New Project**
3. Selecione **Import Git Repository**
4. Cole o URL: `https://github.com/seu-usuario/LoginSystemWithJWT`
5. Clique em **Import**

### 2.2 Configurar Variáveis de Ambiente

Na página de deployment do Vercel, vá para **Environment Variables** e adicione:

```
DATABASE_URL = postgresql://user:password@host.neon.tech/dbname?sslmode=require
JWT_SECRET = sua_chave_jwt_super_secreta_mudar_em_producao
JWT_REFRESH_SECRET = sua_chave_refresh_super_secreta_mudar_em_producao
NODE_ENV = production
```

### 2.3 Deploy

1. Clique em **Deploy**
2. Espere 2-3 minutos
3. ✅ Seu site estará online!

---

## 🎉 Pronto!

Seu Login System JWT está live no Vercel! 

Você terá um URL como: `https://seu-projeto.vercel.app`

### Endpoints funcionam em:

```
https://seu-projeto.vercel.app/api/auth/register
https://seu-projeto.vercel.app/api/auth/login
https://seu-projeto.vercel.app/api/auth/profile
https://seu-projeto.vercel.app/api/auth/refresh-token
https://seu-projeto.vercel.app/api/auth/request-password-reset
https://seu-projeto.vercel.app/api/auth/reset-password
```

---

## 🧪 Testar o Deployment

```bash
# Registar um utilizador
curl -X POST https://seu-projeto.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","username":"testuser","password":"senha123","passwordConfirm":"senha123"}'

# Login
curl -X POST https://seu-projeto.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","password":"senha123"}'
```

---

## 🔐 Segurança - Checklist

- [ ] Mudar `JWT_SECRET` para um valor seguro
- [ ] Mudar `JWT_REFRESH_SECRET` para um valor seguro
- [ ] Usar HTTPS (Vercel faz isto automaticamente)
- [ ] Configurar CORS se necessário (ajustar na função de API)
- [ ] Testar endpoints em produção
- [ ] Monitorar erros no Vercel Dashboard

---

## 📊 Monitoramento

1. Acesse seu projeto no Vercel
2. Vá para **Deployments** para ver o histórico
3. Vá para **Functions** para ver logs das API calls
4. Vá para **Analytics** para ver estatísticas

---

## 🆘 Troubleshooting

### Erro: "DATABASE_URL not found"
→ Adicione a variável de ambiente no Vercel Environment Variables

### Erro: "Connection refused"
→ Verifique se a connection string do Neon está correta
→ Verifique se o Neon está online

### Erro: "Table already exists"
→ Isto é normal! A função `CREATE TABLE IF NOT EXISTS` evita duplicatas

### Erro: "CORS error"
→ Verifique os headers CORS nas funções API

---

## 📝 Próximos Passos

1. Implementar email de confirmação
2. Adicionar autenticação com Google/GitHub
3. Implementar 2FA (autenticação de dois fatores)
4. Adicionar dashboard administrativo
5. Configurar logs e monitoring

---

## 💬 Suporte

Qualquer dúvida, verifique:
- Documentação do Vercel: https://vercel.com/docs
- Documentação do Neon: https://neon.tech/docs
- Issues no GitHub do projeto

---

**Versão:** 1.0.0  
**Última atualização:** 2026-08-06  
**Autor:** David Arsénio Martins
