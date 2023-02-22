import { FunctionComponent, InputHTMLAttributes } from 'react';

interface TextButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  btnLabel: string;
}

export const TextButton: FunctionComponent<TextButtonProps> = ({ btnLabel, ...props }) => {
  return (
    <>
      <div className="flex items-center">
        <button className="py-2 px-3 whitespace-nowrap border-2 focus:ring-4 focus:ring-slate-100 focus:outline-none focus:border-slate-300 border-slate-200 rounded-l bg-slate-100 hover:bg-slate-200 hover:bg-opacity-50 active:bg-slate-300 active:bg-opacity-40 text-gray-700 transition-colors">
          {btnLabel}
        </button>
        <input
          {...props}
          type="text"
          className="focus:ring-slate-100 focus:ring-4 focus:border-slate-300 border-r-2 border-y-2 border-l-0 rounded-r  border-slate-200 w-full"
        ></input>
      </div>
    </>
  );
};
