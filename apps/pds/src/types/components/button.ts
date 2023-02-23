import React, { MutableRefObject, ReactNode } from 'react';
import { MyButtonComponentVariant, MyComponentSize } from './attributes';

export interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  btnLabel?: string;
  btnSize?: MyComponentSize;
  variant?: MyButtonComponentVariant;
  children?: ReactNode;
  fluid?: boolean;
  shadow?: boolean;
  height?: string;
  width?: string;
  muted?: boolean;
  innerRef?: MutableRefObject<HTMLButtonElement>;
}
