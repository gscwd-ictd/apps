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

type GraduateAlertProps = {
  setInitialValues: () => void;
};

export const GraduateAlert = ({
  setInitialValues,
}: GraduateAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const graduateOnEdit = usePdsStore((state) => state.graduateOnEdit);
  const setGraduateOnEdit = usePdsStore((state) => state.setGraduateOnEdit);
  const { notify } = useContext(NotificationContext);
  const pds = getPds(usePdsStore((state) => state));
  const deletedGraduateEducs = useUpdatePdsStore(
    (state) => state.deletedGraduateEducs
  );
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const setDeletedGraduateEducs = useUpdatePdsStore(
    (state) => state.setDeletedGraduateEducs
  );
  const setGraduate = usePdsStore((state) => state.setGraduate);

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? 'Graduate Education Updated!'
          : action === 'info'
          ? 'All changes in Graduate Education are reverted!'
          : action === 'error'
          ? 'Graduate Education not updated!'
          : null}
      </Toast>
    );
  };

  const updateSection = async () => {
    const allGraduateCourses = await AssignCoursesToUpdate(pds.graduate);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/education/graduate/${employeeDetails.user._id}`,
        {
          add: allGraduateCourses.add,
          update: allGraduateCourses.update,
          delete: deletedGraduateEducs,
        }
      );
      setGraduate(data);
      setInitialPdsState({ ...initialPdsState, graduate: data });
      setDeletedGraduateEducs([]);
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  // cancel action
  const alertCancelAction = () => {
    setInitialValues();
    addNotification(Actions.INFO);
    setGraduateOnEdit!(false);
    setDeletedGraduateEducs([]);
    setAlertCancelIsOpen(false);
  };

  // update action
  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setGraduateOnEdit!(false);
    addNotification(await updateSection());
  };

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Graduate Education? This action is
            irreversible.{' '}
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
            your Graduate Education?
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
          {graduateOnEdit && (
            <>
              <div className="flex gap-4">
                <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
                <UpdateCardBtn action={() => setAlertUpdateIsOpen(true)} />
              </div>
            </>
          )}
          {!graduateOnEdit && (
            <EditCardBtn action={() => setGraduateOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
