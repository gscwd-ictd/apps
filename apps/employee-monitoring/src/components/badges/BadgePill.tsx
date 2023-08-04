import { FunctionComponent } from 'react';

type Variant = 'primary' | 'default' | 'success' | 'error' | 'warning';

const background = {
  primary: 'bg-blue-200 text-blue-800',
  default: 'bg-gray-200 text-gray-800',
  success: 'bg-green-200 text-green-800',
  error: 'bg-red-200 text-red-800',
  warning: 'bg-amber-200 text-amber-800',
};

type BadgePillProps = {
  label: string | null;
  variant: Variant;
};

const BadgePill: FunctionComponent<BadgePillProps> = ({ label, variant }) => {
  return (
    <div className="w-full text-xs">
      <span
        className={`px-2 py-[0.2rem] rounded ${background[variant]} font-mono text-center`}
      >
        {label}
      </span>
    </div>
  );
};

export default BadgePill;
