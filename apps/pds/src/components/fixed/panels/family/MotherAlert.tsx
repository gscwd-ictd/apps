/* eslint-disable @nx/enforce-module-boundaries */
import { Alert } from '@gscwd-apps/oneui';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';
import { usePdsStore } from 'apps/pds/src/store/pds.store';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
import { ParentForm } from 'apps/pds/src/types/data/family.type';
import { trimmer } from 'apps/pds/utils/functions/trimmer';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
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
  const setParents = usePdsStore((state) => state.setParents);
  const { trigger } = useFormContext<ParentForm>();

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

  // trim object
  const trimValues = async () => {
    setParents({
      ...parents,
      motherFirstName: trimmer(parents.motherFirstName),
      motherLastName: trimmer(parents.motherLastName),
      motherMiddleName: trimmer(parents.motherMiddleName),
    });
  };

  //
  const submitUpdate = async () => {
    const isSubmitValid = await trigger(
      ['motherFName', 'motherLName', 'motherMName'],
      { shouldFocus: true }
    );
    if (isSubmitValid === true) {
      setAlertUpdateIsOpen(true);
    } else setAlertUpdateIsOpen(false);
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
              <div className="flex gap-4">
                <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
                <UpdateCardBtn action={submitUpdate} />
              </div>
            </>
          )}
          {!motherOnEdit && (
            <EditCardBtn action={() => setMotherOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
