import { useState } from 'react';

type PositionTabProps = {
  title: string;
};

export const PositionTab = ({ title }: PositionTabProps) => {
  const [tab, setTab] = useState<number>(0);
  let tabIndex;

  return (
    <a
      target="_blank"
      rel="noreferrer"
      onClick={() => console.log(tab)}
      className={`${
        tab === tabIndex ? 'bg-slate-700' : 'bg-slate-100'
      } mr-6 flex h-auto min-h-[3rem] w-full cursor-pointer items-center justify-start rounded-xl 

        border-b  border-gray-200 bg-blue-300 py-2 pt-1 transition-all ease-in-out hover:bg-gray-200`}
    >
      <div className="flex items-center w-full h-full px-5 text-center">
        {title}
      </div>
    </a>
  );
};
