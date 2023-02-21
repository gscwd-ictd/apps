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
  errorMessage?: boolean;
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
        <span className="text-xs text-gray-700">{label}</span>
      </label>
      <select
        id={id}
        {...controller}
        disabled={muted}
        className={`rounded border border-gray-300/90 hover:cursor-pointer w-full outline-none text-xs text-gray-600 h-[2.25rem] px-4 ${className}`}
        {...props}
      >
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
