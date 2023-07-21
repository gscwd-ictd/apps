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
import { AssignedVolWorksToUpdate } from './utils/functions';

type VoluntaryWorkAlertProps = {
  setInitialValues: () => void;
};

export const VoluntaryWorkAlert = ({
  setInitialValues,
}: VoluntaryWorkAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const voluntaryWorkOnEdit = usePdsStore((state) => state.voluntaryWorkOnEdit);
  const setVoluntaryWorkOnEdit = usePdsStore(
    (state) => state.setVoluntaryWorkOnEdit
  );
  const { notify } = useContext(NotificationContext);
  const pds = getPds(usePdsStore((state) => state));
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const deletedVolWork = useUpdatePdsStore((state) => state.deletedVolWork);
  const setVoluntaryWork = usePdsStore((state) => state.setVoluntaryWork);
  const setDeletedVolWork = useUpdatePdsStore(
    (state) => state.setDeletedVolWork
  );

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? 'Voluntary Work Experience Updated!'
          : action === 'info'
          ? 'All changes in Voluntary Work Experience are reverted!'
          : action === 'error'
          ? 'Problem encountered. Voluntary Work Experience not updated!'
          : null}
      </Toast>
    );
  };

  const updateSection = async () => {
    const allVolWorks = await AssignedVolWorksToUpdate(pds.voluntaryWork);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/voluntary-work/${employeeDetails.user._id}`,
        {
          add: allVolWorks.add,
          update: allVolWorks.update,
          delete: deletedVolWork,
        }
      );

      setVoluntaryWork(data);
      setInitialPdsState({ ...initialPdsState, voluntaryWork: data });
      setDeletedVolWork([]);
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const alertCancelAction = () => {
    setInitialValues();
    setVoluntaryWorkOnEdit!(false);
    setAlertCancelIsOpen(false);
    addNotification(Actions.INFO);
    setDeletedVolWork([]);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setVoluntaryWorkOnEdit!(false);
    addNotification(await updateSection());
  };

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Voluntary Work Experience? This action is
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
            your Voluntary Work Experience?
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
          {voluntaryWorkOnEdit && (
            <>
              <div className="flex gap-4">
                <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
                <UpdateCardBtn action={() => setAlertUpdateIsOpen(true)} />
              </div>
            </>
          )}
          {!voluntaryWorkOnEdit && (
            <EditCardBtn action={() => setVoluntaryWorkOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
