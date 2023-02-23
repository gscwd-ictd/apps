export const slAppVariant = {
  form: 'rounded-md border border-gray-200 pt-5 pb-5.5',
  modal: 'rounded-md border border-gray-50 bg-gray-50 pt-3 pb-3',
}

const background = {
  default: '',
  primary: 'bg-white',
  secondary: 'bg-green-50',
  warning: 'bg-orange-50',
  danger: 'bg-rose-50',
  light: 'bg-white',
  simple: 'bg-slate-100',
}

const border = {
  default: 'rounded-md border border-gray-200',
  primary: 'rounded-md border border-gray-200',
  secondary: 'rounded-md border border-emerald-700',
  warning: 'rounded-md border border-orange-600',
  danger: 'rounded-md border border-rose-600',
  light: 'rounded-md border border-indigo-200',
  simple: 'rounded-md border-0 ',
}

const focus = {
  default: 'focus:ring focus:border-gray-500 focus:ring-gray-100',
  primary: 'focus:ring focus:border-gray-700 focus:ring-indigo-100',
  secondary: 'focus:ring focus:border-emerald-600 focus:ring-green-100',
  warning: 'focus:ring focus:border-orange-500 focus:ring-orange-100',
  danger: 'focus:ring focus:border-rose-600 focus:ring-rose-100',
  light: 'focus:ring focus:border-indigo-600 focus:ring-indigo-100',
  simple: '',
}

const focusWithin = {
  default: 'focus-within:ring-1 focus-within:border focus-within:border-gray-500 focus-within:ring-gray-100',
  primary: 'focus-within:ring-1  focus-within:border focus-within:border-indigo-700 focus-within:ring-indigo-100',
  secondary: 'focus-within:ring-1 focus-within:border focus-within:border-emerald-600 focus-within:ring-green-100',
  warning: 'focus-within:ring-1 focus-within:border focus-within:border-orange-500 focus-within:ring-orange-100',
  danger: 'focus-within:ring-1 focus-within:border focus-within:border-rose-600 focus-within:ring-rose-100',
  light: 'focus-within:ring-1 focus-within:border focus-within:border-indigo-500 focus-within:ring-indigo-100',
  simple: '',
}

const size = {
  xs: 'px-4 py-1 text-xs font-light',
  sm: 'px-4 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-4 py-4 text-lg',
}

const shadowSize = {
  xs: 'shadow-xs',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
}

export type MyTextFieldComponentVariant = 'default' | 'primary' | 'secondary' | 'warning' | 'danger' | 'light' | 'simple'

type Item = {
  label: string
  value: any
}

type SelectListAppearance = 'form' | 'modal'

interface MySelectListProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  id?: any
  name: string
  className?: string
  selectList: Array<string>
  defaultOption: string
  listHeight?: string
  appearance: SelectListAppearance
  muted?: boolean
  variant?: MyTextFieldComponentVariant
  withShadow?: boolean
  isError?: boolean
  shadow?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const SelectList: React.FC<MySelectListProps> = ({
  id,
  name,
  selectList,
  className = '',
  appearance,
  variant = 'primary',
  defaultOption = '',
  isError = false,
  muted = false,
  withShadow = false,
  shadow = 'sm',
  ...props
}) => {
  let selected
  return (
    <>
      <select
        id={name}
        value={appearance === 'form' ? selected : undefined}
        disabled={muted}
        className={` ${muted ? 'cursor-not-allowed bg-slate-50' : ``} fluid w-full appearance-none   ${slAppVariant[appearance]}   cursor-pointer 
   ${isError ? background['danger'] : background[variant]}
        rounded-md py-[1.5rem] px-5 align-middle text-slate-600  ${
          shadowSize[shadow]
        } shadow-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        {...props}
      >
        <option value="" key="" hidden>
          Select {defaultOption}...
        </option>

        {selectList.map((item, idx) => (
          <option value={item} key={idx}>
            {item}
          </option>
        ))}
      </select>
    </>
  )
}
