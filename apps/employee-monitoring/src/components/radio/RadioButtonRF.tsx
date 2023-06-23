interface MyRadioBtnProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name?: string;
  className?: string;
  label: string;
  checked?: any;
  onChange?: any;
  onClick?: any;
  muted?: boolean;
  controller?: any;

  // isSelected: any;
  // changed: any;
}

export const RadioButtonRF: React.FC<MyRadioBtnProps> = ({
  id,
  name,
  label,
  muted,
  controller,
  ...props
}) => {
  return (
    <div className="w-full px-3 pt-3 pb-2 text-left">
      <div className={`col-span-1 flex items-center`}>
        <input
          id={id}
          {...controller}
          {...props}
          type="radio"
          disabled={muted}
          className="cursor-pointer checked:bg-blue-500 hover:bg-blue-50 checked:hover:bg-blue-600 focus:ring-transparent focus:checked:bg-blue-600"
        />
        <label
          id={id}
          htmlFor={id}
          className="px-1 -my-1 text-sm font-medium text-center text-gray-600 cursor-pointer select-none whitespace-nowrap"
        >
          {label}
        </label>
      </div>
    </div>
  );
};
