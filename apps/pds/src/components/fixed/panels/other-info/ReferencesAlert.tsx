/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Alert } from '@gscwd-apps/oneui';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';
import { usePdsStore } from 'apps/pds/src/store/pds.store';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
import axios from 'axios';
import { useContext, useState } from 'react';
import { HiPencil } from 'react-icons/hi';
import { IoIosSave } from 'react-icons/io';
import { Actions } from '../../../../../utils/helpers/enums/toast.enum';
import { getPds } from '../../../../../utils/helpers/pds.helper';
import { Button } from '../../../modular/buttons/Button';
import { AlertDesc } from '../../alerts/AlertDesc';
import { Toast } from '../../toast/Toast';
import { AssignReferencesForUpdate } from './utils/functions';

type ReferencesAlertProps = {
  setInitialValues: () => void;
};

export const ReferencesAlert = ({ setInitialValues }: ReferencesAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const deletedReferences = useUpdatePdsStore((state) => state.deletedReferences);
  const pds = getPds(usePdsStore((state) => state));
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const referencesOnEdit = usePdsStore((state) => state.referencesOnEdit);
  const setReferencesOnEdit = usePdsStore((state) => state.setReferencesOnEdit);
  const { notify } = useContext(NotificationContext);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const references = usePdsStore((state) => state.references);
  const setReferences = usePdsStore((state) => state.setReferences);

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast variant={action} dismissAction={() => notify.dismiss(notification.id)}>
        {action === 'success'
          ? 'References Updated!'
          : action === 'info'
          ? 'All changes in References are reverted!'
          : action === 'error'
          ? 'Problem encountered. References not updated!'
          : null}
      </Toast>
    );
  };

  const updateSection = async () => {
    const allReferences = await AssignReferencesForUpdate(pds.references);

    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/references/${employeeDetails.user._id}`, {
        add: allReferences.add,
        update: allReferences.update,
        delete: deletedReferences,
      });
      setReferences(data);
      setInitialPdsState({ ...initialPdsState, references: data });
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const alertCancelAction = () => {
    setInitialValues();
    setReferencesOnEdit!(false);
    setAlertCancelIsOpen(false);
    addNotification(Actions.INFO);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setReferencesOnEdit!(false);
    const getUpdate = await updateSection();
    addNotification(getUpdate);
  };

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>Do you want to update your References? This action is irreversible.</AlertDesc>
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
          <AlertDesc>Are you sure you want to cancel the changes that you have made to your References?</AlertDesc>
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
          {referencesOnEdit && (
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
                  muted={references.length < 3 ? true : false}
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
          {!referencesOnEdit && (
            <>
              <Button
                onClick={() => setReferencesOnEdit!(true)}
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
