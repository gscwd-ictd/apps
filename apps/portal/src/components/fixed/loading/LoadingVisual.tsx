import { ReactNode } from 'react'

type LoadingIndicatorProps = {
    children?: ReactNode
    size?: number
}

const LoadingVisual = ({ children, size = 12 }: LoadingIndicatorProps) => {
    return (
        <>
            <div
                style={{ borderTopColor: 'transparent' }}
                className={`justify-center w-${size} h-${size} col-span-1 animate-spin rounded-full border border-solid border-indigo-800 text-center`}
            >
                {children}
            </div>
        </>
    )
}

export default LoadingVisual
