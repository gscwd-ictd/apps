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
import { AssignWorkExperiencesForUpdate } from './utils/functions';

type WorkExperienceAlertProps = {
  setInitialValues: () => void;
};

export const WorkExperienceAlert = ({
  setInitialValues,
}: WorkExperienceAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const workExperienceOnEdit = usePdsStore(
    (state) => state.workExperienceOnEdit
  );
  const setWorkExperienceOnEdit = usePdsStore(
    (state) => state.setWorkExperienceOnEdit
  );
  const { notify } = useContext(NotificationContext);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const pds = getPds(usePdsStore((state) => state));
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const deletedWorkExperiences = useUpdatePdsStore(
    (state) => state.deletedWorkExperiences
  );
  const setWorkExperience = usePdsStore((state) => state.setWorkExperience);
  const setDeletedWorkExperiences = useUpdatePdsStore(
    (state) => state.setDeletedWorkExperiences
  );

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? 'Work Experience Updated!'
          : action === 'info'
          ? 'All changes in Work Experience are reverted!'
          : action === 'error'
          ? 'Problem encountered. Work Experience not updated!'
          : null}
      </Toast>
    );
  };

  const updateSection = async () => {
    const allWorkExperiences = await AssignWorkExperiencesForUpdate(
      pds.workExperience
    );

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/work-experience/${employeeDetails.user._id}`,
        {
          add: allWorkExperiences.add,
          update: allWorkExperiences.update,
          delete: deletedWorkExperiences,
        }
      );
      setWorkExperience(data);
      setInitialPdsState({ ...initialPdsState, workExperience: data });
      setDeletedWorkExperiences([]);
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const alertCancelAction = () => {
    setInitialValues();
    setDeletedWorkExperiences([]);
    setWorkExperienceOnEdit!(false);
    setAlertCancelIsOpen(false);
    addNotification(Actions.INFO);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setWorkExperienceOnEdit!(false);
    const getUpdate = await updateSection();
    addNotification(getUpdate);
  };

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Work Experience? This action is
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
            your Work Experience?
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
          {workExperienceOnEdit && (
            <>
              <div className="flex gap-4">
                <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
                <UpdateCardBtn action={() => setAlertUpdateIsOpen(true)} />
              </div>
            </>
          )}
          {!workExperienceOnEdit && (
            <EditCardBtn action={() => setWorkExperienceOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
