/* eslint-disable @nx/enforce-module-boundaries */
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
import { EditCardBtn } from '../../buttons/EditCardBtn';
import { UndoCardBtn } from '../../buttons/UndoCardBtn';
import { UpdateCardBtn } from '../../buttons/UpdateCardBtn';
import { Toast } from '../../toast/Toast';
import { AssignChildrenToUpdate } from './utils/functions';

type ChildrenAlertProps = {
  setInitialValues: () => void;
};

export const ChildrenAlert = ({
  setInitialValues,
}: ChildrenAlertProps): JSX.Element => {
  const pds = getPds(usePdsStore((state) => state));
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const childrenOnEdit = usePdsStore((state) => state.childrenOnEdit);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const deletedChildren = useUpdatePdsStore((state) => state.deletedChildren);
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);
  const { notify } = useContext(NotificationContext);
  const setChildren = usePdsStore((state) => state.setChildren);
  const setChildrenOnEdit = usePdsStore((state) => state.setChildrenOnEdit);
  const setDeletedChildren = useUpdatePdsStore(
    (state) => state.setDeletedChildren
  );
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? "Children's Information Updated!"
          : action === 'info'
          ? "All changes in Children's Information are reverted!"
          : action === 'error'
          ? "Children's Information not updated!"
          : null}
      </Toast>
    );
  };

  const updateSection = async () => {
    // call this function to create a new array for the list of children for posting and also combine them with deleted children
    const allUpdatedChildren = await AssignChildrenToUpdate(pds.children);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/family/children/${employeeDetails.user._id}`,
        {
          add: allUpdatedChildren.add,
          update: allUpdatedChildren.update,
          delete: deletedChildren,
        }
      );
      setChildren(data);
      setDeletedChildren([]);
      setInitialPdsState({ ...initialPdsState, children: data });
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const alertCancelAction = () => {
    setInitialValues();
    addNotification(Actions.INFO);
    setChildrenOnEdit!(false);
    setAlertCancelIsOpen(false);
    setDeletedChildren([]);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setChildrenOnEdit!(false);
    const getUpdate = await updateSection();
    addNotification(getUpdate);
  };

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Children&apos;s Information? This action
            is irreversible.
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
            your Children&apos;s Information?
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
          {childrenOnEdit && (
            <>
              <div className="flex gap-4">
                <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
                <UpdateCardBtn action={() => setAlertUpdateIsOpen(true)} />
              </div>
            </>
          )}
          {!childrenOnEdit && (
            <EditCardBtn action={() => setChildrenOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
