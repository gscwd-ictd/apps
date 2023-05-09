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
import { Toast } from '../../toast/Toast';
import { AssignCoursesToUpdate } from './utils/functions';

type CollegeAlertProps = {
  setInitialValues: () => void;
};

export const CollegeAlert = ({
  setInitialValues,
}: CollegeAlertProps): JSX.Element => {
  const pds = getPds(usePdsStore((state) => state));
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const { notify } = useContext(NotificationContext);
  const collegeOnEdit = usePdsStore((state) => state.collegeOnEdit);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const deletedCollegeEducs = useUpdatePdsStore(
    (state) => state.deletedCollegeEducs
  );
  const setCollege = usePdsStore((state) => state.setCollege);
  const setCollegeOnEdit = usePdsStore((state) => state.setCollegeOnEdit);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const setDeletedCollegeEducs = useUpdatePdsStore(
    (state) => state.setDeletedCollegeEducs
  );

  // toast notification
  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? 'College Education Updated!'
          : action === 'info'
          ? 'All changes in College Education are reverted!'
          : action === 'error'
          ? 'College Education not updated!'
          : null}
      </Toast>
    );
  };

  // update function
  const updateSection = async () => {
    const allColleges = await AssignCoursesToUpdate(pds.college);

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/education/college/${employeeDetails.user._id}`,
        {
          add: allColleges.add,
          update: allColleges.update,
          delete: deletedCollegeEducs,
        }
      );

      setCollege(data);
      setInitialPdsState({ ...initialPdsState, college: data });
      setDeletedCollegeEducs([]);
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  // cancel action
  const alertCancelAction = () => {
    setInitialValues();
    addNotification(Actions.INFO);
    setCollegeOnEdit!(false);
    setAlertCancelIsOpen(false);
    setDeletedCollegeEducs([]);
  };

  // update action
  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setCollegeOnEdit!(false);
    addNotification(await updateSection());
  };

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your College Education? This action is
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
            your College Education?
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
        <div className="h-[1.6rem] w-auto">
          {collegeOnEdit && (
            <>
              <div className="flex ">
                <Button
                  onClick={() => setAlertCancelIsOpen(true)}
                  btnLabel=""
                  variant="light"
                  type="button"
                  className="ring-0 focus:ring-0"
                >
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                        />
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
          {!collegeOnEdit && (
            <>
              <Button
                onClick={() => setCollegeOnEdit!(true)}
                btnLabel=""
                variant="light"
                type="button"
                className="ring-0 hover:bg-white focus:ring-0"
              >
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
