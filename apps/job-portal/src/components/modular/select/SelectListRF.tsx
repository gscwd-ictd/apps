import { MyTextFieldComponentVariant } from 'apps/job-portal/utils/types/components/attributes';

const slAppVariant = {
  form: 'border pt-5 pb-6 shadow shadow-slate-300',
  modal: 'border border-slate-300',
};

const background = {
  default: '',
  primary: 'bg-white',
  secondary: 'bg-green-50',
  warning: 'bg-orange-50',
  danger: 'bg-rose-50',
  light: 'bg-white',
  simple: 'bg-white',
};

const border = {
  default: 'rounded-md border border-gray-200',
  primary: 'rounded-md border border-gray-200',
  secondary: 'rounded-md border border-emerald-700',
  warning: 'rounded-md border border-orange-600',
  danger: 'rounded-md border-2 border-rose-600',
  light: 'rounded-md border border-gray-200',
  simple: 'rounded-md border border-gray-200 ',
};

const focus = {
  default: 'focus:ring focus:border-gray-500 focus:ring-gray-100',
  primary: 'focus:ring focus:border-gray-700 focus:ring-indigo-100',
  secondary: 'focus:ring focus:border-emerald-600 focus:ring-green-100',
  warning: 'focus:ring focus:border-orange-500 focus:ring-orange-100',
  danger: 'focus:ring focus:border-2 focus:border-rose-600 focus:ring-rose-100',
  light: 'focus:border-indigo-800 focus:ring-1 focus:ring-indigo-100',
  simple: 'focus:border-indigo-800 focus:ring-1 focus:ring-indigo-100',
};

const focusWithin = {
  default:
    'focus-within:ring-1 focus-within:border focus-within:border-gray-500 focus-within:ring-gray-100',
  primary:
    'focus-within:ring-1  focus-within:border focus-within:border-indigo-700 focus-within:ring-indigo-100',
  secondary:
    'focus-within:ring-1 focus-within:border focus-within:border-emerald-600 focus-within:ring-green-100',
  warning:
    'focus-within:ring-1 focus-within:border focus-within:border-orange-500 focus-within:ring-orange-100',
  danger:
    'focus-within:ring-1 focus-within:border focus-within:border-rose-600 focus-within:ring-rose-100',
  light:
    'focus-within:ring-0 focus-within:border focus-within:border-indigo-500 focus-within:ring-indigo-100',
  simple: 'focus-within:ring-0',
};

const size = {
  xs: 'px-4 py-1 text-xs font-light',
  sm: 'px-4 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-4 py-4 text-lg',
};

type Item = {
  label: string;
  value: any;
};

type SelectListAppearance = 'form' | 'modal';

interface MySelectListRFProps
  extends React.InputHTMLAttributes<HTMLSelectElement> {
  id: string;
  name?: string;
  className?: string;
  selectList: Array<any>;
  defaultOption: string;
  listHeight?: string;
  muted?: boolean;
  variant?: MyTextFieldComponentVariant;
  controller: any;
  appearance: SelectListAppearance;
  withLabel?: boolean;
  label?: string;
  withShadow?: boolean;
  labelIsRequired?: boolean;
  isError?: boolean;
  errorMessage?: any | unknown;
}

export const SelectListRF: React.FC<MySelectListRFProps> = ({
  id,
  controller,
  selectList,
  className = '',
  variant = 'primary',
  defaultOption = '',
  appearance = 'form',
  withLabel = false,
  label = '',
  withShadow = false,
  isError = false,
  labelIsRequired = false,
  errorMessage,
  muted = false,

  ...props
}) => {
  return (
    <>
      {withLabel ? (
        <label className="text-sm text-slate-600">
          {labelIsRequired ? <span className="text-red-700">*</span> : null}
          {label}
        </label>
      ) : null}

      <select
        id={id}
        {...controller}
        disabled={muted}
        className={`${
          muted ? 'cursor-not-allowed bg-slate-100' : `${background[variant]}`
        } fluid w-full cursor-pointer  appearance-none  ${
          slAppVariant[appearance]
        } cursor-pointer ${
          appearance === 'form'
            ? 'rounded-md border px-4 focus:border '
            : 'rounded-xl border'
        } ${isError ? border['danger'] : border[variant]} 
        ${isError ? background['danger'] : background[variant]}
        ${isError ? focus['danger'] : focus[variant]}
              ${isError ? focusWithin['danger'] : focusWithin[variant]}
                

       pb-2 
       text-slate-600   ${className}`}
        {...props}
      >
        <option value="" key="" hidden>
          Select {defaultOption}...
        </option>
        {selectList.map((item: Item, idx: number) => (
          <option value={item.value} key={idx}>
            {item.label}
          </option>
        ))}
      </select>
      {errorMessage && (
        <span className="text-xs text-red-600">{errorMessage}</span>
      )}
    </>
  );
};
