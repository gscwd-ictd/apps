/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Alert } from '@gscwd-apps/oneui';
import { useAlertSuccessStore } from 'apps/portal/src/store/alert.store';
import { useDnrStore } from 'apps/portal/src/store/dnr.store';
import { useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { HiCheckCircle } from 'react-icons/hi';

export const DrcAlertSuccess = () => {
  const { isOpen, setIsOpen, setClose } = useAlertSuccessStore((state) => ({
    isOpen: state.isOpen,
    setIsOpen: state.setIsOpen,
    setClose: state.setClose,
  }));

  // use position store
  const emptySelectedPosition = usePositionStore(
    (state) => state.emptySelectedPosition
  );

  // use modal store
  const closeModal = useModalStore((state) => state.closeModal);

  // use dnr store
  const cancelDrcPage = useDnrStore((state) => state.cancelDrcPage);

  const closeAlert = () => {
    emptySelectedPosition();

    closeModal();

    // set alert to close
    setClose();

    cancelDrcPage();
  };

  return (
    <>
      <Alert open={isOpen} setOpen={setIsOpen}>
        <Alert.Description>
          <div className="w-full px-5">
            <div className="flex gap-2 place-items-center">
              <HiCheckCircle
                className="text-green-500 animate-pulse"
                size={30}
              />
              <div className="text-3xl font-semibold text-indigo-800">
                Success
              </div>
            </div>
            <div className="mt-2 font-light bg-inherit text-md">
              {`Your duties, responsibilities, and competencies have been successfully submitted. We've updated the position's duties,
          responsibilities, and competencies.`}
            </div>
          </div>
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="flex gap-2">
            <button
              onClick={closeAlert}
              className="w-[6rem] px-3 py-2 bg-indigo-400 rounded text-white"
            >
              <span>Got it, thanks!</span>
            </button>
          </div>
        </Alert.Footer>
      </Alert>
    </>
  );
};
