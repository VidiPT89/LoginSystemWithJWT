# 🔧 GUIA DE SETUP DO PostgreSQL

Erro resolvido: `role "postgres" does not exist`

## ✅ O que foi feito

### 1. Criado o utilizador `postgres`
```sql
CREATE USER postgres WITH PASSWORD 'postgres' CREATEDB SUPERUSER;
```

### 2. Criada a base de dados `login_system`
```sql
CREATE DATABASE login_system OWNER postgres;
```

### 3. Dadas as permissões necessárias
```sql
GRANT ALL PRIVILEGES ON DATABASE login_system TO postgres;
```

### 4. Criadas as tabelas (migrations)
```bash
npm run migrate
```

---

## 🚀 Como usar agora

### Iniciar o servidor em desenvolvimento:
```bash
npm run dev
```

O servidor estará disponível em: `http://localhost:3000`

### Testar a API:
```bash
curl http://localhost:3000/api/health
```

Resposta esperada:
```json
{"status":"✅ Servidor está rodando!"}
```

---

## 🔍 Troubleshooting

### Problema: "Porta 3000 já está em uso"
```bash
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Problema: "connection to server on socket failed"
PostgreSQL pode não estar rodando. Inicia com:
```bash
brew services start postgresql
```

### Problema: "database does not exist"
Verifica o arquivo `.env` e garante que `DB_NAME=login_system`

### Problema: Quer resetar tudo
```bash
# Apagar a base de dados
psql -d postgres -U postgres -c "DROP DATABASE login_system;"

# Recriar
psql -d postgres -U postgres -c "CREATE DATABASE login_system OWNER postgres;"

# Executar migrations novamente
npm run migrate
```

---

## 📋 Credenciais

| Variável | Valor |
|----------|-------|
| DB_HOST | localhost |
| DB_PORT | 5432 |
| DB_NAME | login_system |
| DB_USER | postgres |
| DB_PASSWORD | postgres |

---

## ✨ Tudo funcionando!

Agora o servidor está pronto. Próximos passos:

1. **Abrir a interface UI:**
   - Abra `index.html` no navegador

2. **Testar endpoints:**
   - Use os exemplos em `USAGE_EXAMPLES.md`
   - Ou use Postman/Insomnia

3. **Configurar variáveis de produção:**
   - Muda as credenciais no `.env`
   - Especialmente `JWT_SECRET` e email

---

Desenvolvido por David Arsénio Martins  
🌐 https://ividi.dev/  
💻 https://github.com/VidiPT89/
