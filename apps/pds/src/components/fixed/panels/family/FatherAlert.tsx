import { Alert, NotificationController, useNotification } from '@ericsison-dev/my-ui';
import axios from 'axios';
import { AlertDesc } from 'components/fixed/alerts/AlertDesc';
import { Toast } from 'components/fixed/toast/Toast';
import { Button } from 'components/modular/buttons/Button';
import { NotificationContext } from 'context/NotificationContext';
import { isEmpty } from 'lodash';
import { MutableRefObject, useContext, useEffect, useRef, useState } from 'react';
import { HiPencil } from 'react-icons/hi';
import { HiArrowUturnLeft } from 'react-icons/hi2';
import { IoIosSave } from 'react-icons/io';
import { useEmployeeStore } from 'store/employee.store';
import { useNotificationStore } from 'store/notifcation.store';
import { usePdsStore } from 'store/pds.store';
import { useUpdatePdsStore } from 'store/update-pds.store';
import { Actions } from '../../../../../utils/helpers/enums/toast.enum';
import { getPds } from '../../../../../utils/helpers/pds.helper';

type FatherAlertProps = {
  setInitialValues: () => void;
};

export const FatherAlert = ({ setInitialValues }: FatherAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const fatherOnEdit = usePdsStore((state) => state.fatherOnEdit);
  const setFatherOnEdit = usePdsStore((state) => state.setFatherOnEdit);
  const { notify } = useContext(NotificationContext);
  const pds = getPds(usePdsStore((state) => state));
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const parents = usePdsStore((state) => state.parents);
  const allowFatherSave = useUpdatePdsStore((state) => state.allowFatherSave);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const setAllowFatherSave = useUpdatePdsStore((state) => state.setAllowFatherSave);

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast variant={action} dismissAction={() => notify.dismiss(notification.id)}>
        {action === 'success'
          ? "Father's Information Updated!"
          : action === 'info'
          ? "All changes in Father's Information are reverted!"
          : action === 'error'
          ? "Father's Information not updated!"
          : null}
      </Toast>
    );
  };

  const updateSection = async () => {
    const { motherFirstName, motherLastName, motherMiddleName, ...rest } = pds.parents;
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/family/parents/${employeeDetails.user._id}/father`, rest);
      setInitialPdsState({
        ...initialPdsState,
        parents: {
          ...initialPdsState.parents,
          fatherFirstName: pds.parents.fatherFirstName,
          fatherMiddleName: pds.parents.fatherMiddleName,
          fatherLastName: pds.parents.fatherLastName,
        },
      });
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const alertCancelAction = () => {
    setInitialValues();
    addNotification(Actions.INFO);
    setFatherOnEdit!(false);
    setAlertCancelIsOpen(false);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setFatherOnEdit!(false);
    const getUpdate = await updateSection();
    addNotification(getUpdate);
  };

  useEffect(() => {
    // disallow if empty
    if (
      fatherOnEdit &&
      (isEmpty(parents.fatherLastName) ||
        isEmpty(parents.fatherMiddleName) ||
        isEmpty(parents.fatherFirstName) ||
        isEmpty(parents.fatherNameExtension))
    ) {
      setAllowFatherSave(false);
    }

    // allow  if all values are not empty
    if (
      fatherOnEdit &&
      !isEmpty(parents.fatherLastName) &&
      !isEmpty(parents.fatherFirstName) &&
      !isEmpty(parents.fatherMiddleName) &&
      !isEmpty(parents.fatherNameExtension)
    ) {
      setAllowFatherSave(true);
    }
  }, [fatherOnEdit, parents]);

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>Do you want to update your Father's Information? This action is irreversible.</AlertDesc>
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
          <AlertDesc>Are you sure you want to cancel the changes that you have made to your Father's Information?</AlertDesc>
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
          {fatherOnEdit && (
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
                  muted={allowFatherSave ? false : true}
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
          {!fatherOnEdit && (
            <>
              <Button onClick={() => setFatherOnEdit!(true)} btnLabel="" variant="light" type="button" className="ring-0 hover:bg-white focus:ring-0">
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
