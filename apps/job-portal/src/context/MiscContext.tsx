import { createContext, useState } from 'react'
import { TabState } from './types/state'

type MiscProviderProps = {
  children: React.ReactNode | React.ReactNode[]
}

// create miscellaneous context and set {} as initial state
export const MiscContext = createContext({} as TabState)

// define miscellaneous provider
export const MiscProvider = ({ children }: MiscProviderProps) => {
  // selected tab state, initial value should be 1
  const [selectedTab, setSelectedTab] = useState<number>(1)
  const [isExistingApplicant, setIsExistingApplicant] = useState<boolean>(true)

  // handle previous tab
  const handlePrevTab = async (tab: number) => {
    if (tab > 0) {
      setSelectedTab(tab - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // handle next tab
  const handleNextTab = async (tab: number) => {
    if (tab <= 11) {
      setSelectedTab(tab + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <MiscContext.Provider
        value={{ selectedTab, isExistingApplicant, handleNextTab, handlePrevTab, setIsExistingApplicant, setSelectedTab }}
      >
        {children}
      </MiscContext.Provider>
    </>
  )
}
