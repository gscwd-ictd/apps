import { createContextualCan } from '@casl/react';
import { createContext, ReactNode, useContext } from 'react';
import { AuthContext } from '../AuthContext';

type AuthAbilityProviderProps = {
  children: ReactNode | ReactNode[];
};

// initialize create context and assign it to AuthAbilityContexxt
export const AuthAbilityContext = createContext({});

// can
export const Can = createContextualCan(AuthAbilityContext.Consumer);

export const AuthAbilityProvider = ({ children }: AuthAbilityProviderProps) => {
  // const {} = useContext(AuthContext)

  return (
    <>
      <AuthAbilityContext.Provider value={{}}></AuthAbilityContext.Provider>
    </>
  );
};
