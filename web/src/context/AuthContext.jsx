import { createContext, useContext, useState, useCallback } from 'react';
import { BASE, encodeBasic, setStoredAuth, clearStoredAuth, getStoredAuth } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // El estado inicial se hidrata desde sessionStorage para que un refresh
  // dentro de la misma pestaña no fuerce un nuevo login.
  const [username, setUsername] = useState(() => sessionStorage.getItem('authUsername'));
  const isAuthenticated = !!username && !!getStoredAuth();

  const login = useCallback(async (user, password) => {
    const encoded = encodeBasic(user, password);
    // Validamos contra un endpoint protegido cualquiera; size=1 para que sea barato.
    const res = await fetch(`${BASE}/api/proyectos?page=0&size=1`, {
      headers: { Authorization: `Basic ${encoded}` },
    });
    if (res.status === 401 || res.status === 403) {
      const err = new Error('Usuario o contraseña incorrectos');
      err.status = res.status;
      throw err;
    }
    if (!res.ok) {
      throw new Error('No se pudo conectar con el servidor');
    }
    setStoredAuth(encoded);
    sessionStorage.setItem('authUsername', user);
    setUsername(user);
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    sessionStorage.removeItem('authUsername');
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider value={{ username, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
