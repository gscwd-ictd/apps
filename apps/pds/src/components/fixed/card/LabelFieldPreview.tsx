import { ReactChild, ReactChildren } from 'react';

type LabelFieldPreviewProps = {
  label: string;
  cols?: number;
  field: any;
};

export const LabelFieldPreview = ({ label = 'LABEL HERE', cols = 2, field }: LabelFieldPreviewProps): JSX.Element => {
  return (
    <>
      {/* odd:bg-gradient-to-r odd:from-slate-50 odd:to-indigo-50 even:bg-white */}
      <div
        className={`flex grid-cols-${cols} rounded-xs w-full hover:-mx-2 hover:drop-shadow-lg hover:transition-all `}
      >
        <p className="col-span-1 w-[50%] break-words font-normal leading-7 text-slate-500 hover:text-black">{label}</p>
        <p className="col-span-1 flex w-[50%] items-end justify-start  font-normal leading-7 text-slate-800 hover:text-slate-900 break-normal">
          {field}
        </p>
      </div>
    </>
  );
};
