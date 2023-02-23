import { MutableRefObject, useRef } from 'react'
import create from 'zustand'

export type ErrorState = {
    shake: boolean
    setShake: (shake: boolean) => void
    resAddrRef: MutableRefObject<any>
    permaAddrRef: MutableRefObject<any>
    resAddrError: boolean
    setResAddrError: (resAddrError: boolean) => void
    permaAddrError: boolean
    setPermaAddrError: (permaAddrError: boolean) => void
}

export const useErrorStore = create<ErrorState>((set) => ({
    shake: false,
    resAddrRef: useRef<any>(null),
    permaAddrRef: useRef<any>(null),
    resAddrError: false,
    permaAddrError: false,
    setShake: (shake: boolean) => {
        set((state) => ({ ...state, shake }))
    },
    setResAddrError: (resAddrError: boolean) => {
        set((state) => ({ ...state, resAddrError }))
    },
    setPermaAddrError: (permaAddrError: boolean) => {
        set((state) => ({ ...state, permaAddrError }))
    },
}))
