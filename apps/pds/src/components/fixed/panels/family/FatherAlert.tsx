/* eslint-disable @nx/enforce-module-boundaries */
import { Alert } from '@gscwd-apps/oneui';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';
import { usePdsStore } from 'apps/pds/src/store/pds.store';
import { ParentForm } from 'apps/pds/src/types/data/family.type';
import { trimmer } from 'apps/pds/utils/functions/trimmer';
import axios from 'axios';
import { useContext, useState } from 'react';
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

type FatherAlertProps = {
  setInitialValues: () => void;
};

export const FatherAlert = ({
  setInitialValues,
}: FatherAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const fatherOnEdit = usePdsStore((state) => state.fatherOnEdit);
  const setFatherOnEdit = usePdsStore((state) => state.setFatherOnEdit);
  const { notify } = useContext(NotificationContext);
  const pds = getPds(usePdsStore((state) => state));
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const parents = usePdsStore((state) => state.parents);
  const setParents = usePdsStore((state) => state.setParents);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);

  const { trigger } = useFormContext<ParentForm>();

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
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

  // trim object
  const trimValues = async () => {
    setParents({
      ...parents,
      fatherFirstName: trimmer(parents.fatherFirstName),
      fatherLastName: trimmer(parents.fatherLastName),
      fatherMiddleName: trimmer(parents.fatherMiddleName),
      fatherNameExtension: trimmer(parents.fatherNameExtension),
    });
  };

  // triggers validation upon firing submit update
  const submitUpdate = async () => {
    const isSubmitValid = await trigger(
      ['fatherFName', 'fatherLName', 'fatherMName', 'fatherNameExt'],
      { shouldFocus: true }
    );
    if (isSubmitValid === true) {
      setAlertUpdateIsOpen(true);
    } else setAlertUpdateIsOpen(false);
  };

  const updateSection = async () => {
    const { motherFirstName, motherLastName, motherMiddleName, ...rest } =
      pds.parents;
    try {
      await trimValues();
      await axios.put(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/family/parents/${employeeDetails.user._id}/father`,
        rest
      );
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

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Father&apos;s Information? This action is
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
            your Father&apos;s Information?
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
          {fatherOnEdit && (
            <div className="flex gap-4">
              <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
              <UpdateCardBtn action={submitUpdate} />
            </div>
          )}
          {!fatherOnEdit && (
            <EditCardBtn action={() => setFatherOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
