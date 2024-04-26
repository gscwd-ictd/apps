/* eslint-disable @nx/enforce-module-boundaries */
import { useModalStore } from 'apps/portal/src/store/modal.store';
import { DrcModalSelect } from './DrcModalSelect';
import { DrcModalSelectPositions } from './DrcModalSelectPositions';
import { DrcModalSetting } from './DrcModalSetting';
import { DrcModalSummary } from './DrcModalSummary';
import { DrcUpdatedModalSetting } from './DrcUpdatedModalSetting';
import { DrcModalAddDrc } from './DrcModalAddDrc';
import { DrcUpdatedModalSummary } from './DrcUpdatedModalSummary';

export const DrcModalController = (): JSX.Element => {
  const { modal } = useModalStore((state) => ({ modal: state.modal }));
  const page = modal.page;

  return (
    <div className="max-h-[90%]">
      <>
        {/* {modal.isOpen && modal.page === 1 && 'Open and Page is 1'} */}
        {page === 1 && <DrcModalSelectPositions />}
        {/* {page === 2 && <DrcModalSetting />} */}
        {page === 2 && <DrcUpdatedModalSetting />}
        {/* {page === 3 && <DrcModalSelect />} */}
        {page === 3 && <DrcModalAddDrc />}
        {/* {page === 4 && <DrcModalSummary />} */}
        {page === 4 && <DrcUpdatedModalSummary />}
      </>
    </div>
  );
};
