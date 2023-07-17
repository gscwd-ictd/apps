/* eslint-disable @nx/enforce-module-boundaries */
import { Alert } from '@gscwd-apps/oneui';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';
import { usePdsStore } from 'apps/pds/src/store/pds.store';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
import { GovernmentIssuedIds } from 'apps/pds/src/types/data/basic-info.type';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { useContext, useEffect, useState } from 'react';
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

type GovernmentIdsAlertProps = {
  setInitialValues: () => void;
};

export const GovernmentIdsAlert = ({
  setInitialValues,
}: GovernmentIdsAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const governmentIssuedIds = usePdsStore((state) => state.governmentIssuedIds);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const governmentIssuedIdsOnEdit = usePdsStore(
    (state) => state.governmentIssuedIdsOnEdit
  );
  const setGovernmentIssuedIdsOnEdit = usePdsStore(
    (state) => state.setGovernmentIssuedIdsOnEdit
  );
  const { notify } = useContext(NotificationContext);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const pds = getPds(usePdsStore((state) => state));
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const allowGovernmentIdsSave = useUpdatePdsStore(
    (state) => state.allowGovernmentIdsSave
  );
  const setAllowGovernmentIdsSave = useUpdatePdsStore(
    (state) => state.setAllowGovernmentIdsSave
  );
  // initialize basic info useform context and use trigger to validate
  const { trigger } = useFormContext<GovernmentIssuedIds>();

  // triggers a revalidation before firing update button
  const submitUpdate = async () => {
    const submit = await trigger(
      [
        'agencyNumber',
        'gsisNumber',
        'pagibigNumber',
        'philhealthNumber',
        'sssNumber',
        'tinNumber',
      ],
      { shouldFocus: true }
    );
    if (submit === true) {
      setAlertUpdateIsOpen(true);
    } else setAlertUpdateIsOpen(false);
  };

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? 'Government Issued IDs Updated!'
          : action === 'info'
          ? 'All changes in Government Issued IDs are reverted!'
          : action === 'error'
          ? 'Government Issued IDs not updated!'
          : null}
      </Toast>
    );
  };

  const updateSection = async (): Promise<Actions> => {
    const { status } = await axios.put(
      `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/basic/government-info/${employeeDetails.user._id}`,
      pds.governmentIssuedIds
    );

    if (status === 200) {
      setInitialPdsState({
        ...initialPdsState,
        governmentIssuedIds: pds.governmentIssuedIds,
      });
      return Actions.SUCCESS;
    } else return Actions.ERROR;
  };

  const alertCancelAction = () => {
    setInitialValues();
    addNotification(Actions.INFO);
    setGovernmentIssuedIdsOnEdit!(false);
    setAlertCancelIsOpen(false);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setGovernmentIssuedIdsOnEdit!(false);
    const getUpdate = await updateSection();
    addNotification(getUpdate);
  };

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Government Issued IDs? This action is
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
            your Government Issued IDs?
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
          {governmentIssuedIdsOnEdit && (
            <>
              <div className="flex gap-4">
                <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
                <UpdateCardBtn action={submitUpdate} />
              </div>
            </>
          )}
          {!governmentIssuedIdsOnEdit && (
            <EditCardBtn action={() => setGovernmentIssuedIdsOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
