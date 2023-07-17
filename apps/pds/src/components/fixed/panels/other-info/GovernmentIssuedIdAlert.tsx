/* eslint-disable @nx/enforce-module-boundaries */
import { Alert } from '@gscwd-apps/oneui';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';
import { usePdsStore } from 'apps/pds/src/store/pds.store';
import { GovtIssuedIdForm } from 'apps/pds/src/types/data/supporting-info.type';
import { trimmer } from 'apps/pds/utils/functions/trimmer';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { HiPencil } from 'react-icons/hi';
import { IoIosSave } from 'react-icons/io';
import { Actions } from '../../../../../utils/helpers/enums/toast.enum';
import { getPds } from '../../../../../utils/helpers/pds.helper';
import { Button } from '../../../modular/buttons/Button';
import { AlertDesc } from '../../alerts/AlertDesc';
import { EditCardBtn } from '../../buttons/EditCardBtn';
import { UndoCardBtn } from '../../buttons/UndoCardBtn';
import { UpdateCardBtn } from '../../buttons/UpdateCardBtn';
import { Toast } from '../../toast/Toast';

type GovernmentIssuedIdAlertProps = {
  setInitialValues: () => void;
};

export const GovernmentIssuedIdAlert = ({
  setInitialValues,
}: GovernmentIssuedIdAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const governmentIssuedIdOnEdit = usePdsStore(
    (state) => state.governmentIssuedIdOnEdit
  );
  const setGovernmentIssuedIdOnEdit = usePdsStore(
    (state) => state.setGovernmentIssuedIdOnEdit
  );
  const { notify } = useContext(NotificationContext);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const pds = getPds(usePdsStore((state) => state));
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const governmentIssuedId = usePdsStore((state) => state.governmentIssuedId);
  const setGovernmentIssuedId = usePdsStore(
    (state) => state.setGovernmentIssuedId
  );

  const { trigger } = useFormContext<GovtIssuedIdForm>();

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? 'Government Issued ID Updated!'
          : action === 'info'
          ? 'All changes in Government Issued ID are reverted!'
          : action === 'error'
          ? 'Government Issued ID not updated!'
          : null}
      </Toast>
    );
  };

  const trimValues = async () => {
    setGovernmentIssuedId({
      ...governmentIssuedId,
      idNumber: trimmer(governmentIssuedId.idNumber),
      issuePlace: trimmer(governmentIssuedId.issuePlace),
    });
  };

  const submitUpdate = async () => {
    const isSubmitValid = await trigger(
      ['govtId', 'govtIdNo', 'issueDate', 'issuePlace'],
      { shouldFocus: true }
    );
    if (isSubmitValid === true) {
      setAlertUpdateIsOpen(true);
    } else setAlertUpdateIsOpen(false);
  };

  const updateSection = async (): Promise<Actions> => {
    try {
      await trimValues();
      await axios.put(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/government-issued-id/${employeeDetails.user._id}`,
        pds.governmentIssuedId
      );
      setInitialPdsState({
        ...initialPdsState,
        governmentIssuedId: pds.governmentIssuedId,
      });
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const alertCancelAction = () => {
    setInitialValues();
    addNotification(Actions.INFO);
    setGovernmentIssuedIdOnEdit(false);
    setAlertCancelIsOpen(false);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setGovernmentIssuedIdOnEdit(false);
    const getUpdate = await updateSection();
    addNotification(getUpdate);
  };

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Government Issued ID? This action is
            irreversible.
          </AlertDesc>
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="w-full rounded border border-gray-300">
            <Button
              variant="light"
              onClick={() => setAlertUpdateIsOpen(false)}
              className="hover:bg-gray-300"
            >
              No
            </Button>
          </div>
          <Button variant="theme" onClick={alertUpdateAction}>
            Yes
          </Button>
        </Alert.Footer>
      </Alert>

      <Alert open={alertCancelIsOpen} setOpen={setAlertCancelIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Are you sure you want to cancel the changes that you have made to
            your Government Issued ID?
          </AlertDesc>
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="w-full rounded border border-gray-300">
            <Button
              variant="light"
              onClick={() => setAlertCancelIsOpen(false)}
              className="hover:bg-gray-300"
            >
              No
            </Button>
          </div>
          <Button variant="danger" onClick={alertCancelAction}>
            Yes
          </Button>
        </Alert.Footer>
      </Alert>

      {hasPds && (
        <div className="h-[1.6rem] w-auto">
          {governmentIssuedIdOnEdit && (
            <>
              <div className="flex gap-4">
                <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
                <UpdateCardBtn action={submitUpdate} />
              </div>
            </>
          )}
          {!governmentIssuedIdOnEdit && (
            <EditCardBtn action={() => setGovernmentIssuedIdOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
