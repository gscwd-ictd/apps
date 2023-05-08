import React from 'react'
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

interface NodeProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  isDone?: boolean
  nodeText: string
}

export const NodeCircle: React.FC<NodeProps> = ({ isDone = true, nodeText, ...props }) => {
  return (
    <button
      {...props}
      tabIndex={-1}
      className={`z-20 -mx-2 h-8 w-8 shrink-0 select-none 
    rounded-full 
    ${isDone ? 'bg-slate-600' : 'bg-white'}
      hover:cursor-default`}
    >
      <span className={`flex select-none flex-row justify-center text-xs ${isDone ? 'text-white' : 'text-slate-700'}`}>{nodeText}</span>
    </button>
  )
}
