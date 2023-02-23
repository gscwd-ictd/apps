/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Alert } from '@gscwd-apps/oneui';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';
import { usePdsStore } from 'apps/pds/src/store/pds.store';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { HiPencil } from 'react-icons/hi';
import { IoIosSave } from 'react-icons/io';
import { Actions } from '../../../../../utils/helpers/enums/toast.enum';
import { getPds } from '../../../../../utils/helpers/pds.helper';
import { Button } from '../../../modular/buttons/Button';
import { AlertDesc } from '../../alerts/AlertDesc';
import { Toast } from '../../toast/Toast';

type MotherAlertProps = {
  setInitialValues: () => void;
};

export const MotherAlert = ({
  setInitialValues,
}: MotherAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const motherOnEdit = usePdsStore((state) => state.motherOnEdit);
  const setMotherOnEdit = usePdsStore((state) => state.setMotherOnEdit);
  const { notify } = useContext(NotificationContext);
  const pds = getPds(usePdsStore((state) => state));
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const parents = usePdsStore((state) => state.parents);
  const allowMotherSave = useUpdatePdsStore((state) => state.allowMotherSave);
  const setAllowMotherSave = useUpdatePdsStore(
    (state) => state.setAllowMotherSave
  );

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? "Mother's Maiden Name Updated!"
          : action === 'info'
          ? "All changes in Mother's Maiden Name are reverted!"
          : action === 'error'
          ? "Mother's Maiden Name not updated!"
          : null}
      </Toast>
    );
  };

  const updateSection = async () => {
    const {
      fatherFirstName,
      fatherLastName,
      fatherMiddleName,
      fatherNameExtension,
      ...rest
    } = pds.parents;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/family/parents/${employeeDetails.user._id}/mother`,
        rest
      );
      setInitialPdsState({
        ...initialPdsState,
        parents: {
          ...initialPdsState.parents,
          motherFirstName: pds.parents.motherFirstName,
          motherMiddleName: pds.parents.motherMiddleName,
          motherLastName: pds.parents.motherLastName,
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
    setMotherOnEdit!(false);
    setAlertCancelIsOpen(false);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setMotherOnEdit!(false);
    const getUpdate = await updateSection();
    addNotification(getUpdate);
  };

  useEffect(() => {
    if (
      motherOnEdit &&
      (isEmpty(parents.motherLastName) ||
        isEmpty(parents.motherFirstName) ||
        isEmpty(parents.motherMiddleName) ||
        isEmpty(parents.motherMaidenName))
    ) {
      setAllowMotherSave(false);
    }

    if (
      motherOnEdit &&
      !isEmpty(parents.motherLastName) &&
      !isEmpty(parents.motherFirstName) &&
      !isEmpty(parents.motherMiddleName) &&
      !isEmpty(parents.motherMaidenName)
    ) {
      setAllowMotherSave(true);
    }
  }, [motherOnEdit, parents]);

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Mother&apos;s Maiden Name? This action is
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
        <AlertDesc>
          Are you sure you want to cancel the changes that you have made to your
          Mother&apos;s Maiden Name?
        </AlertDesc>
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
          {motherOnEdit && (
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
          {!motherOnEdit && (
            <>
              <Button
                onClick={() => setMotherOnEdit!(true)}
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
