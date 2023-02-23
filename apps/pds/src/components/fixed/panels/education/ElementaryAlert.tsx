import { Alert, NotificationController, useNotification } from '@ericsison-dev/my-ui';
import axios from 'axios';
import { AlertDesc } from 'components/fixed/alerts/AlertDesc';
import { Toast } from 'components/fixed/toast/Toast';
import { Button } from 'components/modular/buttons/Button';
import { NotificationContext } from 'context/NotificationContext';
import { isEmpty } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { HiPencil } from 'react-icons/hi';
import { IoIosSave } from 'react-icons/io';
import { useEmployeeStore } from 'store/employee.store';
import { usePdsStore } from 'store/pds.store';
import { useUpdatePdsStore } from 'store/update-pds.store';
import { Actions } from '../../../../../utils/helpers/enums/toast.enum';
import { getPds } from '../../../../../utils/helpers/pds.helper';

type ElementaryAlertProps = {
  setInitialValues: () => void;
};

export const ElementaryAlert = ({ setInitialValues }: ElementaryAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const elementaryOnEdit = usePdsStore((state) => state.elementaryOnEdit);
  const setElementaryOnEdit = usePdsStore((state) => state.setElementaryOnEdit);
  const { notify } = useContext(NotificationContext);
  const pds = getPds(usePdsStore((state) => state));
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const allowElementarySave = useUpdatePdsStore((state) => state.allowElementarySave);
  const setAllowElementarySave = useUpdatePdsStore((state) => state.setAllowElementarySave);
  const elementary = usePdsStore((state) => state.elementary);

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast variant={action} dismissAction={() => notify.dismiss(notification.id)}>
        {action === 'success'
          ? 'Elementary Education Updated!'
          : action === 'info'
          ? 'All changes in Elementary Education are reverted!'
          : action === 'error'
          ? 'Elementary Education not updated!'
          : null}
      </Toast>
    );
  };

  const updateSection = async () => {
    const { isGraduated, isOngoing, ...rest } = pds.elementary;

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/education/elementary/${employeeDetails.user._id}`, rest);
      setInitialPdsState({ ...initialPdsState, elementary: rest });
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const alertCancelAction = () => {
    setInitialValues();
    addNotification(Actions.INFO);
    setElementaryOnEdit!(false);
    setAlertCancelIsOpen(false);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setElementaryOnEdit!(false);
    const getUpdate = await updateSection();
    addNotification(getUpdate);
  };

  useEffect(() => {
    if (
      elementaryOnEdit &&
      (isEmpty(elementary.schoolName) ||
        isEmpty(elementary.degree) ||
        isEmpty(elementary.from) ||
        isEmpty(elementary.to) ||
        isEmpty(elementary.units) ||
        isEmpty(elementary.awards))
    ) {
      setAllowElementarySave(false);
    }

    if (
      elementaryOnEdit &&
      !isEmpty(elementary.schoolName) &&
      !isEmpty(elementary.degree) &&
      !isEmpty(elementary.from!.toString()) &&
      !isEmpty(elementary.to!.toString()) &&
      elementary.from! < elementary.to! &&
      elementary.from?.toString().length === 4 &&
      elementary.to?.toString().length === 4 &&
      !isEmpty(elementary.units) &&
      !isEmpty(elementary.awards)
    ) {
      setAllowElementarySave(true);
    }
  }, [elementaryOnEdit, elementary]);

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>Do you want to update your Elementary Education? This action is irreversible.</AlertDesc>
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="w-full rounded border border-gray-300">
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
          <AlertDesc>Are you sure you want to cancel the changes that you have made to your Elementary Education?</AlertDesc>
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="w-full rounded border border-gray-300">
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
          {elementaryOnEdit && (
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
                        className="h-6 w-6"
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
                  muted={allowElementarySave ? false : true}
                >
                  <div className="flex items-center text-indigo-600 hover:text-indigo-800">
                    <IoIosSave size={20} />
                    <span>Update</span>
                  </div>
                </Button>
              </div>
            </>
          )}
          {!elementaryOnEdit && (
            <>
              <Button
                onClick={() => setElementaryOnEdit!(true)}
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
