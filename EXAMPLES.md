/**
 * 📝 Exemplos de Uso da API
 * 
 * Este arquivo mostra como usar a API de Login com JWT
 * em uma aplicação frontend (React, Vue, etc)
 */

// ============================================
// 1. REGISTRAR NOVO USUÁRIO
// ============================================
async function register(email, username, password) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        username,
        password,
        passwordConfirm: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    // Salvar tokens no localStorage
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);

    console.log('✅ Usuário registrado:', data.user);
    return data;
  } catch (error) {
    console.error('❌ Erro no registro:', error.message);
    throw error;
  }
}

// ============================================
// 2. FAZER LOGIN
// ============================================
async function login(email, password) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    // Salvar tokens
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));

    console.log('✅ Login realizado:', data.user);
    return data;
  } catch (error) {
    console.error('❌ Erro no login:', error.message);
    throw error;
  }
}

// ============================================
// 3. RENOVAR ACCESS TOKEN
// ============================================
async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }

    const response = await fetch('http://localhost:3000/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    // Salvar novo token
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);

    console.log('✅ Token renovado');
    return data.tokens;
  } catch (error) {
    console.error('❌ Erro ao renovar token:', error.message);
    logout(); // Fazer logout se falhar
    throw error;
  }
}

// ============================================
// 4. OBTER PERFIL DO USUÁRIO (PROTEGIDO)
// ============================================
async function getProfile() {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      throw new Error('Token de acesso não encontrado');
    }

    const response = await fetch('http://localhost:3000/api/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Se token expirou, tentar renovar
      if (response.status === 401 && data.error.includes('expirado')) {
        const newTokens = await refreshAccessToken();
        return getProfile(); // Tentar novamente com novo token
      }
      throw new Error(data.error);
    }

    console.log('✅ Perfil carregado:', data.user);
    return data.user;
  } catch (error) {
    console.error('❌ Erro ao obter perfil:', error.message);
    throw error;
  }
}

// ============================================
// 5. SOLICITAR RESET DE SENHA
// ============================================
async function requestPasswordReset(email) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/request-password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    console.log('✅ Email de reset enviado');
    return data;
  } catch (error) {
    console.error('❌ Erro ao solicitar reset:', error.message);
    throw error;
  }
}

// ============================================
// 6. RESETAR SENHA
// ============================================
async function resetPassword(token, newPassword) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        newPassword,
        passwordConfirm: newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    console.log('✅ Senha resetada com sucesso');
    return data;
  } catch (error) {
    console.error('❌ Erro ao resetar senha:', error.message);
    throw error;
  }
}

// ============================================
// 7. FAZER LOGOUT
// ============================================
function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  console.log('✅ Logout realizado');
}

// ============================================
// 8. INTERCEPTADOR PARA REQUISIÇÕES
// ============================================
async function fetchWithAuth(url, options = {}) {
  let accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    throw new Error('Não autenticado');
  }

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  // Se token expirou
  if (response.status === 401) {
    try {
      const tokens = await refreshAccessToken();
      accessToken = tokens.accessToken;

      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      logout();
      throw error;
    }
  }

  return response;
}

// ============================================
// 9. VERIFICAR SE ESTÁ AUTENTICADO
// ============================================
function isAuthenticated() {
  const accessToken = localStorage.getItem('accessToken');
  return !!accessToken;
}

// ============================================
// 10. OBTER USUÁRIO ATUAL
// ============================================
function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// ============================================
// EXEMPLO DE USO EM UMA APLICAÇÃO
// ============================================

/*
// Registrar
try {
  await register('usuario@exemplo.com', 'usuario', 'senha123');
} catch (error) {
  console.error('Erro ao registrar');
}

// Login
try {
  const loginData = await login('usuario@exemplo.com', 'senha123');
  console.log('Bem-vindo,', loginData.user.username);
} catch (error) {
  console.error('Email ou senha incorretos');
}

// Obter dados protegidos
if (isAuthenticated()) {
  try {
    const user = await getProfile();
    console.log('Dados do usuário:', user);
  } catch (error) {
    console.error('Erro ao obter dados');
  }
}

// Fazer logout
logout();

// Fazer requisição com autenticação automática
try {
  const response = await fetchWithAuth('http://localhost:3000/api/auth/profile');
  const data = await response.json();
  console.log('Dados:', data);
} catch (error) {
  console.error('Erro na requisição autenticada');
}

// Resetar senha
try {
  await requestPasswordReset('usuario@exemplo.com');
  console.log('Verifique seu email!');
} catch (error) {
  console.error('Erro ao solicitar reset');
}
*/

// Exportar funções
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    register,
    login,
    refreshAccessToken,
    getProfile,
    requestPasswordReset,
    resetPassword,
    logout,
    fetchWithAuth,
    isAuthenticated,
    getCurrentUser,
  };
}
