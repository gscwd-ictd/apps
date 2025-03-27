/* eslint-disable @nx/enforce-module-boundaries */
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import { FunctionComponent } from 'react';
import { HiTrash } from 'react-icons/hi';

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
  textSize?: TextSize;
  icon?: boolean;
};

const BadgePill: FunctionComponent<BadgePillProps> = ({ label, variant, textSize, icon }) => {
  return (
    <div className={`flex items-center justify-start ${textSize ?? 'text-xs'}`}>
      {icon ? (
        <span className={`pl-1 py-[0.2rem] h-6 -mr-2 z-10 rounded ${background[variant]} text-center`}>
          {' '}
          {icon ? <HiTrash className={`w-4 h-4 pt-[0.1rem]`} /> : ''}
        </span>
      ) : null}

      <div className={`px-2 py-[0.2rem] h-6 rounded ${background[variant]} text-center ${icon ? 'pl-3' : ''}`}>
        {label}
      </div>
    </div>
  );
};

export default BadgePill;
