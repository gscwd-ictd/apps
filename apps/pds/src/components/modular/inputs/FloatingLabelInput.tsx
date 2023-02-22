import { MyFloatingLabelTextFieldProps } from "../../../types/components/textfield"

const FloatingLabelInput: React.FC<MyFloatingLabelTextFieldProps> = ({
  id,
  name,
  type,
  innerRef,
  placeholder,
  className = '',
  variant = 'primary',
  fluid = true,
  muted = false,
  ...props
}) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative">
        <input
          {...props}
          id={id}
          tabIndex={muted ? -1 : 0}
          type="text"
          className="py-1 transition-colors border-b select-none peer focus:border-b-2 focus:border-indigo-700 focus:outline-none"
          autoComplete="off"
        />
        <label htmlFor={id} className="absolute left-0 transition-all top-1 cursor-text peer-focus:-top-4 peer-focus:text-xs">
          {placeholder}
        </label>
      </div>
    </div>
  )
}
