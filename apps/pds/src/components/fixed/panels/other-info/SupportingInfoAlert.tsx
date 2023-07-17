/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @nx/enforce-module-boundaries */
import { Alert } from '@gscwd-apps/oneui';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';
import { usePdsStore } from 'apps/pds/src/store/pds.store';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
import { SupportingDetailsForm } from 'apps/pds/src/types/data/supporting-info.type';
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
import { EditCardBtn } from '../../buttons/EditCardBtn';
import { UndoCardBtn } from '../../buttons/UndoCardBtn';
import { UpdateCardBtn } from '../../buttons/UpdateCardBtn';
import { Toast } from '../../toast/Toast';

type SupportingInfoAlertProps = {
  setInitialValues: () => void;
};

export const SupportingInfoAlert = ({
  setInitialValues,
}: SupportingInfoAlertProps): JSX.Element => {
  const [alertUpdateIsOpen, setAlertUpdateIsOpen] = useState<boolean>(false);
  const [alertCancelIsOpen, setAlertCancelIsOpen] = useState<boolean>(false);

  const deletedReferences = useUpdatePdsStore(
    (state) => state.deletedReferences
  );
  const officeRelation = usePdsStore((state) => state.officeRelation);
  const guiltyCharged = usePdsStore((state) => state.guiltyCharged);
  const convicted = usePdsStore((state) => state.convicted);
  const separatedService = usePdsStore((state) => state.separatedService);
  const candidateResigned = usePdsStore((state) => state.candidateResigned);
  const immigrant = usePdsStore((state) => state.immigrant);
  const indigenousPwdSoloParent = usePdsStore(
    (state) => state.indigenousPwdSoloParent
  );
  const supportingInfoOnEdit = usePdsStore(
    (state) => state.supportingInfoOnEdit
  );
  const pds = getPds(usePdsStore((state) => state));
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const allowQuestionsSave = useUpdatePdsStore(
    (state) => state.allowQuestionsSave
  );
  const setAllowQuestionsSave = useUpdatePdsStore(
    (state) => state.setAllowQuestionsSave
  );
  const setSupportingInfoOnEdit = usePdsStore(
    (state) => state.setSupportingInfoOnEdit
  );
  const { notify } = useContext(NotificationContext);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const setOfficeRelation = usePdsStore((state) => state.setOfficeRelation);
  const setGuiltyCharged = usePdsStore((state) => state.setGuiltyCharged);
  const setConvicted = usePdsStore((state) => state.setConvicted);
  const setSeparatedService = usePdsStore((state) => state.setSeparatedService);
  const setCandidateResigned = usePdsStore(
    (state) => state.setCandidateResigned
  );
  const setImmigrant = usePdsStore((state) => state.setImmigrant);
  const setIndigenousPwdSoloParent = usePdsStore(
    (state) => state.setIndigenousPwdSoloParent
  );
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const { trigger } = useFormContext<SupportingDetailsForm>();

  const addNotification = (action: Actions) => {
    const notification = notify.custom(
      <Toast
        variant={action}
        dismissAction={() => notify.dismiss(notification.id)}
      >
        {action === 'success'
          ? 'Questions Updated!'
          : action === 'info'
          ? 'All changes in Questions are reverted!'
          : action === 'error'
          ? 'Problem encountered. Questions not updated!'
          : null}
      </Toast>
    );
  };

  const submitUpdate = async () => {
    const isSubmitValid = await trigger(
      [
        'offRelDetails',
        'candidateDetails',
        'guiltyDetails',
        'chargedCaseStatus',
        'separatedDetails',
        'chargedDateFiled',
        'candidateDetails',
        'convictedDetails',
        'immigrantDetails',
        'resignedDetails',
        'pwdIdNumber',
        'soloParentIdNumber',
        'separatedDetails',
        'indigenousMemberDetails',
      ],
      { shouldFocus: true }
    );
    if (isSubmitValid === true) {
      setAlertUpdateIsOpen(true);
    } else setAlertUpdateIsOpen(false);
  };

  const updateSection = async () => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/supporting-details`,
        {
          officeRelation,
          guiltyCharged,
          convicted,
          candidateResigned,
          immigrant,
          indigenousPwdSoloParent,
          separatedService,
        }
      );

      // update the state of the object
      setOfficeRelation(data.officeRelation);
      setGuiltyCharged(data.guiltyCharged);
      setConvicted(data.convicted);
      setSeparatedService(data.separatedService);
      setCandidateResigned(data.candidateResigned);
      setImmigrant(data.immigrant);
      setIndigenousPwdSoloParent(data.indigenousPwdSoloParent);

      // set the initial state for default values
      setInitialPdsState({
        ...initialPdsState,
        officeRelation: data.officeRelation,
        guiltyCharged: data.guiltyCharged,
        convicted: data.convicted,
        separatedService: data.separatedService,
        candidateResigned: data.candidateResigned,
        immigrant: data.immigrant,
        indigenousPwdSoloParent: data.indigenousPwdSoloParent,
      });
      return Actions.SUCCESS;
    } catch (error) {
      return Actions.ERROR;
    }
  };

  const alertCancelAction = () => {
    setInitialValues();
    setSupportingInfoOnEdit!(false);
    setAlertCancelIsOpen(false);
    addNotification(Actions.INFO);
  };

  const alertUpdateAction = async () => {
    setAlertUpdateIsOpen(false);
    setSupportingInfoOnEdit!(false);
    const getUpdate = await updateSection();
    addNotification(getUpdate);
  };

  // this toggles the muted attribute for the save button during edit/update
  // useEffect(() => {
  //   // office relation
  //   if (
  //     supportingInfoOnEdit &&
  //     (officeRelation.withinThirdDegree === true ||
  //       officeRelation.withinFourthDegree === true) &&
  //     isEmpty(officeRelation.details)
  //   ) {
  //     setAllowQuestionsSave(false);
  //   }

  //   // guilty
  //   if (
  //     supportingInfoOnEdit &&
  //     guiltyCharged.isGuilty === true &&
  //     isEmpty(guiltyCharged.guiltyDetails)
  //   ) {
  //     setAllowQuestionsSave(false);
  //   }

  //   // charged
  //   if (
  //     supportingInfoOnEdit &&
  //     guiltyCharged.isCharged === true &&
  //     isEmpty(
  //       guiltyCharged.chargedDateFiled &&
  //         isEmpty(guiltyCharged.chargedCaseStatus)
  //     )
  //   ) {
  //     setAllowQuestionsSave(false);
  //   }

  //   // convicted
  //   if (
  //     supportingInfoOnEdit &&
  //     convicted.isConvicted === true &&
  //     isEmpty(convicted.details)
  //   ) {
  //     setAllowQuestionsSave(false);
  //   }

  //   // separated
  //   if (
  //     supportingInfoOnEdit &&
  //     separatedService.isSeparated === true &&
  //     isEmpty(separatedService.details)
  //   ) {
  //     setAllowQuestionsSave(false);
  //   }

  //   // candidate
  //   if (
  //     supportingInfoOnEdit &&
  //     candidateResigned.isCandidate === true &&
  //     isEmpty(candidateResigned.candidateDetails)
  //   ) {
  //     setAllowQuestionsSave(false);
  //   }

  //   // resigned
  //   if (
  //     supportingInfoOnEdit &&
  //     candidateResigned.isResigned === true &&
  //     isEmpty(candidateResigned.resignedDetails)
  //   ) {
  //     setAllowQuestionsSave(false);
  //   }

  //   // immigrant
  //   if (
  //     supportingInfoOnEdit &&
  //     immigrant.isImmigrant === true &&
  //     isEmpty(immigrant.details)
  //   ) {
  //     setAllowQuestionsSave(false);
  //   }

  //   // indigenous
  //   if (
  //     supportingInfoOnEdit &&
  //     indigenousPwdSoloParent.isIndigenousMember === true &&
  //     isEmpty(indigenousPwdSoloParent.indigenousMemberDetails)
  //   ) {
  //     setAllowQuestionsSave(false);
  //   }

  //   // pwd
  //   if (
  //     supportingInfoOnEdit &&
  //     indigenousPwdSoloParent.isPwd === true &&
  //     isEmpty(indigenousPwdSoloParent.pwdIdNumber)
  //   ) {
  //     setAllowQuestionsSave(false);
  //   }

  //   // solo parent
  //   if (
  //     supportingInfoOnEdit &&
  //     indigenousPwdSoloParent.isSoloParent === true &&
  //     isEmpty(indigenousPwdSoloParent.soloParentIdNumber)
  //   ) {
  //     setAllowQuestionsSave(false);
  //   }

  //   // this would not allow the user to save if the validation is not satisfied
  //   if (
  //     supportingInfoOnEdit === true &&
  //     // office relation
  //     (((officeRelation.withinFourthDegree === true ||
  //       officeRelation.withinThirdDegree === true) &&
  //       !isEmpty(officeRelation.details)) ||
  //       (officeRelation.withinFourthDegree === false &&
  //         officeRelation.withinThirdDegree === false)) &&
  //     // is guilty
  //     ((guiltyCharged.isGuilty === true &&
  //       !isEmpty(guiltyCharged.guiltyDetails)) ||
  //       guiltyCharged.isGuilty === false) &&
  //     // is charged
  //     ((guiltyCharged.isCharged === true &&
  //       !isEmpty(guiltyCharged.chargedCaseStatus) &&
  //       !isEmpty(guiltyCharged.chargedDateFiled)) ||
  //       guiltyCharged.isCharged === false) &&
  //     // is convicted
  //     ((convicted.isConvicted === true && !isEmpty(convicted.details)) ||
  //       convicted.isConvicted === false) &&
  //     // is separated from service
  //     ((separatedService.isSeparated === true &&
  //       !isEmpty(separatedService.details)) ||
  //       separatedService.isSeparated === false) &&
  //     // is candidate
  //     ((candidateResigned.isCandidate === true &&
  //       !isEmpty(candidateResigned.candidateDetails)) ||
  //       candidateResigned.isCandidate === false) &&
  //     // is resigned
  //     ((candidateResigned.isResigned === true &&
  //       !isEmpty(candidateResigned.resignedDetails)) ||
  //       candidateResigned.isResigned === false) &&
  //     // is immigrant
  //     ((immigrant.isImmigrant === true && !isEmpty(immigrant.details)) ||
  //       immigrant.isImmigrant === false) &&
  //     // is indigenous
  //     ((indigenousPwdSoloParent.isIndigenousMember === true &&
  //       !isEmpty(indigenousPwdSoloParent.indigenousMemberDetails)) ||
  //       indigenousPwdSoloParent.isIndigenousMember === false) &&
  //     // is pwd
  //     ((indigenousPwdSoloParent.isPwd === true &&
  //       !isEmpty(indigenousPwdSoloParent.pwdIdNumber)) ||
  //       indigenousPwdSoloParent.isPwd === false) &&
  //     // is solo parent
  //     ((indigenousPwdSoloParent.isSoloParent === true &&
  //       !isEmpty(indigenousPwdSoloParent.soloParentIdNumber)) ||
  //       indigenousPwdSoloParent.isSoloParent === false)
  //   ) {
  //     setAllowQuestionsSave(true);
  //   }
  // }, [
  //   supportingInfoOnEdit,
  //   officeRelation,
  //   guiltyCharged,
  //   convicted,
  //   separatedService,
  //   candidateResigned,
  //   immigrant,
  //   indigenousPwdSoloParent,
  // ]);

  return (
    <>
      <Alert open={alertUpdateIsOpen} setOpen={setAlertUpdateIsOpen}>
        <Alert.Description>
          <AlertDesc>
            Do you want to update your Questions? This action is irreversible.
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
            your Questions?
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
          {supportingInfoOnEdit && (
            <>
              <div className="flex gap-4">
                <UndoCardBtn action={() => setAlertCancelIsOpen(true)} />
                <UpdateCardBtn action={submitUpdate} />
              </div>
            </>
          )}
          {!supportingInfoOnEdit && (
            <EditCardBtn action={() => setSupportingInfoOnEdit!(true)} />
          )}
        </div>
      )}
    </>
  );
};
