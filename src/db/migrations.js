const pool = require('./config');

async function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
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

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  `;

  try {
    await pool.query(query);
    console.log('✅ Tabela de usuários criada com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar tabela:', error.message);
  }
}

// Executar migrations
if (require.main === module) {
  createUsersTable().then(() => {
    pool.end();
    process.exit(0);
  });
}

module.exports = createUsersTable;
