import { FunctionComponent } from 'react';

type LabelValueProps = {
  label: string;
  value: React.ReactNode | React.ReactNode[];
};

export const LabelValue: FunctionComponent<LabelValueProps> = ({
  label,
  value,
}) => {
  return (
    <>
      <div className="flex items-center gap-1 text-gray-600 text-md ">
        <span className="font-semibold">{label}</span>
        <span className="font-medium text-gray-500">{value}</span>
      </div>
    </>
  );
};
