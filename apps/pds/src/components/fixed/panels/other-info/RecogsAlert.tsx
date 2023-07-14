/* eslint-disable @nx/enforce-module-boundaries */
import { Alert } from '@gscwd-apps/oneui';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';
import { usePdsStore } from 'apps/pds/src/store/pds.store';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
import axios from 'axios';
import { useContext, useState } from 'react';
import { HiPencil } from 'react-icons/hi';
import { HiArrowUturnLeft } from 'react-icons/hi2';
import { IoIosSave } from 'react-icons/io';
import { Actions } from '../../../../../utils/helpers/enums/toast.enum';
import { getPds } from '../../../../../utils/helpers/pds.helper';
import { Button } from '../../../modular/buttons/Button';
import { AlertDesc } from '../../alerts/AlertDesc';
import { EditCardBtn } from '../../buttons/EditCardBtn';
import { UndoCardBtn } from '../../buttons/UndoCardBtn';
import { UpdateCardBtn } from '../../buttons/UpdateCardBtn';
import { Toast } from '../../toast/Toast';
import { AssignRecognitionsToUpdate } from './utils/functions';

type RecognitionsAlertProps = {
  setInitialValues: () => void;
};

export const RecognitionsAlert = ({
  setInitialValues,
}: RecognitionsAlertProps): JSX.Element => {
  const pds = getPds(usePdsStore((state) => state));
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const { notify } = useContext(NotificationContext);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const recognitionsOnEdit = usePdsStore((state) => state.recognitionsOnEdit);
  const setRecognitions = usePdsStore((state) => state.setRecognitions);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const setRecognitionsOnEdit = usePdsStore(
    (state) => state.setRecognitionsOnEdit
  );
  const deletedRecognitions = useUpdatePdsStore(
    (state) => state.deletedRecognitions
  );
  const setDeletedRecognitions = useUpdatePdsStore(
    (state) => state.setDeletedRecognitions
  );

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? 'Recognitions Updated!'
          : action === 'info'
          ? 'All changes in Recognitions are reverted!'
          : action === 'error'
          ? 'Problem encountered. Recognitions not updated!'
          : null}
      </Toast>
    );
  };

  const updateSection = async () => {
    const allRecognitions = await AssignRecognitionsToUpdate(pds.recognitions);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/recognition/${employeeDetails.user._id}`,
        {
          add: allRecognitions.add,
          update: allRecognitions.update,
          delete: deletedRecognitions,
        }
      );
      setRecognitions(data);
      setInitialPdsState({ ...initialPdsState, recognitions: data });
      setDeletedRecognitions([]);
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const alertCancelAction = () => {
    setInitialValues();
    setRecognitionsOnEdit!(false);
    setAlertCancelIsOpen(false);
    addNotification(Actions.INFO);
    setDeletedRecognitions([]);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setRecognitionsOnEdit!(false);
    addNotification(await updateSection());
  };

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Recognitions? This action is
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
            your Recognitions?{' '}
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
          {recognitionsOnEdit && (
            <>
              <div className="flex gap-4">
                <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
                <UpdateCardBtn action={() => setAlertUpdateIsOpen(true)} />
              </div>
            </>
          )}
          {!recognitionsOnEdit && (
            <EditCardBtn action={() => setRecognitionsOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
