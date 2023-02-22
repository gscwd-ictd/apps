import React from 'react';
import { createContext, Dispatch, MutableRefObject, SetStateAction, useRef, useState } from 'react';

type RefErrorProviderProps = {
  children: React.ReactNode | React.ReactNode[];
};

export type RefErrorState = {
  refError: boolean;
  setRefError: Dispatch<SetStateAction<boolean>>;
  refRef: MutableRefObject<any>;
  shake: boolean;
  setShake: Dispatch<SetStateAction<boolean>>;
  offRelError: boolean;
  setOffRelError: Dispatch<SetStateAction<boolean>>;
};

// initialize create context and assign it to RefErrorContext
export const RefErrorContext = createContext({} as RefErrorState);

export const RefErrorProvider = ({ children }: RefErrorProviderProps): JSX.Element => {
  // set shake animation state
  const [shake, setShake] = useState<boolean>(false);

  // set references error state (boolean)
  const [refError, setRefError] = useState<boolean>(false);

  // set office relationship error
  const [offRelError, setOffRelError] = useState<boolean>(false);

  // initialize useref and assign it to references ref const
  const refRef = useRef(null);

  return (
    <>
      <RefErrorContext.Provider value={{ refError, refRef, shake, offRelError, setOffRelError, setShake, setRefError }}>
        {children}
      </RefErrorContext.Provider>
    </>
  );
};
