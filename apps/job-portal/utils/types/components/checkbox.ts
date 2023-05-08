import React from 'react';

export interface MyCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  className?: string;
  label: string;
}
