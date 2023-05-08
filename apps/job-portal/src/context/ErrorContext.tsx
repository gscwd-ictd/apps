import { createContext, Dispatch, ReactChild, ReactChildren, SetStateAction, useRef, useState } from 'react'
import { ErrorState } from './types/state'

type ErrorProviderProps = {
  children: React.ReactNode | React.ReactNode[]
}

// export type ResErrorState = {
//   resAddrError: boolean
//   setResAddrError: Dispatch<SetStateAction<boolean>>
//   shake: boolean
//   setShake: Dispatch<SetStateAction<boolean>>
// }

// initialize create context and assign it to ErrorContext const
export const ErrorContext = createContext({} as ErrorState)

export const ErrorProvider = ({ children }: ErrorProviderProps) => {
  // initialize shake animation
  const [shake, setShake] = useState<boolean>(false)

  // initialize useRef and assign it to residential address ref
  const resAddrRef = useRef<any>(null)

  // initialize useRef and assign it to permanent address ref
  const permaAddrRef = useRef<any>(null)

  // set residential address error state (boolean)
  const [resAddrError, setResAddrError] = useState<boolean>(false)

  // set permanent address error state (boolean)
  const [permaAddrError, setPermaAddrError] = useState<boolean>(false)

  return (
    <>
      <ErrorContext.Provider
        value={{ resAddrError, setResAddrError, permaAddrError, setPermaAddrError, permaAddrRef, resAddrRef, shake, setShake }}
      >
        {children}
      </ErrorContext.Provider>
    </>
  )
}
