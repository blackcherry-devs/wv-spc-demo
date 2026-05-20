import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const DEMO_CREDENTIALS = [
  {
    username: "admin@vw.com",
    password: "PasswordAdmin123",
    role: "ADMIN",
    name: "Ing. Alejandro Silva (Quality Manager)",
  },
  {
    username: "op12@vw.com",
    password: "PasswordOp123",
    role: "OPERATOR",
    name: "Juan Pérez (Línea ZKG - Turno A)",
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('vw_demo_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('vw_demo_user'));
  
  // Memory state for captured data
  const [capturedData, setCapturedData] = useState([]);

  const login = (username, password) => {
    const foundUser = DEMO_CREDENTIALS.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const userInfo = { username: foundUser.username, role: foundUser.role, name: foundUser.name };
      setUser(userInfo);
      setIsAuthenticated(true);
      localStorage.setItem('vw_demo_user', JSON.stringify(userInfo));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vw_demo_user');
    // We intentionally keep capturedData in memory across logins to simulate a persistent database for the demo.
  };

  const addCapture = (data) => {
    setCapturedData(prev => [...prev, data]);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, capturedData, addCapture }}>
      {children}
    </AuthContext.Provider>
  );
};
