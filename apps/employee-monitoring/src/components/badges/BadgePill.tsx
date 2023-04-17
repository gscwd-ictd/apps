import { FunctionComponent } from 'react';

type Variant = 'primary' | 'default' | 'success' | 'error' | 'warning';

const background = {
  primary: 'bg-blue-400',
  default: 'bg-gray-400',
  success: 'bg-green-500',
  error: 'bg-red-400',
  warning: 'bg-amber-500',
};

type BadgePillProps = {
  label: string | null;
  variant: Variant;
};

const BadgePill: FunctionComponent<BadgePillProps> = ({ label, variant }) => {
  return (
    <div className="sm:w-[2rem] md:w-[4rem] lg:w-[6rem] text-xs">
      <span
        className={`px-2 py-[0.2rem] rounded ${background[variant]} text-white  text-center`}
      >
        {label}
      </span>
    </div>
  );
};

export default BadgePill;
