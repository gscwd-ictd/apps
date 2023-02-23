export interface MyRadioBtnProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // name: string;
  className?: string
  id: string
  value: string
  label: string
  checked?: any
  onChange: any
  muted?: boolean
  // isSelected: any;
  // changed: any;
}
