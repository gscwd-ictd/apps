import { FunctionComponent } from 'react';

type ListProps = {
  title: string;
  subtitle: string;
};

export const List: FunctionComponent<ListProps> = ({ title, subtitle }) => {
  return (
    <li className="py-4 w-full">
      <div className="w-[20rem]">
        <h5 className="text-gray-800 truncate">{title}</h5>
      </div>

      <div className="w-[20rem]">
        <p className="text-xs text-gray-400 truncate">{subtitle}</p>
      </div>
    </li>
  );
};
