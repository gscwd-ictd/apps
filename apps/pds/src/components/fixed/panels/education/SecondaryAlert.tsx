/* eslint-disable @nx/enforce-module-boundaries */
import { Alert } from '@gscwd-apps/oneui';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';
import { usePdsStore } from 'apps/pds/src/store/pds.store';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
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
import { Toast } from '../../toast/Toast';
import { SecEducation } from '../../../../types/data/education.type';
import { trimmer } from 'apps/pds/utils/functions/trimmer';
import { UndoCardBtn } from '../../buttons/UndoCardBtn';
import { UpdateCardBtn } from '../../buttons/UpdateCardBtn';
import { EditCardBtn } from '../../buttons/EditCardBtn';

type SecondaryAlertProps = {
  setInitialValues: () => void;
};

export const SecondaryAlert = ({
  setInitialValues,
}: SecondaryAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const secondaryOnEdit = usePdsStore((state) => state.secondaryOnEdit);
  const setSecondaryOnEdit = usePdsStore((state) => state.setSecondaryOnEdit);
  const { notify } = useContext(NotificationContext);
  const pds = getPds(usePdsStore((state) => state));
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const secondary = usePdsStore((state) => state.secondary);
  const setSecondary = usePdsStore((state) => state.setSecondary);
  const { trigger } = useFormContext<SecEducation>();

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? 'Secondary Education Updated!'
          : action === 'info'
          ? 'All changes in Secondary Education are reverted!'
          : action === 'error'
          ? 'Secondary Education not updated!'
          : null}
      </Toast>
    );
  };

  // trim values
  const trimValues = async () => {
    setSecondary({
      ...secondary,
      schoolName: trimmer(secondary.schoolName),
      awards: trimmer(secondary.awards),
    });
  };

  // fires submit update button with validation
  const submitUpdate = async () => {
    const isSubmitValid = await trigger(
      [
        'secSchoolName',
        'secDegree',
        'secFrom',
        'secTo',
        'secUnits',
        'secYearGraduated',
        'secAwards',
      ],
      { shouldFocus: true }
    );
    if (isSubmitValid === true) {
      setAlertUpdateIsOpen(true);
    } else setAlertUpdateIsOpen(false);
  };

  // update
  const updateSection = async () => {
    const { isGraduated, isOngoing, ...rest } = pds.secondary;
    try {
      await trimValues();
      await axios.put(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/education/secondary/${employeeDetails.user._id}`,
        rest
      );
      setInitialPdsState({ ...initialPdsState, secondary: rest });
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const alertCancelAction = () => {
    setInitialValues();
    addNotification(Actions.INFO);
    setSecondaryOnEdit!(false);
    setAlertCancelIsOpen(false);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setSecondaryOnEdit!(false);
    const getUpdate = await updateSection();
    addNotification(getUpdate);
  };

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Secondary Education? This action is
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
            your Secondary Education?
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
          {secondaryOnEdit && (
            <>
              <div className="flex gap-4 ">
                <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
                <UpdateCardBtn action={submitUpdate} />
              </div>
            </>
          )}
          {!secondaryOnEdit && (
            <EditCardBtn action={() => setSecondaryOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
