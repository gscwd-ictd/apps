import { MutableRefObject, useRef } from 'react'
import { active, background, hover, shadowColor, size, textColor, focus } from '../../../classes/button'
import { MyButtonProps } from '../../../types/components/button'

export const Button = ({
  className = '',
  muted = false,
  btnLabel,
  btnSize = 'md',
  variant = 'primary',
  children,
  fluid = true,
  shadow = false,
  innerRef = useRef(null) as unknown as MutableRefObject<HTMLButtonElement>,
  ...props
}: MyButtonProps) => {
  return (
    <>
      <button
        {...props}
        ref={innerRef}
        disabled={muted}
        className={`${muted ? 'cursor-not-allowed ' : `${background[variant]} `}
        ${className} whitespace-nowrap ${fluid ? 'w-full' : ''} ${background[variant]} ${size[btnSize]} ${focus[variant]} ${hover[variant]} ${textColor[variant]
          } ${active[variant]} ${shadow && `shadow-md ${shadowColor[variant]}`} rounded-md focus:outline-none ${muted ? `` : `hover:scale-105 hover:transition-all`
          }`}
      >
        {children}
        <p className="flex justify-center font-medium select-none">{btnLabel}</p>
      </button>
    </>
  )
}
