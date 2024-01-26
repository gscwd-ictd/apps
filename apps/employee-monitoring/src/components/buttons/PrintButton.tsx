import { isEmpty } from 'lodash';
import { FunctionComponent } from 'react';

import { useDtrStore } from '../../store/dtr.store';

import { Button } from '@gscwd-apps/oneui';
import { FiPrinter } from 'react-icons/fi';

type PrintButtonProps = {
  onClick: () => void;
};

export const PrintButton: FunctionComponent<PrintButtonProps> = ({ onClick }) => {
  const { employeeDtr } = useDtrStore((state) => ({
    employeeDtr: state.employeeDtr,
  }));

  return (
    <div className="flex">
      <Button
        variant={'info'}
        size={'sm'}
        loading={false}
        type="button"
        onClick={onClick}
        disabled={isEmpty(employeeDtr)}
      >
        <FiPrinter className="w-4 h-4" />
      </Button>
    </div>
  );
};
