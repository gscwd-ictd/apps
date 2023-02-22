import { Dispatch, SetStateAction } from 'react'

export const handleNextPage = async (tabIndex: number, setState: Function) => {
  setState(tabIndex + 1)
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
