import { MyTextFieldComponentVariant } from '../../../types/components/attributes'

const slAppVariant = {
  form: 'border pt-5 pb-6 shadow shadow-slate-300',
  modal: 'pt-3 pb-3',
}

const background = {
  default: '',
  primary: 'bg-white',
  secondary: 'bg-green-50',
  warning: 'bg-orange-50',
  danger: 'bg-transparent',
  light: 'bg-white',
  simple: 'bg-gray-50',
}

const shadowSize = {
  none: 'shadow-none',
  xs: 'shadow-xs',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
}


const border = {
  default: 'rounded-xl border border-gray-200',
  primary: 'rounded-xl border border-gray-200',
  secondary: 'rounded-xl border border-emerald-700',
  warning: 'rounded-xl border border-orange-600',
  danger: 'rounded-xl border border-rose-600',
  light: 'rounded-xl border border-gray-200',
  simple: 'rounded-xl border border-gray-100 ',
}

const focus = {
  default: 'focus:ring focus:border-gray-500 focus:ring-gray-100',
  primary: 'focus:ring focus:border-gray-700 focus:ring-indigo-100',
  secondary: 'focus:ring focus:border-emerald-600 focus:ring-green-100',
  warning: 'focus:ring focus:border-orange-500 focus:ring-orange-100',
  danger: 'focus:ring focus:border focus:border-rose-600 focus:ring-rose-100',
  light: 'focus:border-indigo-700 focus:ring-1 focus:ring-indigo-100',
  simple: 'focus:border-indigo-700 focus:ring-1 focus:ring-indigo-100',
}

const focusWithin = {
  default: 'focus-within:ring-1 focus-within:border focus-within:border-gray-500 focus-within:ring-gray-100',
  primary: 'focus-within:ring-1  focus-within:border focus-within:border-indigo-700 focus-within:ring-indigo-100',
  secondary: 'focus-within:ring-1 focus-within:border focus-within:border-emerald-600 focus-within:ring-green-100',
  warning: 'focus-within:ring-1 focus-within:border focus-within:border-orange-500 focus-within:ring-orange-100',
  danger: 'focus-within:ring-1 focus-within:border focus-within:border-rose-600 focus-within:ring-rose-100',
  light: 'focus-within:ring-0 focus-within:border focus-within:border-indigo-500 focus-within:ring-indigo-100',
  simple: 'focus-within:ring-0',
}

const size = {
  xs: 'px-4 py-1 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-4 py-4 text-lg',
}

type Item = {
  label: string
  value: any
}

type SelectListAppearance = 'form' | 'modal'

interface MySelectListRFProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  id: string
  name?: string
  className?: string
  selectList: Array<any>
  defaultOption: string
  // innerRef?: MutableRefObject<any>
  shadow?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  listHeight?: string
  muted?: boolean
  variant?: MyTextFieldComponentVariant
  controller: any
  labelIsRequired?: boolean
  isError?: boolean
  errorMessage?: string
  isRequired?: boolean
}

export const SelectListRFFL: React.FC<MySelectListRFProps> = ({
  id,
  controller,
  errorMessage,
  selectList,
  className = '',
  variant = 'primary',
  defaultOption,
  // innerRef,
  placeholder = defaultOption,
  shadow = 'none',
  isError = false,
  labelIsRequired = false,
  muted = false,
  isRequired = false,

  ...props
}) => {
  return (
    <>
      <div
        className={`${className} ${muted ? `cursor-not-allowed focus-within:ring-0` : ``} 

        ${props.hidden ? 'hidden' : ''} transition-all`}
      >
        <div className="relative">
          <select
            id={id}
            {...controller}
            // ref={innerRef}
            // placeholder={defaultOption}
            disabled={muted}
            className={`${muted && 'cursor-not-allowed'
              } w-full cursor-pointer appearance-none px-[1.12rem] pt-4 pb-4  font-normal text-gray-600 shadow shadow-slate-300 
            ${isError ? background['danger'] : background[variant]} ${isError ? focusWithin['danger'] : focusWithin[variant]} ${isError ? border['danger'] : border[variant]
              } ${isError ? focus['danger'] : focus[variant]} ${shadow ? shadowSize[shadow] : 'shadow-none'}
                   

        align-middle font-normal 
       text-slate-600   ${className}`}
            {...props}
          >
            <option className="italic" value="" key="">
              Select {defaultOption}...
            </option>
            {selectList.map((item: Item, idx: number) => (
              <option value={item.value} key={idx}>
                {item.label}
              </option>
            ))}
          </select>
          <label
            htmlFor={id}
            className={`peer-focus:-pt-1 absolute -top-6 left-0 mx-4  mt-4 h-fit
          cursor-text -pt-1  px-1 text-xs font-normal text-gray-700 transition-all peer-placeholder-shown:-inset-y-[0.85rem] peer-placeholder-shown:left-0 peer-placeholder-shown:text-base  ${muted ? 'peer-placeholder-shown:text-gray-400' : 'peer-placeholder-shown:text-gray-600'
              } peer-placeholder-shown:px-1 peer-focus:-top-11 peer-focus:left-0 peer-focus:h-fit  peer-focus:px-1 bg-white peer-focus:bg-white
               peer-focus:text-xs peer-focus:text-indigo-900`}

          //absolute -top-6 left-0 mx-4  mt-4 h-fit

          //   peer-focus:font-sm peer-focus:-pt-1 absolute -top-11 left-0  mt-4 h-fit
          // cursor-text  text-xs font-normal text-gray-700 transition-all peer-placeholder-shown:-inset-y-[0.85rem] peer-placeholder-shown:left-0 peer-placeholder-shown:text-base  ${muted ? 'peer-placeholder-shown:text-gray-400' : 'peer-placeholder-shown:text-gray-600'
          // } peer-focus:-top-11 peer-focus:left-0  peer-focus:h-fit ${isError ? `rounded-xl peer-focus:bg-white ${background['danger']}  ` : `bg-white peer-focus:bg-white`
          // } peer-focus:text-xs peer-focus:text-gray-400
          >
            {placeholder}
            {isRequired ? (
              <>
                <span className="text-red-700">*</span>
              </>
            ) : (
              ''
            )}
          </label>
        </div>
        {errorMessage && <span className="text-xs text-red-500">{errorMessage}</span>}
      </div>
    </>
  )
}
