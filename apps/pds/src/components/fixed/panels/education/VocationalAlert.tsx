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
import { AssignCoursesToUpdate } from './utils/functions';

type VocationalAlertProps = {
  setInitialValues: () => void;
};

export const VocationalAlert = ({
  setInitialValues,
}: VocationalAlertProps): JSX.Element => {
  const pds = getPds(usePdsStore((state) => state));
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const { notify } = useContext(NotificationContext);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const vocationalOnEdit = usePdsStore((state) => state.vocationalOnEdit);
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const deletedVocationalEducs = useUpdatePdsStore(
    (state) => state.deletedVocationalEducs
  );
  const setVocational = usePdsStore((state) => state.setVocational);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const setDeletedVocationalEducs = useUpdatePdsStore(
    (state) => state.setDeletedVocationalEducs
  );
  const setVocationalOnEdit = usePdsStore((state) => state.setVocationalOnEdit);

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? 'Vocational Education Updated!'
          : action === 'info'
          ? 'All changes in Vocational Education are reverted!'
          : action === 'error'
          ? 'Vocational Education not updated!'
          : null}
      </Toast>
    );
  };

  const updateSection = async () => {
    const allVocs = await AssignCoursesToUpdate(pds.vocational);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/education/vocational/${employeeDetails.user._id}`,
        {
          add: allVocs.add,
          update: allVocs.update,
          delete: deletedVocationalEducs,
        }
      );
      setVocational(data);
      setInitialPdsState({ ...initialPdsState, vocational: data });
      setDeletedVocationalEducs([]);
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const alertCancelAction = () => {
    setInitialValues();
    addNotification(Actions.INFO);
    setVocationalOnEdit!(false);
    setAlertCancelIsOpen(false);
    setDeletedVocationalEducs([]);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setVocationalOnEdit!(false);
    const getUpdate = await updateSection();
    addNotification(getUpdate);
  };

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Vocational Education? This action is
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
            your Vocational Education?
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
          {vocationalOnEdit && (
            <>
              <div className="flex gap-4">
                <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
                <UpdateCardBtn action={() => setAlertUpdateIsOpen(true)} />
              </div>
            </>
          )}
          {!vocationalOnEdit && (
            <EditCardBtn action={() => setVocationalOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
