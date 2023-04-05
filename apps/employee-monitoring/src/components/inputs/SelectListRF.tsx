interface MySelectListRFProps
  extends React.InputHTMLAttributes<HTMLSelectElement> {
  id: string;
  className?: string;
  selectList: Array<object>;
  defaultOption?: string;
  muted?: boolean;
  controller: object;
  label: string;
  isError?: boolean;
  errorMessage?: string;
}

type Item = {
  label: string;
  value: any;
};

export const SelectListRF: React.FC<MySelectListRFProps> = ({
  id,
  className,
  selectList,
  defaultOption = '',
  muted = false,
  controller,
  label,
  isError = false,
  errorMessage,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id}>
        <span className="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-800">
          {label}
        </span>
      </label>
      <select
        id={id}
        {...controller}
        disabled={muted}
        className={`rounded-lg bg-gray-50 border ${
          isError
            ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
            : ' border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        } hover:cursor-pointer w-full outline-none text-xs text-gray-600 h-[2.5rem] p-2.5 ${className}`}
        {...props}
      >
        <option value="" key="" disabled>
          -
        </option>
        {/* <option value="">Select {defaultOption}...</option> */}
        {selectList.map((item: Item, idx: number) => (
          <option value={item.value} key={idx}>
            {item.label}
          </option>
        ))}
      </select>
      {errorMessage && (
        <span className="text-xs text-red-600">{errorMessage}</span>
      )}
    </div>
  );
};
