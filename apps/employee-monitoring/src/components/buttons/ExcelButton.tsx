/* eslint-disable react/jsx-no-undef */
import { isEmpty } from 'lodash';
import { FunctionComponent } from 'react';

import { useDtrStore } from '../../store/dtr.store';

import { FaRegFileExcel } from 'react-icons/fa';
import { Button } from 'libs/oneui/src/components/Button';

type ExcelButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export const ExcelButton: FunctionComponent<ExcelButtonProps> = ({ onClick, disabled }) => {
  return (
    <div className="flex">
      <Button variant={'info'} size={'sm'} loading={false} type="button" onClick={onClick} disabled={disabled}>
        <FaRegFileExcel className="w-4 h-4" />
      </Button>
    </div>
  );
};
