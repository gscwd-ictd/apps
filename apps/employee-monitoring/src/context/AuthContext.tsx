import { createContext, ReactNode } from 'react';

type AuthProviderProps = {
  children: ReactNode | ReactNode[];
};

// initialize create context and assign it to AuthContext const
export const AuthContext = createContext({});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // define the user access here

  return (
    <>
      <AuthContext.Provider value={{}}></AuthContext.Provider>
    </>
  );
};
