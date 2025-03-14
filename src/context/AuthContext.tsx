import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string, rememberMe: boolean) => void;
  logout: () => void;
  savedCredentials: {
    username: string;
    password: string;
  } | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  savedCredentials: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    return authStatus === 'true';
  });

  const [savedCredentials, setSavedCredentials] = useState<{ username: string; password: string; } | null>(() => {
    const saved = localStorage.getItem('savedCredentials');
    return saved ? JSON.parse(saved) : null;
  });
  
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true' && !isAuthenticated) {
      setIsAuthenticated(true);
    } else if (authStatus !== 'true' && isAuthenticated) {
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);
  
  const login = (username: string, password: string, rememberMe: boolean) => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);

    if (rememberMe) {
      const credentials = { username, password };
      localStorage.setItem('savedCredentials', JSON.stringify(credentials));
      setSavedCredentials(credentials);
    } else {
      localStorage.removeItem('savedCredentials');
      setSavedCredentials(null);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, savedCredentials }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
