import { FunctionComponent } from 'react';

type BadgePillProps = {
  label: string | null;
  bgColor: string;
  textColor: string;
};

const CustomBadgePill: FunctionComponent<BadgePillProps> = ({
  label,
  bgColor,
  textColor,
}) => {
  return (
    <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
      <span
        className={`px-2 py-[0.2rem] rounded ${bgColor ?? 'text-gray-400'} ${
          textColor ?? 'text-white'
        } text-center`}
      >
        {label}
      </span>
    </div>
  );
};

export default CustomBadgePill;
