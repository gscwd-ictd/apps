import { Alert, NotificationController, useNotification } from '@ericsison-dev/my-ui';
import axios from 'axios';
import { AlertDesc } from 'components/fixed/alerts/AlertDesc';
import { Toast } from 'components/fixed/toast/Toast';
import { Button } from 'components/modular/buttons/Button';
import { NotificationContext } from 'context/NotificationContext';
import { useContext, useState } from 'react';
import { HiPencil } from 'react-icons/hi';
import { HiArrowUturnLeft } from 'react-icons/hi2';
import { IoIosSave } from 'react-icons/io';
import { useEmployeeStore } from 'store/employee.store';
import { usePdsStore } from 'store/pds.store';
import { useUpdatePdsStore } from 'store/update-pds.store';
import { Actions } from '../../../../../utils/helpers/enums/toast.enum';
import { getPds } from '../../../../../utils/helpers/pds.helper';
import { AssignSkillsToUpdate } from './utils/functions';

type SkillsAlertProps = {
  setInitialValues: () => void;
};

export const SkillsAlert = ({ setInitialValues }: SkillsAlertProps): JSX.Element => {
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
      <Toast variant={action} dismissAction={() => notify.dismiss(notification.id)}>
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
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/skills/${employeeDetails.user._id}`, {
        add: allSkills.add,
        update: allSkills.update,
        delete: deletedSkills,
      });
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
          <AlertDesc>Do you want to update your Skills and Hobbies? This action is irreversible.</AlertDesc>
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="w-full rounded border border-gray-300">
            <Button variant="light" onClick={() => setAlertUpdateIsOpen(false)} className="hover:bg-gray-300">
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
          <AlertDesc>Are you sure you want to cancel the changes that you have made to your Skills and Hobbies?</AlertDesc>
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="w-full rounded border border-gray-300">
            <Button variant="light" onClick={() => setAlertCancelIsOpen(false)} className="hover:bg-gray-300">
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
          {skillsOnEdit && (
            <>
              <div className="flex ">
                <Button onClick={() => setAlertCancelIsOpen(true)} btnLabel="" variant="light" type="button" className="ring-0 focus:ring-0">
                  <div className="flex items-center text-gray-400 hover:text-gray-600">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                      </svg>
                    </div>
                    <span>Undo</span>
                  </div>
                </Button>
                <Button
                  onClick={() => setAlertUpdateIsOpen(true)}
                  btnLabel=""
                  variant="light"
                  type="button"
                  className="ring-0 hover:bg-white focus:ring-0"
                >
                  <div className="flex items-center text-indigo-600 hover:text-indigo-800">
                    <IoIosSave size={20} />
                    <span>Update</span>
                  </div>
                </Button>
              </div>
            </>
          )}
          {!skillsOnEdit && (
            <>
              <Button onClick={() => setSkillsOnEdit!(true)} btnLabel="" variant="light" type="button" className="ring-0 hover:bg-white focus:ring-0">
                <div className="flex items-center text-gray-400 hover:text-gray-600">
                  <HiPencil size={20} />
                  <span>Edit</span>
                </div>
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
};
