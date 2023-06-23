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
import { Toast } from '../../toast/Toast';

type PermanentAddressAlertProps = {
  setInitialValues: () => void;
};

export const PermanentAddressAlert = ({
  setInitialValues,
}: PermanentAddressAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const permanentAddressOnEdit = usePdsStore(
    (state) => state.permanentAddressOnEdit
  );
  const setPermanentAddressOnEdit = usePdsStore(
    (state) => state.setPermanentAddressOnEdit
  );
  const { notify } = useContext(NotificationContext);
  const pds = getPds(usePdsStore((state) => state));
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const allowPermanentAddressSave = useUpdatePdsStore(
    (state) => state.allowPermanentAddressSave
  );
  const setAllowPermanentAddressSave = useUpdatePdsStore(
    (state) => state.setAllowPermanentAddressSave
  );
  const permanentAddress = usePdsStore((state) => state.permanentAddress);
  const setPermanentAddress = usePdsStore((state) => state.setPermanentAddress);

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? 'Permanent Address Updated!'
          : action === 'info'
          ? 'All changes in Permanent Address are reverted!'
          : action === 'error'
          ? 'Permanent Address not updated!'
          : null}
      </Toast>
    );
  };

  const updateSection = async () => {
    const { provCode, cityCode, brgyCode, ...rest } = pds.permanentAddress;

    try {
      await trimValues();
      await axios.put(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/basic/permanent-address/${employeeDetails.user._id}`,
        rest
      );
      setInitialPdsState({
        ...initialPdsState,
        permanentAddress: pds.permanentAddress,
      });
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const trimValues = async () => {
    setPermanentAddress({
      ...permanentAddress,
      houseNumber: trimmer(permanentAddress.houseNumber),
      street: trimmer(permanentAddress.street),
      subdivision: trimmer(permanentAddress.subdivision),
    });
  };

  const alertCancelAction = () => {
    setInitialValues();
    addNotification(Actions.INFO);
    setPermanentAddressOnEdit!(false);
    setAlertCancelIsOpen(false);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setPermanentAddressOnEdit!(false);
    const getUpdate = await updateSection();
    addNotification(getUpdate);
  };

  useEffect(() => {
    if (
      isEmpty(permanentAddress.houseNumber) ||
      isEmpty(permanentAddress.street) ||
      isEmpty(permanentAddress.subdivision) ||
      isEmpty(permanentAddress.province) ||
      isEmpty(permanentAddress.city) ||
      isEmpty(permanentAddress.barangay)
    ) {
      setAllowPermanentAddressSave(false);
    } else if (
      !isEmpty(permanentAddress.houseNumber) &&
      !isEmpty(permanentAddress.street) &&
      !isEmpty(permanentAddress.subdivision) &&
      !isEmpty(permanentAddress.province) &&
      !isEmpty(permanentAddress.city) &&
      !isEmpty(permanentAddress.barangay)
    ) {
      setAllowPermanentAddressSave(true);
    }
  }, [permanentAddress]);

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Permanent Address? This action is
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
            your Permanent Address?
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
          {permanentAddressOnEdit && (
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
                  muted={allowPermanentAddressSave ? false : true}
                >
                  <div className="flex items-center text-indigo-600 hover:text-indigo-800">
                    <IoIosSave size={20} />
                    <span>Update</span>
                  </div>
                </Button>
              </div>
            </>
          )}
          {!permanentAddressOnEdit && (
            <>
              <Button
                onClick={() => setPermanentAddressOnEdit!(true)}
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
