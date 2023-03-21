/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Alert, Button } from '@gscwd-apps/oneui';
import { useAlertConfirmationStore } from 'apps/portal/src/store/alert.store';
import { useModalStore } from 'apps/portal/src/store/modal.store';
import { HiExclamationCircle } from 'react-icons/hi';

export const DrcAlertConfirmation = () => {
  const { confirmationIsOpen, setConfIsOpen, closeConf, openConf } =
    useAlertConfirmationStore((state) => ({
      confirmationIsOpen: state.isOpen,
      setConfIsOpen: state.setIsOpen,
      closeConf: state.setClose,
      openConf: state.setOpen,
    }));

  const action = useModalStore((state) => state.action);

  const onSubmitConfirm = () => {
    closeConf();
  };

  return (
    <>
      <Alert open={confirmationIsOpen} setOpen={setConfIsOpen}>
        <Alert.Description>
          <div className="flex-row items-center w-full h-auto p-5">
            <div className="w-full text-lg font-normal text-left text-slate-700 ">
              <div className="flex gap-2 place-items-center">
                <HiExclamationCircle size={30} className="text-yellow-400" />
                <div className="text-3xl font-semibold text-gray-700">
                  Action
                </div>
              </div>
              {action === 'create' ? (
                'This action cannot be undone.'
              ) : action === 'update' ? (
                <div className="flex gap-2 font-light text-left text-md">
                  <div>
                    This will update the existing duties, responsibilities, and
                    competencies.
                  </div>
                </div>
              ) : null}
            </div>
            <div className="w-full mt-5 text-lg font-light text-left text-slate-700 ">
              Do you want to proceed?
            </div>
          </div>
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="flex gap-2">
            <div className="w-[5rem]">
              <Button variant="info" onClick={closeConf}>
                No
              </Button>
            </div>

            <div className="min-w-[5rem] max-w-auto">
              <Button onClick={onSubmitConfirm}>Yes</Button>
            </div>
          </div>
        </Alert.Footer>
      </Alert>
    </>
  );
};
