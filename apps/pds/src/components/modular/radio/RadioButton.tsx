interface MyRadioBtnProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // name: string;
  className?: string
  id: string
  value: any
  label: string
  checked?: any
  onChange?: any
  onClick?: any
  muted?: boolean

  // isSelected: any;
  // changed: any;
}

const RadioButton: React.FC<MyRadioBtnProps> = ({ id, name, value, label, muted, ...props }) => {
  return (
    <div className="w-full px-3 pt-3 pb-2 text-left">
      <div className={`col-span-1 flex `}>
        <input
          id={id}
          {...props}
          type="radio"
          name={name}
          disabled={muted}
          value={value}
          className="cursor-pointer checked:bg-indigo-500 hover:bg-indigo-50 checked:hover:bg-indigo-600 focus:ring-transparent focus:checked:bg-indigo-600"
        />
        <label id={name} htmlFor={id} className="px-1 -my-1 text-center cursor-pointer select-none text-md whitespace-nowrap">
          {label}
        </label>
      </div>
    </div>
  )
}

export default RadioButton
