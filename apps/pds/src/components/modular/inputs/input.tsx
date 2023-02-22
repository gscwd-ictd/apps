import { useController } from 'react-hook-form'
import { border, focus, background, size, focusWithin } from '../../../classes/textfield'
import { MyInputFormProps } from '../../../types/components/input'

const Input: React.FC<MyInputFormProps> = ({
  id,
  name,
  label,
  className = '',
  type,
  fluid = true,
  muted = false,
  variant = 'simple',
  inputSize = 'md',
  rules,

  control,

  ...props
}): JSX.Element => {
  const { field } = useController({ control, name, defaultValue: '', rules })

  return (
    <>
      <label className="flex px-4 font-normal text-gray-600" htmlFor={id}>
        {label}
      </label>
      <input
        {...props}
        {...field}
        tabIndex={muted ? -1 : 0}
        id={id}
        type={type}
        readOnly={muted}
        className={`${className} ${fluid ? 'w-full' : ''} ${border[variant]} ${focus[variant]} ${focusWithin[variant]}  ${muted ? `cursor-not-allowed bg-slate-100 focus:border-slate-200 focus:ring-0` : `${background[variant]}`
          } ${size[inputSize]} text-gray-900 placeholder-gray-400 transition-colors focus:outline-none`}
      ></input>
    </>
  )
}

export default Input
