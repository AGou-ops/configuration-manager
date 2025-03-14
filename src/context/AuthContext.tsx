import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage on component mount
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    return authStatus === 'true';
  });
  
  // This ensures the auth state is synchronized with localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true' && !isAuthenticated) {
      setIsAuthenticated(true);
    } else if (authStatus !== 'true' && isAuthenticated) {
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);
  
  const login = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };
  
  // Log the current authentication state for debugging
  console.log('Auth state:', isAuthenticated);
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
