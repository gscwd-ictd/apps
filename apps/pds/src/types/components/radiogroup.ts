export interface MyRadioGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  groupName: string;
  className: string;
  muted?: boolean;
}
