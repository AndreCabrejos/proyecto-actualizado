// src/context/UserContext.js
import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [saldo, setSaldo] = useState(0); // saldo inicial simulado

  return (
    <UserContext.Provider value={{ saldo, setSaldo }}>
      {children}
    </UserContext.Provider>
  );
};
