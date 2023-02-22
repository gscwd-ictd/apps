import React from 'react'

type CardArrayProps = {
  children: React.ReactChildren | React.ReactChild
  cols: number
  className?: string
}

export const CardArrayPreview = ({ children, className = '', cols }: CardArrayProps): JSX.Element => {
  return (
    <div className={`${className} grid grid-cols-${cols <= 2 ? cols : 2} gap-4 p-5 text-left`}>
      <>{children}</>
    </div>
  )
}
