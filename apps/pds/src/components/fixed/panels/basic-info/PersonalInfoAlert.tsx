/* eslint-disable @nx/enforce-module-boundaries */
import { Alert } from '@gscwd-apps/oneui';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';
import { usePdsStore } from 'apps/pds/src/store/pds.store';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
import { PersonalInfo } from 'apps/pds/src/types/data/basic-info.type';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { HiPencil } from 'react-icons/hi';
import { IoIosSave } from 'react-icons/io';
import { trimmer } from '../../../../../utils/functions/trimmer';
import { Actions } from '../../../../../utils/helpers/enums/toast.enum';
import { getPds } from '../../../../../utils/helpers/pds.helper';
import { Button } from '../../../modular/buttons/Button';
import { AlertDesc } from '../../alerts/AlertDesc';
import { EditCardBtn } from '../../buttons/EditCardBtn';
import { UndoCardBtn } from '../../buttons/UndoCardBtn';
import { UpdateCardBtn } from '../../buttons/UpdateCardBtn';
import { Toast } from '../../toast/Toast';

type PersonalInfoAlertProps = {
  setInitialValues: () => void;
};

export const PersonalInfoAlert = ({
  setInitialValues,
}: PersonalInfoAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const personalInfoOnEdit = usePdsStore((state) => state.personalInfoOnEdit);
  const personalInfo = usePdsStore((state) => state.personalInfo);
  const setPersonalInfo = usePdsStore((state) => state.setPersonalInfo);
  const setPersonalInfoOnEdit = usePdsStore(
    (state) => state.setPersonalInfoOnEdit
  );
  const pds = getPds(usePdsStore((state) => state));
  const { notify } = useContext(NotificationContext);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);

  const { trigger } = useFormContext<PersonalInfo>();

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? 'Personal Information Updated!'
          : action === 'info'
          ? 'All changes in Personal Information are reverted!'
          : action === 'error'
          ? 'Personal Information not updated!'
          : null}
      </Toast>
    );
  };

  const trimValues = async () => {
    setPersonalInfo({
      ...personalInfo,
      birthPlace: trimmer(personalInfo.birthPlace),
      email: trimmer(personalInfo.email),
    });
  };

  // triggers validation upon firing submit update
  const submitUpdate = async () => {
    const isSubmitValid = await trigger(
      [
        'lastName',
        'firstName',
        'middleName',
        'nameExtension',
        'birthDate',
        'sex',
        'birthPlace',
        'civilStatus',
        'height',
        'weight',
        'bloodType',
        'citizenship',
        'citizenshipType',
        'country',
        'telephoneNumber',
        'mobileNumber',
        'email',
      ],
      { shouldFocus: true }
    );
    if (isSubmitValid === true) {
      setAlertUpdateIsOpen(true);
    } else setAlertUpdateIsOpen(false);
  };

  const updateSection = async (): Promise<Actions> => {
    try {
      await trimValues();
      await axios.put(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/basic/personal-info/${employeeDetails.user._id}`,
        pds.personalInfo
      );
      setInitialPdsState({
        ...initialPdsState,
        personalInfo: pds.personalInfo,
      });
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const alertCancelAction = () => {
    setInitialValues();
    addNotification(Actions.INFO);
    setPersonalInfoOnEdit(false);
    setAlertCancelIsOpen(false);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setPersonalInfoOnEdit(false);
    addNotification(await updateSection());
  };

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Personal Information? This action is
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
            your Personal Information?
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
        <div className=" w-auto">
          {personalInfoOnEdit && (
            <>
              <div className="flex gap-4">
                <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
                <UpdateCardBtn action={submitUpdate} />
              </div>
            </>
          )}
          {!personalInfoOnEdit && (
            <EditCardBtn action={() => setPersonalInfoOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
