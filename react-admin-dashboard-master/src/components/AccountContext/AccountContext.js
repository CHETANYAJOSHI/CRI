import React, { createContext, useState, useContext } from 'react';

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [selectedAccount, setSelectedAccount] = useState('');

  return (
    <AccountContext.Provider value={{ selectedAccount, setSelectedAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
