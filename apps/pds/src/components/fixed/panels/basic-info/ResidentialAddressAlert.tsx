/* eslint-disable @nx/enforce-module-boundaries */
import { Alert } from '@gscwd-apps/oneui';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';
import { usePdsStore } from 'apps/pds/src/store/pds.store';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
import { trimmer } from 'apps/pds/utils/functions/trimmer';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { useContext, useEffect, useState } from 'react';
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

type ResidentialAddressAlertProps = {
  setInitialValues: () => void;
};

type Return = {
  actions: Actions;
  duo: boolean;
};

export const ResidentialAddressAlert = ({
  setInitialValues,
}: ResidentialAddressAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const residentialAddressOnEdit = usePdsStore(
    (state) => state.residentialAddressOnEdit
  );
  const setResidentialAddressOnEdit = usePdsStore(
    (state) => state.setResidentialAddressOnEdit
  );
  const { notify } = useContext(NotificationContext);
  const checkboxAddress = usePdsStore((state) => state.checkboxAddress);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const pds = getPds(usePdsStore((state) => state));
  const allowResidentialAddressSave = useUpdatePdsStore(
    (state) => state.allowResidentialAddressSave
  );
  const setAllowResidentialAddressSave = useUpdatePdsStore(
    (state) => state.setAllowResidentialAddressSave
  );
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const residentialAddress = usePdsStore((state) => state.residentialAddress);
  const setResidentialAddress = usePdsStore(
    (state) => state.setResidentialAddress
  );

  const addNotification = (action: Actions, bothAddressesUpdated: boolean) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success' && bothAddressesUpdated === false
          ? 'Residential Address Updated!'
          : action === 'success' && bothAddressesUpdated
          ? 'Residential and Permanent Address Updated!'
          : action === 'info'
          ? 'All changes in Residential Address are reverted!'
          : action === 'error'
          ? 'Residential Address not updated!'
          : null}
      </Toast>
    );
  };

  const updateSection = async (): Promise<Return> => {
    const { provCode, cityCode, brgyCode, ...rest } = pds.residentialAddress;
    await trimValues();
    if (checkboxAddress === true) {
      const { status } = await axios.put(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/basic/residential-address/${employeeDetails.user._id}/same-permanent`,
        rest
      );
      if (status === 200) {
        setInitialPdsState({
          ...initialPdsState,
          residentialAddress: pds.residentialAddress,
          permanentAddress: pds.permanentAddress,
        });
        return { actions: Actions.SUCCESS, duo: true };
      } else return { actions: Actions.ERROR, duo: false };
    } else if (checkboxAddress === false) {
      const { status } = await axios.put(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/basic/residential-address/${employeeDetails.user._id}`,
        rest
      );

      if (status === 200) {
        setInitialPdsState({
          ...initialPdsState,
          residentialAddress: pds.residentialAddress,
        });
        return { actions: Actions.SUCCESS, duo: false };
      } else return { actions: Actions.ERROR, duo: false };
    } else return { actions: Actions.ERROR, duo: false };
  };

  const trimValues = async () => {
    setResidentialAddress({
      ...residentialAddress,
      houseNumber: trimmer(residentialAddress.houseNumber),
      street: trimmer(residentialAddress.street),
      subdivision: trimmer(residentialAddress.subdivision),
    });
  };

  const alertCancelAction = () => {
    setInitialValues();
    addNotification(Actions.INFO, false);
    setResidentialAddressOnEdit!(false);
    setAlertCancelIsOpen(false);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setResidentialAddressOnEdit!(false);
    const getUpdate = await updateSection();
    addNotification(getUpdate.actions, getUpdate.duo);
  };

  useEffect(() => {
    if (
      isEmpty(residentialAddress.houseNumber) ||
      isEmpty(residentialAddress.street) ||
      isEmpty(residentialAddress.subdivision) ||
      isEmpty(residentialAddress.province) ||
      isEmpty(residentialAddress.city) ||
      isEmpty(residentialAddress.barangay)
    ) {
      setAllowResidentialAddressSave(false);
    } else if (
      !isEmpty(residentialAddress.houseNumber) &&
      !isEmpty(residentialAddress.street) &&
      !isEmpty(residentialAddress.subdivision) &&
      !isEmpty(residentialAddress.province) &&
      !isEmpty(residentialAddress.city) &&
      !isEmpty(residentialAddress.barangay)
    ) {
      setAllowResidentialAddressSave(true);
    }
  }, [residentialAddress]);

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          {checkboxAddress ? (
            <AlertDesc>
              Do you want to update your Residential Address? This will update
              both of your addresses since the checkbox same address is ticked.
            </AlertDesc>
          ) : (
            <AlertDesc>
              Do you want to update your Residential Address? This action is
              irreversible.
            </AlertDesc>
          )}
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
            your Residential Address?
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
          {residentialAddressOnEdit && (
            <>
              <div className="flex gap-4">
                <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
                <UpdateCardBtn action={() => setAlertUpdateIsOpen(true)} />
              </div>
            </>
          )}
          {!residentialAddressOnEdit && (
            <EditCardBtn action={() => setResidentialAddressOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
