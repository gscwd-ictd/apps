import { isEmpty } from 'lodash';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface MySelectListRFProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  id: string;
  className?: string;
  selectList: Array<object>;
  defaultOption?: string;
  muted?: boolean;
  controller: object;
  label: string;
  isError?: boolean;
  errorMessage?: string;
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isLoading?: boolean;
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
  textSize = 'xs',
  isLoading,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center h-7">
        <label htmlFor={id}>
          <span className={`block text-${textSize} font-medium text-gray-900 dark:text-gray-800`}>{label}</span>
        </label>

        <div className="block p-1 mb-2 w-7 h-7">
          {isLoading ? (
            <div
              className="inline-block h-4 w-4 animate-spin color rounded-full border-[3px] border-solid border-current border-gray-800 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <select
        id={id}
        {...controller}
        disabled={muted}
        className={`rounded-lg bg-gray-50 border ${
          isError
            ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
            : ' border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        } hover:cursor-pointer w-full outline-none  text-${textSize}  text-gray-900 ${
          textSize === 'xs' ? 'h-[2.5rem]' : 'h-[3rem]'
        } p-2.5 ${className}`}
        {...props}
      >
        <option value="" key="" disabled>
          -
        </option>

        {!isEmpty(selectList)
          ? selectList.map((item: Item, idx: number) => (
              <option value={item.value} key={idx}>
                {item.label}
              </option>
            ))
          : null}
      </select>
      {errorMessage && <span className="mt-1 text-xs text-red-400">{errorMessage}</span>}
    </div>
  );
};
