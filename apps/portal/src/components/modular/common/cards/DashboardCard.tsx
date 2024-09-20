// import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

type DashboardCardProps = {
  icon: JSX.Element;
  color: 'orange' | 'rose' | 'blue' | 'indigo' | 'green' | 'lime' | 'gray';
  title: string;
  description: string;
  destination: string;
  children?: ReactNode;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClick?: Function;
  linkType: 'router' | 'href';
  titleSize?: string;
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

export const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  color = 'rose',
  description,
  destination,
  children,
  linkType = 'router',
  titleSize = 'text-sm',
  onClick,
}): JSX.Element => {
  const router = useRouter();
  return (
    <>
      {linkType === 'href' && (
        <a
          href={destination}
          target="_blank"
          className={`flex md:flex-row items-start w-full  gap-3 p-5 mb-5 transition-all ease-in-out bg-white rounded-xl rounded-bl-none rounded-tr-none shadow cursor-pointer shadow-slate-200 hover:scale-105 hover:shadow-xl hover:shadow-slate-200`}
          rel="noreferrer"
        >
          <div className={`flex h-10 w-10 items-center justify-center rounded-md cursor-pointer ${bgColor[color]}`}>
            {icon}
          </div>
          <div>
            <label className={`font-semibold text-gray-600 cursor-pointer ${titleSize}`}>{title}</label>
            <p className="text-xs text-gray-400">{description}</p>
            <div>{children}</div>
          </div>
        </a>
      )}
      {linkType === 'router' && (
        <div
          onClick={() => router.push(destination, undefined, { shallow: true })}
          className={`flex md:flex-row items-start w-full  gap-3 p-5 mb-5 transition-all ease-in-out bg-white rounded-xl rounded-bl-none rounded-tr-none shadow cursor-pointer shadow-slate-200 hover:scale-105 hover:shadow-xl hover:shadow-slate-200`}
        >
          <div className={`flex h-10 w-10 items-center justify-center rounded-md cursor-pointer ${bgColor[color]}`}>
            {icon}
          </div>

          <div>
            <label className={`font-semibold text-gray-600 cursor-pointer ${titleSize}`}>{title}</label>
            <p className="text-xs text-gray-400">{description}</p>
            <div>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};
