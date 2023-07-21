/* eslint-disable @nx/enforce-module-boundaries */
import { Alert } from '@gscwd-apps/oneui';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';
import { usePdsStore } from 'apps/pds/src/store/pds.store';
import { SpouseForm } from 'apps/pds/src/types/data/family.type';
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

type SpouseAlertProps = {
  setInitialValues: () => void;
};

export const SpouseAlert = ({
  setInitialValues,
}: SpouseAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const spouseOnEdit = usePdsStore((state) => state.spouseOnEdit);
  const setSpouseOnEdit = usePdsStore((state) => state.setSpouseOnEdit);
  const { notify } = useContext(NotificationContext);
  const pds = getPds(usePdsStore((state) => state));
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const spouse = usePdsStore((state) => state.spouse);
  const setSpouse = usePdsStore((state) => state.setSpouse);

  const { trigger } = useFormContext<SpouseForm>();

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? "Spouse's Information Updated!"
          : action === 'info'
          ? "All changes in Spouse's Information are reverted!"
          : action === 'error'
          ? "Spouse's Information not updated!"
          : null}
      </Toast>
    );
  };

  const trimValues = async () => {
    setSpouse({
      ...spouse,
      lastName: trimmer(spouse.lastName),
      firstName: trimmer(spouse.firstName),
      middleName: trimmer(spouse.middleName),
      nameExtension: trimmer(spouse.nameExtension),
      employer: trimmer(spouse.employer),
      businessAddress: trimmer(spouse.businessAddress),
      telephoneNumber: trimmer(spouse.telephoneNumber),
      occupation: trimmer(spouse.occupation),
    });
  };

  // triggers validation upon firing submit update
  const submitUpdate = async () => {
    const isSubmitValid = await trigger(
      [
        'spouseLName',
        'spouseFName',
        'spouseMName',
        'spouseNameExt',
        'spouseBusAddr',
        'spouseEmpBusName',
        'spouseTelNo',
        'spouseOccupation',
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
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/family/spouse/${employeeDetails.user._id}`,
        pds.spouse
      );

      setInitialPdsState({ ...initialPdsState, spouse: pds.spouse });
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const alertCancelAction = () => {
    setInitialValues();
    addNotification(Actions.INFO);
    setSpouseOnEdit(false);
    setAlertCancelIsOpen(false);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setSpouseOnEdit(false);
    const getUpdate = await updateSection();
    addNotification(getUpdate);
  };

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Spouse&apos;s Information? This action is
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
            your Spouse&apos;s Information?
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
          {spouseOnEdit && (
            <div className="flex gap-4">
              <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
              <UpdateCardBtn action={submitUpdate} />
            </div>
          )}
          {!spouseOnEdit && (
            <EditCardBtn action={() => setSpouseOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
