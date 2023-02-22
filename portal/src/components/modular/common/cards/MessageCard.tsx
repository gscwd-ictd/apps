import { useRouter } from 'next/router';
import { ReactNode } from 'react';

type MessageCardProps = {
  icon: JSX.Element;
  color: 'orange' | 'rose' | 'blue' | 'indigo' | 'green' | 'lime' | 'gray';
  title: string;
  description: string;
  destination?: string;
  children?: ReactNode;
  onClick: Function;
  linkType: 'router' | 'href';
};

const bgColor = {
  orange: 'bg-orange-50',
  rose: 'bg-rose-50',
  indigo: 'bg-indigo-50',
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  lime: 'bg-lime-50',
  gray: 'bg-gray-50',
};

export const MessageCard: React.FC<MessageCardProps> = ({
  icon,
  title,
  color = 'rose',
  description,
  destination,
  children,
  linkType = 'router',
  onClick,
}): JSX.Element => {
  const router = useRouter();
  return (
    <div
      onClick={() => onClick()}
      className={`flex items-center w-full  gap-3 p-5 mb-5 transition-all ease-in-out bg-white rounded-xl rounded-tr-none rounded-bl-none shadow-md cursor-pointer shadow-slate-100 hover:scale-105 hover:shadow-xl hover:shadow-slate-200`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-md ${bgColor[color]}`}>{icon}</div>
      <div>
        <h5 className="font-semibold text-gray-600">{title}</h5>
        <p className="text-xs text-gray-400">{description}</p>
        <div>{children}</div>
      </div>
    </div>
  );
};
