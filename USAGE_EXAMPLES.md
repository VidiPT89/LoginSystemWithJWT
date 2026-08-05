# 📚 Complete Usage Examples

Este arquivo contém exemplos práticos e completos de como usar o Login System JWT em uma aplicação real.

---

## 🚀 Exemplo 1: Integração com React

```jsx
import { useState, useEffect } from 'react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Salvar tokens
      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirecionar para dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Carregando...' : 'Entrar'}
      </button>
    </form>
  );
}
```

---

## 🚀 Exemplo 2: Interceptador de Requisições (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador de requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptador de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/auth/refresh-token', { refreshToken });

        localStorage.setItem('accessToken', response.data.tokens.accessToken);
        localStorage.setItem('refreshToken', response.data.tokens.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${response.data.tokens.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

**Uso:**
```javascript
import api from './api';

// Requisição automática com autenticação
const user = await api.get('/auth/profile');
console.log(user.data);
```

---

## 🚀 Exemplo 3: Hook Personalizado (React)

```javascript
import { useState, useCallback } from 'react';

export function useAuth() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const register = useCallback(async (email, username, password) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, passwordConfirm: password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const getProfile = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const isAuthenticated = !!localStorage.getItem('accessToken');

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    getProfile,
    isAuthenticated,
  };
}
```

**Uso:**
```jsx
function App() {
  const { user, login, logout, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div>
        <p>Bem-vindo, {user.username}!</p>
        <button onClick={logout}>Sair</button>
      </div>
    );
  }

  return <LoginForm />;
}
```

---

## 🚀 Exemplo 4: Componente de Registro Completo (Vue.js)

```vue
<template>
  <form @submit.prevent="handleRegister" class="register-form">
    <div class="form-group">
      <label for="email">Email:</label>
      <input
        v-model="form.email"
        type="email"
        id="email"
        required
      />
    </div>

    <div class="form-group">
      <label for="username">Utilizador:</label>
      <input
        v-model="form.username"
        type="text"
        id="username"
        required
      />
    </div>

    <div class="form-group">
      <label for="password">Palavra-passe:</label>
      <input
        v-model="form.password"
        type="password"
        id="password"
        required
      />
    </div>

    <div class="form-group">
      <label for="password-confirm">Confirmar Palavra-passe:</label>
      <input
        v-model="form.passwordConfirm"
        type="password"
        id="password-confirm"
        required
      />
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <button type="submit" :disabled="loading">
      {{ loading ? 'A registar...' : 'Registar' }}
    </button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
        username: '',
        password: '',
        passwordConfirm: '',
      },
      loading: false,
      error: '',
    };
  },
  methods: {
    async handleRegister() {
      if (this.form.password !== this.form.passwordConfirm) {
        this.error = 'As palavras-passe não coincidem';
        return;
      }

      this.loading = true;
      this.error = '';

      try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);

        this.$router.push('/dashboard');
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #FF7A00;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  color: #d32f2f;
  margin-bottom: 1rem;
}
</style>
```

---

## 🚀 Exemplo 5: Serviço de Autenticação (Angular)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  register(email: string, username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      email,
      username,
      password,
      passwordConfirm: password,
    }).pipe(
      map(response => {
        if (response.tokens) {
          localStorage.setItem('accessToken', response.tokens.accessToken);
          localStorage.setItem('refreshToken', response.tokens.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
        return response;
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => {
        if (response.tokens) {
          localStorage.setItem('accessToken', response.tokens.accessToken);
          localStorage.setItem('refreshToken', response.tokens.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
        return response;
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}
```

---

## 🚀 Exemplo 6: Reset de Senha

```javascript
async function requestPasswordReset(email) {
  const response = await fetch('http://localhost:3000/api/auth/request-password-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Erro ao solicitar reset');
  }

  return await response.json();
}

async function resetPassword(token, newPassword) {
  const response = await fetch('http://localhost:3000/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      newPassword,
      passwordConfirm: newPassword,
    }),
  });

  if (!response.ok) {
    throw new Error('Erro ao resetar password');
  }

  return await response.json();
}

// Uso:
try {
  await requestPasswordReset('user@example.com');
  console.log('Email de reset enviado!');
} catch (err) {
  console.error(err.message);
}
```

---

## 🧪 Exemplo 7: Testes com Jest

```javascript
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

describe('Auth Service', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('deve registar um novo utilizador', async () => {
    const { register } = useAuth();

    const result = await register('test@example.com', 'testuser', 'Password123');

    expect(result.user).toBeDefined();
    expect(result.tokens.accessToken).toBeDefined();
    expect(localStorage.getItem('accessToken')).toBeTruthy();
  });

  test('deve fazer login com email e password', async () => {
    const { login } = useAuth();

    const result = await login('test@example.com', 'Password123');

    expect(result.user).toBeDefined();
    expect(localStorage.getItem('refreshToken')).toBeTruthy();
  });

  test('deve recuperar o perfil do utilizador', async () => {
    const { getProfile } = useAuth();

    // Simular login primeiro
    localStorage.setItem('accessToken', 'mock_token');

    const profile = await getProfile();

    expect(profile).toBeDefined();
    expect(profile.id).toBeDefined();
  });

  test('deve fazer logout corretamente', () => {
    const { logout } = useAuth();

    localStorage.setItem('accessToken', 'mock_token');
    logout();

    expect(localStorage.getItem('accessToken')).toBeNull();
  });
});
```

---

## 📱 Exemplo 8: App Mobile (React Native)

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';

async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    await AsyncStorage.setItem('accessToken', data.tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', data.tokens.refreshToken);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

async function getProfile() {
  const token = await AsyncStorage.getItem('accessToken');

  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  return await response.json();
}
```

---

## 💡 Boas Práticas

✅ **Sempre** use HTTPS em produção  
✅ **Guarde** os tokens em localStorage com segurança  
✅ **Implemente** refresh automático de tokens  
✅ **Valide** dados no frontend antes de enviar  
✅ **Trate** erros de forma user-friendly  
✅ **Use** ambiente variables para URLs da API  
✅ **Implemente** logout em caso de token expirado  
✅ **Proteja** rotas que requerem autenticação  

---

**Desenvolvido por David Arsénio Martins**  
🌐 [ividi.dev](https://ividi.dev/)  
💻 [GitHub](https://github.com/VidiPT89/)
