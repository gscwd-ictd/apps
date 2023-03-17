/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useModalStore } from 'apps/portal/src/store/modal.store';
import { DrcModalSelectPositions } from './DrcModalSelectPositions';
import { DrcModalSetting } from './DrcModalSetting';

export const DrcModalController = (): JSX.Element => {
  const { modal } = useModalStore((state) => ({ modal: state.modal }));
  const page = modal.page;

  return (
    <div className="max-h-[90%]">
      <>
        {/* {modal.isOpen && modal.page === 1 && 'Open and Page is 1'} */}
        {page === 1 && <DrcModalSelectPositions />}
        {page === 2 && <DrcModalSetting />}
      </>
    </div>
  );
};
