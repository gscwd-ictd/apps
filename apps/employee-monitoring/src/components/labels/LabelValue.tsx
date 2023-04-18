import { FunctionComponent } from 'react';

type LabelValueProps = {
  label: string;
  value: React.ReactNode | React.ReactNode[];
  direction?: 'left-to-right' | 'top-to-bottom';
};

export const LabelValue: FunctionComponent<LabelValueProps> = ({
  label,
  value,
  direction = 'left-to-right',
}) => {
  return (
    <>
      <div
        className={`${
          direction === 'left-to-right' ? 'flex' : 'flex flex-col'
        } items-start gap-1 text-xs text-gray-600 `}
      >
        <span className="font-medium">{label}</span>
        <span className="font-normal text-gray-500">{value}</span>
      </div>
    </>
  );
};
