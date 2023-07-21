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
import { AssignSkillsToUpdate } from './utils/functions';

type SkillsAlertProps = {
  setInitialValues: () => void;
};

export const SkillsAlert = ({
  setInitialValues,
}: SkillsAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const skillsOnEdit = usePdsStore((state) => state.skillsOnEdit);
  const setSkillsOnEdit = usePdsStore((state) => state.setSkillsOnEdit);
  const { notify } = useContext(NotificationContext);
  const deletedSkills = useUpdatePdsStore((state) => state.deletedSkills);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const pds = getPds(usePdsStore((state) => state));
  const setSkills = usePdsStore((state) => state.setSkills);

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? 'Skills and Hobbies Updated!'
          : action === 'info'
          ? 'All changes in Skills and Hobbies are reverted!'
          : action === 'error'
          ? 'Problem encountered. Skills and Hobbies not updated!'
          : null}
      </Toast>
    );
  };

  const updateSection = async () => {
    const allSkills = await AssignSkillsToUpdate(pds.skills);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/skills/${employeeDetails.user._id}`,
        {
          add: allSkills.add,
          update: allSkills.update,
          delete: deletedSkills,
        }
      );
      setSkills(data);
      setInitialPdsState({ ...initialPdsState, skills: data });
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const alertCancelAction = () => {
    setInitialValues();
    setSkillsOnEdit!(false);
    setAlertCancelIsOpen(false);
    addNotification(Actions.INFO);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setSkillsOnEdit!(false);
    addNotification(await updateSection());
  };

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Skills and Hobbies? This action is
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
            your Skills and Hobbies?
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
          {skillsOnEdit && (
            <>
              <div className="flex gap-4">
                <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
                <UpdateCardBtn action={() => setAlertUpdateIsOpen(true)} />
              </div>
            </>
          )}
          {!skillsOnEdit && (
            <EditCardBtn action={() => setSkillsOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
