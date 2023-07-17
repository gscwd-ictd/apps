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
import { AssignLndsForUpdate } from './utils/functions';

type LearningDevelopmentAlertProps = {
  setInitialValues: () => void;
};

export const LearningDevelopmentAlert = ({
  setInitialValues,
}: LearningDevelopmentAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const learningDevelopmentOnEdit = usePdsStore(
    (state) => state.learningDevelopmentOnEdit
  );
  const setLearningDevelopmentOnEdit = usePdsStore(
    (state) => state.setLearningDevelopmentOnEdit
  );
  const { notify } = useContext(NotificationContext);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const deletedLearningDevelopment = useUpdatePdsStore(
    (state) => state.deletedLearningDevelopment
  );
  const pds = getPds(usePdsStore((state) => state));
  const setLearningDevelopment = usePdsStore(
    (state) => state.setLearningDevelopment
  );
  const setDeletedLearningDevelopment = useUpdatePdsStore(
    (state) => state.setDeletedLearningDevelopment
  );

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? 'Learning Development Updated!'
          : action === 'info'
          ? 'All changes in Learning Development are reverted!'
          : action === 'error'
          ? 'Problem encountered. Learning Development not updated!'
          : null}
      </Toast>
    );
  };

  const updateSection = async () => {
    const allLnds = await AssignLndsForUpdate(pds.learningDevelopment);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/learning-development/${employeeDetails.user._id}`,
        {
          add: allLnds.add,
          update: allLnds.update,
          delete: deletedLearningDevelopment,
        }
      );
      setLearningDevelopment(data);
      setInitialPdsState({ ...initialPdsState, learningDevelopment: data });
      setDeletedLearningDevelopment([]);
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const alertCancelAction = () => {
    setInitialValues();
    setLearningDevelopmentOnEdit(false);
    setAlertCancelIsOpen(false);
    addNotification(Actions.INFO);
    setDeletedLearningDevelopment([]);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setLearningDevelopmentOnEdit(false);
    addNotification(await updateSection());
  };

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Learning Development? This action is
            irreversible.
          </AlertDesc>
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="w-full border border-gray-300 rounded">
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
            your Learning Development?
          </AlertDesc>
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="w-full border border-gray-300 rounded">
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
          {learningDevelopmentOnEdit && (
            <>
              <div className="flex gap-4 ">
                <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
                <UpdateCardBtn action={() => setAlertUpdateIsOpen(true)} />
              </div>
            </>
          )}
          {!learningDevelopmentOnEdit && (
            <EditCardBtn action={() => setLearningDevelopmentOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
