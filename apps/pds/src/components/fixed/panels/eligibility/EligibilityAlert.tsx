/* eslint-disable @nx/enforce-module-boundaries */
import { Alert } from '@gscwd-apps/oneui';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';
import { usePdsStore } from 'apps/pds/src/store/pds.store';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
import axios from 'axios';
import { useContext, useState } from 'react';
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
import { AssignEligibilitiesForUpdate } from './utils/functions';

type EligibilityAlertProps = {
  setInitialValues: () => void;
};

export const EligibilityAlert = ({
  setInitialValues,
}: EligibilityAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const deletedEligibilities = useUpdatePdsStore(
    (state) => state.deletedEligibilities
  );
  const pds = getPds(usePdsStore((state) => state));
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const eligibilityOnEdit = usePdsStore((state) => state.eligibilityOnEdit);
  const setEligibilityOnEdit = usePdsStore(
    (state) => state.setEligibilityOnEdit
  );
  const { notify } = useContext(NotificationContext);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setEligibility = usePdsStore((state) => state.setEligibility);
  const setDeletedEligibilities = useUpdatePdsStore(
    (state) => state.setDeletedEligibilities
  );

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? 'Eligibility Updated!'
          : action === 'info'
          ? 'All changes in Eligibility are reverted!'
          : action === 'error'
          ? 'Problem encountered. Eligibility not updated!'
          : null}
      </Toast>
    );
  };

  const updateSection = async () => {
    const allUpdatedEligs = await AssignEligibilitiesForUpdate(pds.eligibility);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/eligibility/${employeeDetails.user._id}`,
        {
          add: allUpdatedEligs.add,
          update: allUpdatedEligs.update,
          delete: deletedEligibilities,
        }
      );

      setEligibility(data);
      setInitialPdsState({ ...initialPdsState, eligibility: data });
      setDeletedEligibilities([]);
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const alertCancelAction = () => {
    setInitialValues();
    setEligibilityOnEdit!(false);
    setDeletedEligibilities([]);
    setAlertCancelIsOpen(false);
    addNotification(Actions.INFO);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setEligibilityOnEdit!(false);
    const getUpdate = await updateSection();
    addNotification(getUpdate);
  };

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Eligibility? This action is irreversible.{' '}
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
            your Eligibility?
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
        <div className="w-auto">
          {eligibilityOnEdit && (
            <>
              <div className="flex gap-4">
                <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
                <UpdateCardBtn action={() => setAlertUpdateIsOpen(true)} />
              </div>
            </>
          )}
          {!eligibilityOnEdit && (
            <EditCardBtn action={() => setEligibilityOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
