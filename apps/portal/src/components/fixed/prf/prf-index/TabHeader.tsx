import React, { DOMAttributes, FunctionComponent } from 'react';
import { HiOutlineTag, HiOutlineThumbUp } from 'react-icons/hi';
import { usePrfStore } from '../../../../store/prf.store';

interface TabHeaderItemProps extends DOMAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  count?: number;
  isActive: boolean;
  variant?: 'primary' | 'warning' | 'danger';
  icon: JSX.Element;
}

const countVariant = {
  primary: 'bg-indigo-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

export const TabHeader: FunctionComponent = () => {
  const pendingPrfs = usePrfStore((state) => state.pendingPrfs);

  const forApprovalPrfs = usePrfStore((state) => state.forApprovalPrfs);

  const activeItem = usePrfStore((state) => state.activeItem);

  const setActiveItem = usePrfStore((state) => state.setActiveItem);

  const headerItems: Array<TabHeaderItemProps> = [
    {
      title: 'Pending Requests',
      subtitle: 'Show all pending position requests',
      count: pendingPrfs.length,
      isActive: true,
      icon: <HiOutlineTag className="h-5 w-5 text-gray-700" />,
    },
    {
      title: 'For Approval',
      subtitle: 'Show all requests awaiting your approval',
      count: forApprovalPrfs && forApprovalPrfs.length,
      isActive: false,
      variant: 'warning',
      icon: <HiOutlineThumbUp className="h-5 w-5 text-gray-700" />,
    },
  ];

  return (
    <div className="scale-95">
      {headerItems.map((item: TabHeaderItemProps, index: number) => {
        return (
          <React.Fragment key={index}>
            <TabHeaderItem
              onClick={() => setActiveItem(index)}
              title={item.title}
              subtitle={item.subtitle}
              isActive={index === activeItem ? true : false}
              icon={item.icon}
              count={item.count}
              variant={item.variant}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

const TabHeaderItem: FunctionComponent<TabHeaderItemProps> = ({
  title,
  subtitle,
  count = 0,
  variant = 'primary',
  isActive,
  icon,
  ...props
}) => {
  return (
    <div className="w-[26rem]">
      <div
        {...props}
        className={`${
          isActive
            ? 'bg-slate-200 bg-opacity-50'
            : 'hover:bg-slate-100 bg-opacity-30'
        } flex items-center justify-between cursor-pointer px-5 py-3 rounded`}
      >
        <div className="flex items-center gap-5">
          {icon}
          <div>
            <h3 className="text-lg">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        <div
          className={`${
            count > 0 ? countVariant[variant] : 'bg-transparent'
          } w-5 h-5 flex justify-center items-center rounded-md`}
        >
          <p
            className={`${
              count > 0 ? 'text-white' : 'text-transparent'
            } text-xs font-medium`}
          >
            {count}
          </p>
        </div>
      </div>

      <div className="px-5">
        <hr />
      </div>
    </div>
  );
};
