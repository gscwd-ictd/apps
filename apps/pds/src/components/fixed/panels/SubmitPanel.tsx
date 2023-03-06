import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useEmployeeStore } from '../../../store/employee.store';
import { usePdsStore } from '../../../store/pds.store';
import { useTabStore } from '../../../store/tab.store';
import { Card } from '../../modular/cards/Card';
import { Page } from '../../modular/pages/Page';
import LoadingIndicator from '../loader/LoadingIndicator';
import { PrevButton } from '../navigation/button/PrevButton';
import { postData } from '../../../../utils/hoc/axios';
import { pdsToSubmit } from '../../../../utils/helpers/pds.helper';
import { HeadContainer } from '../head/Head';
import { HiExclamationCircle } from 'react-icons/hi';
import { PdsAlertSubmitConfirmation } from '../pds/PdsAlertSubmitConfirmation';
import { PdsAlertSubmitSuccess } from '../pds/PdsAlertSubmitSuccess';
import { Alert, Button } from '../../../../../../libs/oneui/src/index';
import { PdsAlertSubmitFailed } from '../pds/PdsAlertSubmitFailed';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { Toast } from '../toast/Toast';
import { Actions } from 'apps/pds/utils/helpers/enums/toast.enum';

export default function SubmitPanel(): JSX.Element {
  const pds = pdsToSubmit(usePdsStore((state) => state));

  const router = useRouter(); // initialize router

  const [isError, setIsError] = useState<boolean>(false);

  const [isConfirmationPressed, setIsConfirmationPressed] =
    useState<boolean>(false);

  const [alertConfirmation, setAlertConfirmation] = useState<boolean>(false);

  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);

  const [alertFailed, setAlertFailed] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false); // set loading state

  const [isDisabled, setIsDisabled] = useState<boolean>(false); // submit button state

  const { notify } = useContext(NotificationContext);

  // set tab from tab store
  const selectedTab = useTabStore((state) => state.selectedTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);

  // set pds from pds store
  const employee = useEmployeeStore((state) => state.employeeDetails);

  // fire submit
  const handleSubmit = async () => {
    // set disabled button to true
    setIsDisabled(true);

    // set loading to true upon click
    setIsLoading(true);

    // set timeout callback function and sets the loading to false after the timeout

    const { error } = await postData(
      `${process.env.NEXT_PUBLIC_PORTAL_BE_URL}/pds/${employee.employmentDetails.userId}`,
      pds
    );

    setIsConfirmationPressed(true);

    return { error };
  };

  const alertConfirmationAction = async () => {
    const submitResponse = await handleSubmit();
    if (submitResponse.error === true) {
      setIsError(true);
      setIsLoading(false);
    } else if (submitResponse.error === false) {
      setIsError(false);
      setIsLoading(false);
    }
  };

  const alertSuccessAction = async () => {
    setAlertSuccess(false);
    await router.push(`/pds/${employee.user._id}/view`);
  };

  const alertFailedAction = () => {
    setAlertFailed(false);
  };

  // toast notification
  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        <div className="mt-2 text-xs font-light bg-inherit">
          {action === Actions.SUCCESS
            ? '  Hurray!'
            : action === Actions.ERROR
            ? '  Something went wrong.'
            : null}
        </div>
      </Toast>
    );
  };

  useEffect(() => {
    if (isError && isConfirmationPressed) {
      setAlertConfirmation(false);
      setTimeout(() => {
        setAlertFailed(true);
      }, 300);
      addNotification(Actions.ERROR);
    } else if (!isError && isConfirmationPressed) {
      setAlertConfirmation(false);
      setTimeout(() => {
        setAlertSuccess(true);
      }, 300);
      addNotification(Actions.SUCCESS);
    }
    setIsDisabled(false);
    setIsError(false);
    setIsConfirmationPressed(false);
  }, [isError, isConfirmationPressed]);

  return (
    <>
      <HeadContainer title="PDS - Submit Personal Data Sheet" />
      {/* Toast Notification */}

      {/**Alert Confirmation */}
      <Alert open={alertConfirmation} setOpen={setAlertConfirmation}>
        <Alert.Description>
          <PdsAlertSubmitConfirmation />
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="flex">
            <Button
              variant="info"
              onClick={() => setAlertConfirmation(false)}
              disabled={isDisabled ? true : false}
              className="w-[7rem]"
            >
              No
            </Button>
          </div>

          <div className="">
            <Button
              onClick={alertConfirmationAction}
              disabled={isDisabled ? true : false}
              className="w-[7rem]"
            >
              {isLoading ? <div className="text-white">Submitting</div> : 'Yes'}
            </Button>
          </div>
        </Alert.Footer>
      </Alert>
      {/**Alert Success */}
      <Alert open={alertSuccess} setOpen={setAlertSuccess}>
        <Alert.Description>
          <PdsAlertSubmitSuccess />
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="flex gap-2">
            <div className="max-w-auto min-w-[5rem]">
              <Button
                onClick={() => alertSuccessAction()}
                disabled={isDisabled ? true : false}
              >
                <div className="text-white">View PDS</div>
              </Button>
            </div>
          </div>
        </Alert.Footer>
      </Alert>
      {/**Alert Failed */}
      <Alert open={alertFailed} setOpen={setAlertFailed}>
        <Alert.Description>
          <PdsAlertSubmitFailed />
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="flex gap-2">
            <div className="max-w-auto min-w-[5rem]">
              <Button
                onClick={alertFailedAction}
                disabled={isDisabled ? true : false}
              >
                <div className="text-white">Close</div>
              </Button>
            </div>
          </div>
        </Alert.Footer>
      </Alert>
      {/* Submit Page */}
      <Page title="" subtitle="">
        <>
          <Card title="" subtitle="" className="mx-[18%]  px-[5%] ">
            <div className="flex h-[7rem] gap-2">
              <div className="w-[15%]">
                <HiExclamationCircle color="orange" className="w-full h-full" />
              </div>
              <div className="flex w-[85%] flex-col justify-between">
                <p className="pt-3 text-2xl font-medium">Information</p>
                <p className="pb-2 mt-2 font-light">
                  Any misrepresentation made in the Personal Data Sheet and the
                  Work Experience Sheet shall cause the filing of administrative
                  or criminal case(s) against the person concerned.
                </p>
              </div>
            </div>
          </Card>
          {/* PDS Submit Button */}
          <div className="mx-[18%] my-10 flex flex-col">
            <button
              className={`${
                isLoading
                  ? `cursor-progress bg-indigo-400`
                  : `  bg-indigo-500 transition-colors hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 focus:outline-none focus:ring focus:ring-indigo-300 active:bg-indigo-700`
              } w-full rounded-md border border-violet-200 px-5 py-4  text-white shadow-lg shadow-indigo-200 transition-all hover:scale-105`}
              onClick={() => setAlertConfirmation(true)}
              disabled={isDisabled ? true : false}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-sm font-medium uppercase">
                  {isLoading ? 'Processing' : 'Submit PDS'}
                </span>
                {isLoading && <LoadingIndicator size={5} />}
              </span>
            </button>
          </div>
        </>
      </Page>
      {/* PREV BUTTON */}
      <PrevButton action={() => handlePrevTab(selectedTab)} type="button" />
    </>
  );
}
