/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { isEmpty, isEqual } from 'lodash';
import { HiSearch } from 'react-icons/hi';
import {
  Competency,
  DutiesResponsibilitiesList,
  DutyResponsibility,
  DutyResponsibilityList,
  UpdatedDRCD,
} from '../../../types/dr.type';
import { postData, patchData } from '../../../utils/hoc/axios';
import { DRModalController } from '../../../components/fixed/dr/DRModalController';
import { SideNav } from '../../../components/fixed/nav/SideNav';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { useDrStore } from '../../../store/dr.store';
import { DrcTabs } from '../../../components/fixed/dr/DrcTabs';
import { DrcTabWindow } from '../../../components/fixed/dr/DRCTabWindow';
import { useEmployeeStore } from '../../../store/employee.store';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import {
  getUserDetails,
  withCookieSession,
  withSession,
} from '../../../utils/helpers/session';
import { Alert, Button, Modal } from '@gscwd-apps/oneui';
import { SpinnerDotted } from 'spinners-react';
import { DRAlertController } from '../../../components/fixed/dr/DRAlertController';
import {
  AssignUpdatedDrcs,
  CompetencyChecker,
  DrcChecker,
  UpdateDrcPool,
  UpdateFinalDrcs,
} from '../../../components/fixed/dr/utils/functions';
import {
  patchHRIS,
  postHRIS,
} from 'apps/portal/src/utils/helpers/fetchers/HRIS-axios-helper';
import { boolean } from 'yup';

export default function DR({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // get state of position that is selected
  const selectedPosition = useDrStore((state) => state.selectedPosition);

  // selector
  const {
    PostPositionResponse,
    UpdatePositionResponse,
    PostPosition,
    PostPositionFail,
    PostPositionSuccess,
    UpdatePosition,
    UpdatePositionSuccess,
    UpdatePositionFail,
  } = useDrStore((state) => ({
    // PostPosition: state.,
    PostPositionResponse: state.position.postResponse,
    UpdatePositionResponse: state.position.updateResponse,
    PostPosition: state.postPosition,
    PostPositionSuccess: state.postPositionSuccess,
    PostPositionFail: state.postPositionFail,
    UpdatePosition: state.updatePosition,
    UpdatePositionSuccess: state.updatePositionSuccess,
    UpdatePositionFail: state.updatePositionFail,
  }));

  // get state for all DR pool
  const allDRCPool = useDrStore((state) => state.allDRCPool);

  // get state of DRs that are selected
  const selectedDRCs = useDrStore((state) => state.selectedDRCs);

  // get state of checked DRs, same with selected but only executed when final
  const checkedDRCs = useDrStore((state) => state.checkedDRCs);

  // get state of dr type
  const selectedDRCType = useDrStore((state) => state.selectedDRCType);

  // get state of filtered drs
  const filteredDRCs = useDrStore((state) => state.filteredDRCs);

  // get employee
  const employee = useEmployeeStore((state) => state.employeeDetails);

  // get tab
  const tab = useDrStore((state) => state.tab);

  // get state for handling position modal page
  const modal = useDrStore((state) => state.modal);

  // get action from store
  const action = useDrStore((state) => state.action);

  // set state for error
  const error = useDrStore((state) => state.error);

  // get state for DRCs during first load
  const selectedDRCsOnLoad = useDrStore((state) => state.selectedDRCsOnLoad);

  // set state for handling position modal page
  const setModal = useDrStore((state) => state.setModal);

  // get state for error
  const setError = useDrStore((state) => state.setError);

  // pool initial load
  const setPoolInitialLoad = useDrStore((state) => state.setPoolInitialLoad);

  // pool is filled in
  const setDrcPoolIsFilled = useDrStore((state) => state.setDrcPoolIsFilled);

  // set state of position that is selected
  const setSelectedPosition = useDrStore((state) => state.setSelectedPosition);

  // set state for original pool
  const setOriginalPool = useDrStore((state) => state.setOriginalPool);

  // set drcds for updating from store
  const setDrcdsForUpdating = useDrStore((state) => state.setDrcdsForUpdating);

  const setDRCisLoaded = useDrStore((state) => state.setDRCisLoaded);

  // set state of dr type
  const setSelectedDRCType = useDrStore((state) => state.setSelectedDRCType);

  // set state of filtered drs
  const setFilteredDRCs = useDrStore((state) => state.setFilteredDRCs);

  const setEmployee = useEmployeeStore((state) => state.setEmployeeDetails);

  // set state of DRs that are selected
  const setSelectedDRCs = useDrStore((state) => state.setSelectedDRCs);

  // set state of checked DRs, same with selected but only executed when final
  const setCheckedDRCs = useDrStore((state) => state.setCheckedDRCs);

  // set state for all DR pool
  const setAllDRCPool = useDrStore((state) => state.setAllDRCPool);

  // set state for dr pool is empty because all are selected
  const setDrcPoolIsEmpty = useDrStore((state) => state.setDrcPoolIsEmpty);

  // set filtered positions
  const setFilteredPositions = useDrStore(
    (state) => state.setFilteredPositions
  );

  // all positions
  const allPositions = useDrStore((state) => state.allPositions);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // alert
  const alert = useDrStore((state) => state.alert);

  const setAlert = useDrStore((state) => state.setAlert);

  // set modal main modal action (confirm)
  const modalPosAction = async () => {
    // select positions page
    if (modal.page === 1) {
      // check if there are no selected positions
      selectedPosition
        ? // set error if no selected positions
          setError({
            isError: true,
            errorMessage: 'Select at least 1 position to proceed',
          })
        : // otherwise, go to next page
          !error.isError && setModal({ ...modal, page: modal.page + 1 });
      // DRCs page
    } else if (modal.page === 2) {
      // create an empty array
      setModal({ ...modal, page: 4 });
    }
    // select DRCs page
    else if (modal.page === 3) {
      // const updatedDRPool = await updateDRPool(allDRCPool, selectedDRCs, checkedDRCs, selectedDRCType);

      const updatedDRPool = await UpdateDrcPool(
        allDRCPool,
        selectedDRCs,
        checkedDRCs
      );

      setAllDRCPool(updatedDRPool.newDRPool);

      setSelectedDRCs({
        core: updatedDRPool.tempCoreCheckedDRs,
        support: updatedDRPool.tempSupportCheckedDRs,
      });

      setFilteredDRCs(updatedDRPool.newDRPool);

      setCheckedDRCs({ ...checkedDRCs, core: [], support: [] });

      setSelectedDRCType('');
      // const post = axios.post(`${process.env.NEXT_PUBLIC_HRIS_URL}`)
      !error.isError && setModal({ ...modal, page: 2 });
    }
    // summary page
    else if (modal.page === 4) {
      // setModal({ ...modal, page: 5 });
      setAlert({ ...alert, isOpen: true, page: 1 });
    }
  };

  // set modal position cancel action
  const cancelDRModal = () => {
    if (modal.page === 1) closeDrModal(); // closes the modal
    else if (modal.page === 2) {
      setStateDefaultValues(); // sets the state default values
      setModal({ ...modal, page: modal.page - 1 });
    } else if (modal.page === 3) {
      // since the action is "cancel", all actions made should also return to the previous state
      setCheckedDRCs({ core: [], support: [] });
      const updatedFilteredDRs = [...filteredDRCs];
      updatedFilteredDRs.map((dr: DutyResponsibility) => {
        dr.state = false;
        dr.competency = {} as Competency;
        dr.percentage = 0;
      });
      setFilteredDRCs(updatedFilteredDRs);

      setModal({ ...modal, page: modal.page - 1 });
    } else if (modal.page === 4) {
      setModal({ ...modal, page: 2 });
    } else closeDrModal();
  };

  const handlePostData = async (data: {
    finalCoreDRList: Array<DutyResponsibilityList>;
    finalSupportDRList: Array<DutyResponsibilityList>;
  }) => {
    // axios request for post
    const { error, result } = await postHRIS(
      `/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/${selectedPosition.positionId}`,
      {
        core: data.finalCoreDRList,
        support: data.finalSupportDRList,
      }
    );

    if (error) {
      // request is done so set loading to false
      PostPosition(false);

      // set value for error message
      PostPositionFail(false, result);
    } else {
      // request is done so set loading to false
      PostPosition(false);

      // set value from returned response
      PostPositionSuccess(false, result);
    }
  };

  const handleUpdateData = async (drcds: {
    forUpdating: UpdatedDRCD;
    forPosting: DutiesResponsibilitiesList;
  }) => {
    //
    let isSuccess: { update: boolean; post: boolean } = {
      update: true,
      post: true,
    };
    // patch
    if (!isEmpty(drcds.forUpdating)) {
      const { error } = await patchHRIS(
        `/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/${selectedPosition.positionId}`, //! Change employee
        drcds.forUpdating
      );

      // return true if success
      if (error) {
        isSuccess = { ...isSuccess, update: false };
      } else {
        isSuccess = { ...isSuccess, update: true };
      }
    }

    // new drc for the selected position
    if (!isEmpty(drcds.forPosting)) {
      const { error } = await postHRIS(
        `/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/${selectedPosition.positionId}`, //! Change employee
        drcds.forPosting
      );

      // return true if success
      if (error) {
        isSuccess = { ...isSuccess, post: false };
      } else {
        isSuccess = { ...isSuccess, post: true };
      }
    }

    if (isSuccess.post === false || isSuccess.update === false) {
      // request is done so set loading to false
      UpdatePosition(false);
    }
  };

  const alertAction = async () => {
    if (alert.page === 1) {
      if (action === 'create') {
        // set loading to true
        PostPosition(true);

        // const finalDRCs = await updateFinalDRs(selectedDRCs);
        const finalDRCs = await UpdateFinalDrcs(selectedDRCs);

        // const { error, result } = await postData(
        //   `${process.env.NEXT_PUBLIC_HRIS_URL}/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/${selectedPosition.positionId}`,
        //   {
        //     core: finalDRCs.finalCoreDRList,
        //     support: finalDRCs.finalSupportDRList,
        //   }
        // );

        // handle post for create
        handlePostData(finalDRCs);
      } else if (action === 'update') {
        // set loading to true
        UpdatePosition(true);

        // const drcds = await assignUpdatedDRCs(selectedDRCs.core, selectedDRCs.support, allDRCPool);
        const drcds = await AssignUpdatedDrcs(
          selectedDRCs.core,
          selectedDRCs.support,
          allDRCPool
        );

        // handle update
        handleUpdateData(drcds);

        // // patch
        // if (!isEmpty(drcds.forUpdating)) {
        //   await patchData(
        //     `${process.env.NEXT_PUBLIC_HRIS_URL}/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/${selectedPosition.positionId}`, //! Change employee
        //     drcds.forUpdating
        //   );
        // }

        // // new drc for the selected position
        // if (!isEmpty(drcds.forPosting)) {
        //   await postData(
        //     `${process.env.NEXT_PUBLIC_HRIS_URL}/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/${selectedPosition.positionId}`, //! Change employee
        //     drcds.forPosting
        //   );
        // }
      }

      setAlert({ ...alert, page: 2 });
    } else if (alert.page === 2) {
      setStateDefaultValues();
      setModal({ ...modal, isOpen: false });
      setIsLoading(true);
      setAlert({ ...alert, isOpen: false });
    }
  };

  // open alert
  const openAlert = () => {
    setAlert({ ...alert, isOpen: true });
  };

  const openDRModal = () => {
    // open the DR modal
    setModal({ ...modal, page: 1, isOpen: true });

    // set all states to their default
    setStateDefaultValues();
  };

  const closeDrModal = () => {
    // close the dr modal
    setModal({ ...modal, page: 1, isOpen: false });
    setStateDefaultValues();

    // setDRCisLoaded(false)
  };

  const setPoolUnselected = () => {
    allDRCPool.map((dr: DutyResponsibility) => {
      dr.state = false;
      dr.onEdit = false;
    });
  };

  const setStateDefaultValues = () => {
    // remove all selected positions
    setSelectedPosition({
      ...selectedPosition,
      positionId: '',
      itemNumber: '',
      positionTitle: '',
    });
    setDrcPoolIsEmpty(false);
    setPoolInitialLoad(false);
    setDrcPoolIsFilled(false);
    setFilteredPositions(allPositions);
    setOriginalPool([]);
    setIsLoading(true);
    setSelectedDRCType('');
    setPoolUnselected();
    setDRCisLoaded(false);
    setFilteredDRCs([]);
    setAllDRCPool([]);
    // setIsLoading(true)
    setSelectedDRCs({ core: [], support: [] });
    setDrcdsForUpdating({ core: [], support: [], deleted: [] });
  };

  useEffect(() => {
    setEmployee(employeeDetails);
  }, []);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isLoading]);

  return (
    <>
      <Head>
        <title>Setup Duties and Responsibilities</title>
      </Head>

      <SideNav />

      <Modal
        open={modal.isOpen}
        setOpen={() => setModal({ ...modal })}
        size={modal.page !== 6 ? 'xl' : 'sm'}
        steady
      >
        <Modal.Header>
          <div className="px-5">
            <h3 className="text-xl font-semibold text-gray-700">
              {modal.page === 6
                ? 'Setting Successful'
                : 'Set Duties, Responsibilities, and Competencies'}
            </h3>
            <p>
              {modal.page === 1
                ? 'Select a position title'
                : modal.page === 2
                ? 'Add core or support'
                : modal.page === 3
                ? `${selectedPosition.positionTitle}`
                : modal.page === 4 && 'Position Summary'}
            </p>
          </div>
        </Modal.Header>

        <Modal.Body>
          <DRModalController page={modal.page} action={action} />
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="w-[6rem]">
              {modal.page !== 6 && (
                <Button onClick={cancelDRModal} variant="info">
                  Cancel
                </Button>
              )}
            </div>
            {modal.page !== 1 ? (
              <div className="min-w-[6rem] max-w-auto">
                <Button
                  onClick={modalPosAction}
                  disabled={
                    modal.page === 2 &&
                    (DrcChecker(selectedDRCs).noPercentageCounter > 0 ||
                      DrcChecker(selectedDRCs).onEditCounter > 0 ||
                      (selectedDRCs.core.length === 0 &&
                        selectedDRCs.support.length === 0) ||
                      (selectedDRCs.core.length > 0 &&
                        (DrcChecker(selectedDRCs).coreTotal < 100 ||
                          DrcChecker(selectedDRCs).coreTotal > 100)) ||
                      DrcChecker(selectedDRCs).noCompetencyCounter > 0 ||
                      (selectedDRCs.support.length > 0 &&
                        (DrcChecker(selectedDRCs).supportTotal < 100 ||
                          DrcChecker(selectedDRCs).supportTotal > 100)) ||
                      isEqual(selectedDRCs, selectedDRCsOnLoad) === true)
                      ? true
                      : modal.page === 3 &&
                        selectedDRCType === 'core' &&
                        (checkedDRCs.core.length === 0 ||
                          (checkedDRCs.core.length > 0 &&
                            CompetencyChecker(checkedDRCs, selectedDRCType)
                              .noCoreCompetencyCounter > 0))
                      ? true
                      : // modal page 3 support
                      modal.page === 3 &&
                        selectedDRCType === 'support' &&
                        (checkedDRCs.support.length === 0 ||
                          (checkedDRCs.support.length > 0 &&
                            CompetencyChecker(checkedDRCs, selectedDRCType)
                              .noSupportCompetencyCounter > 0))
                      ? true
                      : // else
                        false
                  }
                >
                  {modal.page === 2
                    ? 'Confirm'
                    : modal.page === 3
                    ? 'Set'
                    : modal.page === 4
                    ? 'Confirm'
                    : modal.page === 5
                    ? 'Confirm'
                    : modal.page === 6 && 'Got it, thanks!'}
                </Button>
              </div>
            ) : null}
          </div>
        </Modal.Footer>
      </Modal>

      <Alert open={alert.isOpen} setOpen={openAlert}>
        <Alert.Description>
          <DRAlertController page={alert.page} />
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="flex gap-2">
            {alert.page === 1 && (
              <div className="w-[5rem]">
                <Button
                  variant="info"
                  onClick={() => setAlert({ ...alert, isOpen: false })}
                >
                  No
                </Button>
              </div>
            )}
            <div className="min-w-[5rem] max-w-auto">
              <Button onClick={alertAction}>
                {alert.page === 1 ? 'Yes' : 'Got it, Thanks!'}
              </Button>
            </div>
          </div>
        </Alert.Footer>
      </Alert>

      <MainContainer>
        <div className="w-full h-full px-32 ">
          <ContentHeader
            title="Position Duties, Responsibilities, & Competencies"
            subtitle="Set or Update"
          >
            <Button onClick={openDRModal}>
              <div className="flex items-center w-full gap-2">
                <HiSearch /> Find Position
              </div>
            </Button>
          </ContentHeader>
          {isLoading ? (
            <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
              <SpinnerDotted
                speed={70}
                thickness={70}
                className="flex w-full h-full transition-all "
                color="slateblue"
                size={100}
              />
            </div>
          ) : (
            <ContentBody>
              <>
                <div className="flex w-full">
                  <div className="w-[58rem]">
                    <DrcTabs tab={tab} />
                  </div>
                  <div className="w-full">
                    <DrcTabWindow
                      positionId={
                        employeeDetails.employmentDetails.assignment.positionId
                      }
                    />
                  </div>
                </div>
              </>
            </ContentBody>
          )}
        </div>
      </MainContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(
  async (context: GetServerSidePropsContext) => {
    const employeeDetails = getUserDetails();

    return { props: { employeeDetails } };
  }
);
