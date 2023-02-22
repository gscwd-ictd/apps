/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Alert } from '@gscwd-apps/oneui';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';
import { usePdsStore } from 'apps/pds/src/store/pds.store';
import axios from 'axios';
import { useContext, useState } from 'react';
import { HiPencil } from 'react-icons/hi';
import { IoIosSave } from 'react-icons/io';
import { Actions } from '../../../../../utils/helpers/enums/toast.enum';
import { getPds } from '../../../../../utils/helpers/pds.helper';
import { Button } from '../../../modular/buttons/Button';
import { AlertDesc } from '../../alerts/AlertDesc';
import { Toast } from '../../toast/Toast';

type ResidentialAddressAlertProps = {
  setInitialValues: () => void;
};

type Return = {
  actions: Actions;
  duo: boolean;
};

export const ResidentialAddressAlert = ({ setInitialValues }: ResidentialAddressAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const residentialAddressOnEdit = usePdsStore((state) => state.residentialAddressOnEdit);
  const setResidentialAddressOnEdit = usePdsStore((state) => state.setResidentialAddressOnEdit);
  const { notify } = useContext(NotificationContext);
  const checkboxAddress = usePdsStore((state) => state.checkboxAddress);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const pds = getPds(usePdsStore((state) => state));
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const addNotification = (action: Actions, bothAddressesUpdated: boolean) => {
    const notification = notify.custom(
      <Toast variant={action} dismissAction={() => notify.dismiss(notification.id)}>
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
    if (checkboxAddress === true) {
      const { status } = await axios.put(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/basic/residential-address/${employeeDetails.user._id}/same-permanent`,
        rest
      );
      if (status === 200) {
        setInitialPdsState({ ...initialPdsState, residentialAddress: pds.residentialAddress, permanentAddress: pds.permanentAddress });
        return { actions: Actions.SUCCESS, duo: true };
      } else return { actions: Actions.ERROR, duo: false };
    } else if (checkboxAddress === false) {
      const { status } = await axios.put(`${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/basic/residential-address/${employeeDetails.user._id}`, rest);

      if (status === 200) {
        setInitialPdsState({ ...initialPdsState, residentialAddress: pds.residentialAddress });
        return { actions: Actions.SUCCESS, duo: false };
      } else return { actions: Actions.ERROR, duo: false };
    } else return { actions: Actions.ERROR, duo: false };
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

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          {checkboxAddress ? (
            <AlertDesc>
              Do you want to update your Residential Address? This will update both of your addresses since the checkbox same address is ticked.
            </AlertDesc>
          ) : (
            <AlertDesc>Do you want to update your Residential Address? This action is irreversible.</AlertDesc>
          )}
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="w-full border border-gray-300 rounded">
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
          <AlertDesc>Are you sure you want to cancel the changes that you have made to your Residential Address?</AlertDesc>
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="w-full border border-gray-300 rounded">
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
          {residentialAddressOnEdit && (
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
                        className="w-6 h-6"
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
          {!residentialAddressOnEdit && (
            <>
              <Button
                onClick={() => setResidentialAddressOnEdit!(true)}
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
