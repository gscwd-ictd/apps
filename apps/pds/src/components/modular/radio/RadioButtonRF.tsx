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

export const RadioButtonRF: React.FC<MyRadioBtnProps> = ({ id, name, label, muted, controller, ...props }) => {
  return (
    <div className="w-full  px-3 pt-3 pb-2 text-left">
      <div className={`col-span-1 flex `}>
        <input
          id={id}
          {...controller}
          {...props}
          type="radio"
          disabled={muted}
          className={`cursor-pointer ${
            muted
              ? 'cursor-not-allowed checked:bg-indigo-200 checked:hover:bg-indigo-200 focus:ring-transparent focus:checked:bg-indigo-300'
              : 'checked:bg-indigo-500 hover:bg-indigo-50 checked:hover:bg-indigo-600 focus:ring-transparent focus:checked:bg-indigo-600'
          } `}
        />
        <label
          id={id}
          htmlFor={id}
          className={`-my-1 px-1 text-center  ${
            muted ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-gray-700'
          } text-md select-none whitespace-nowrap`}
        >
          {label}
        </label>
      </div>
    </div>
  );
};
