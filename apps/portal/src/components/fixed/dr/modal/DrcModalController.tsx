/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useModalStore } from 'apps/portal/src/store/modal.store';

export const DrcModalController = (): JSX.Element => {
  const modal = useModalStore((state) => state.modal);

  return (
    <>
      {modal.isOpen && modal.page === 1 && 'Open and Page is 1'}
      {modal.isOpen && modal.page === 2 && 'Open and Page is 2'}
    </>
  );
};
