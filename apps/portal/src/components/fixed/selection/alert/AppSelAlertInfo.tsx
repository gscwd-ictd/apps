import { useAppSelectionStore } from 'apps/portal/src/store/selection.store';
import { Alert } from 'libs/oneui/src/components/Alert/Alert';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';

export const AppSelAlertInfo = () => {
  const {
    error,
    alertInfoIsOpen,
    setAlertInfoIsOpen,
    modal,
    setModal,
    setSelectedApplicants,
  } = useAppSelectionStore((state) => ({
    error: state.errorPatch,
    setAlertInfoIsOpen: state.setAlertInfoIsOpen,
    alertInfoIsOpen: state.alertInfoIsOpen,
    modal: state.modal,
    setModal: state.setModal,
    setSelectedApplicants: state.setSelectedApplicants,
  }));

  // info alert action
  const alertInfoAction = () => {
    // setIsLoading(true);
    if (!error) setModal({ ...modal, isOpen: false, page: 1 });
    setAlertInfoIsOpen(false);
    setSelectedApplicants([]);
  };

  return (
    <Alert open={alertInfoIsOpen} setOpen={setAlertInfoIsOpen}>
      <Alert.Description>
        {!error ? (
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
            <div className="bg-inherit text-md font-light mt-2">
              Your actions have been submitted successfully. Thank you!
            </div>
          </div>
        ) : error ? (
          <div className="w-full px-5">
            <div className="flex gap-2 place-items-center">
              <HiXCircle className="text-red-500 animate-pulse" size={30} />
              <div className="text-3xl font-semibold text-indigo-800">
                Error
              </div>
            </div>
            <div className="bg-inherit text-md font-light mt-2">
              A problem was encountered. Please try again in a few seconds.
              Thank you!
            </div>
          </div>
        ) : null}
      </Alert.Description>
      <Alert.Footer alignEnd>
        <div className="flex justify-end">
          <button
            onClick={alertInfoAction}
            className="min-w-[5rem] max-w-auto disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-opacity-85 bg-indigo-500 px-3 text-sm transition-all ease-in-out duration-100 font-semibold tracking-wide py-2 rounded whitespace-nowrap focus:outline-none focus:ring-4 hover:shadow-lg active:shadow-md active:ring-0 active:scale-95"
          >
            {!error ? ' Got it, Thanks!' : 'Close'}
          </button>
        </div>
      </Alert.Footer>
    </Alert>
  );
};
