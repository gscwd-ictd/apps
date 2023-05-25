import { FunctionComponent } from 'react';

type LabelValueProps = {
  label: string;
  value: React.ReactNode | React.ReactNode[];
  direction?: 'left-to-right' | 'top-to-bottom';
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
};

export const LabelValue: FunctionComponent<LabelValueProps> = ({
  label,
  value,
  textSize = 'xs',
  direction = 'left-to-right',
}) => {
  return (
    <>
      <div
        className={`${
          direction === 'left-to-right' ? 'flex gap-1' : 'flex flex-col gap-0'
        } items-start text-${textSize} text-gray-600 `}
      >
        <span className="font-normal text-gray-500">{label}</span>
        <span className="font-semibold text-black">{value}</span>
      </div>
    </>
  );
};
