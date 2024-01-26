import { createContextualCan } from '@casl/react';
import { createContext, ReactNode } from 'react';

type AuthAbilityProviderProps = {
  children: ReactNode | ReactNode[];
};

// initialize create context and assign it to AuthAbilityContext
export const AuthAbilityContext = createContext({});

// can
export const Can = createContextualCan(AuthAbilityContext.Consumer);

export const AuthAbilityProvider = ({ children }: AuthAbilityProviderProps) => {
  return (
    <>
      <AuthAbilityContext.Provider value={{}}></AuthAbilityContext.Provider>
    </>
  );
};
