/* eslint-disable react/jsx-no-undef */
import { isEmpty } from 'lodash';
import { FunctionComponent } from 'react';

import { useDtrStore } from '../../store/dtr.store';

import { FiPrinter } from 'react-icons/fi';
import { Button } from 'libs/oneui/src/components/Button';

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
