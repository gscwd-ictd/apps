import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { HiPuzzle } from 'react-icons/hi';
import useSWR from 'swr';

import { useDrStore } from '../../../store/dr.store';
import { useEmployeeStore } from '../../../store/employee.store';
import {
  DutyResponsibility,
  DutiesResponsibilities,
  Competency,
} from '../../../types/dr.type';
import { Button } from '../../modular/common/forms/Button';
import LoadingVisual from '../loading/LoadingVisual';
import { DRModalLoading } from './DRModalLoading';
import { SelectedCoreDRs } from './SelectedCoreDRs';
import { SelectedSupportDRs } from './SelectedSupportDRs';

export const DRModalSetting = (): JSX.Element => {
  // get all related data from dr context

  const selectedPosition = useDrStore((state) => state.selectedPosition);

  const drcPoolIsFilled = useDrStore((state) => state.drcPoolIsFilled);

  const DRCIsLoaded = useDrStore((state) => state.DRCIsLoaded);

  const poolInitialLoad = useDrStore((state) => state.poolInitialLoad);

  const originalPool = useDrStore((state) => state.originalPool);

  const allDRCPool = useDrStore((state) => state.allDRCPool);

  const selectedDRCs = useDrStore((state) => state.selectedDRCs);

  const modal = useDrStore((state) => state.modal);

  const setModal = useDrStore((state) => state.setModal);

  const setFilteredDRCs = useDrStore((state) => state.setFilteredDRCs);

  const setAllDRCPool = useDrStore((state) => state.setAllDRCPool);

  const setOriginalPool = useDrStore((state) => state.setOriginalPool);

  const setDRCIsLoaded = useDrStore((state) => state.setDRCisLoaded);

  const setDrcPoolIsFilled = useDrStore((state) => state.setDrcPoolIsFilled);

  const setSelectedDRCsOnLoad = useDrStore(
    (state) => state.setSelectedDRCsOnLoad
  );

  // selector
  const {
    PostPositionResponse,
    UpdatePositionResponse,
    PostPosition,
    UpdatePositionSuccess,
    PostPositionSuccess,
  } = useDrStore((state) => ({
    PostPosition: state.postPosition,
    PostPositionSuccess: state.postPositionSuccess,
    UpdatePositionSuccess: state.updatePositionSuccess,
    PostPositionResponse: state.position.postResponse,
    UpdatePositionResponse: state.position.updateResponse,
  }));

  const setPoolInitialLoad = useDrStore((state) => state.setPoolInitialLoad);

  const setSelectedDRCs = useDrStore((state) => state.setSelectedDRCs);

  const setSelectedDRCType = useDrStore((state) => state.setSelectedDRCType);

  const employee = useEmployeeStore((state) => state.employeeDetails);

  const selectedDRCtype = useDrStore((state) => state.selectedDRCType);

  const action = useDrStore((state) => state.action);

  // generate this for caching
  const random = useRef(Date.now());

  // loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // url for querying object related to the selected position from HRIS
  const prodUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/occupational-group-duties-responsibilities/duties-responsibilities/${selectedPosition.positionId}`;

  // url get existing DRC
  const getUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/${selectedPosition.positionId}`;

  // query duties and responsibilities data from HRIS using access token
  // const { data: getPool } = useSWR(`${prodUrl}`, fetchWithToken);
  const { data: getPool, mutate: mutateGetPool } = useSWR(
    prodUrl,
    fetchWithToken
  );

  // query existing duties,responsibilities, and competencies  from HRIS
  // const { data: getDRCs } = useSWR(`${getUrl}`, fetchWithToken);
  const { data: getDRCs, mutate: mutateGetDRCs } = useSWR(
    getUrl,
    fetchWithToken
  );

  // fires when core button is clicked
  const onClickCoreBtn = () => {
    setSelectedDRCType('core');
    setModal({ ...modal, page: 3 });
  };

  // fires when support button is clicked
  const onClickSupportBtn = () => {
    setSelectedDRCType('support');
    setModal({ ...modal, page: 3 });
  };

  const getOriginalPool = (drPool: any, fetchedDRCs: any) => {
    // add existing DRCs and unsettled DRCs
    const tempOrigPool: any = [...drPool]; // temporary original pool

    tempOrigPool.sort((a: DutyResponsibility, b: DutyResponsibility) =>
      a.description.localeCompare(b.description)
    );

    if (fetchedDRCs && fetchedDRCs.core.length > 0) {
      fetchedDRCs.core.map((dr: DutyResponsibility) => {
        tempOrigPool.push(
          (({ competency, percentage, state, onEdit, ...rest }) => rest)(dr)
        );
      });
    }

    if (fetchedDRCs && fetchedDRCs.support.length > 0) {
      fetchedDRCs.support.map((dr: DutyResponsibility) => {
        tempOrigPool.push(
          (({ competency, percentage, state, onEdit, ...rest }) => rest)(dr)
        );
      });
    }

    // sort and assign to temporary original pool
    const pool = tempOrigPool.sort(
      (a: DutyResponsibility, b: DutyResponsibility) =>
        a.description.localeCompare(b.description)
    );

    return pool;
  };

  const getOgdrIds = async (drcs: DutiesResponsibilities) => {
    const coreIdList: Array<string> = [];
    const supportIdList: Array<string> = [];
    drcs.core.map((dr: DutyResponsibility) => {
      if (dr.ogdrId) coreIdList.push(dr.ogdrId);
    });
    drcs.support.map((dr: DutyResponsibility) => {
      if (dr.ogdrId) supportIdList.push(dr.ogdrId);
    });
  };

  // this effect should only be run once
  // this sets the all dr pool
  useEffect(() => {
    if (DRCIsLoaded === true) {
      if (
        action === 'update' &&
        allDRCPool.length === 0 &&
        poolInitialLoad === false
      ) {
        const pool = [...getPool];

        pool
          .sort((a: DutyResponsibility, b: DutyResponsibility) =>
            a.description.localeCompare(b.description)
          )
          .map((dr: DutyResponsibility, index: number) => {
            dr.sequenceNo = index;
            dr.state = false;
            dr.onEdit = false;
            dr.competency = {} as Competency;
            dr.percentage = 0;
            dr.ogdrId = '';
          });

        if (originalPool.length > pool.length) {
          setAllDRCPool(pool);

          setFilteredDRCs(pool);
        }

        // set initial pool load to true
        setPoolInitialLoad(true);
      }
    }
  }, [DRCIsLoaded]);

  useEffect(() => {
    // && drPoolIsEmpty === false
    if (!isEmpty(getPool)) {
      if (drcPoolIsFilled === false && action === 'create') {
        const newDRs = [
          ...getPool.sort((a: DutyResponsibility, b: DutyResponsibility) =>
            a.description!.localeCompare(b.description!)
          ),
        ];

        // console.log('Get Pool HERE: ', getPool)

        //loop through all drs
        newDRs.map((dr: DutyResponsibility, index: number) => {
          // set default state value for dr on select
          dr.state = false;

          // set default state value for dr on edit
          dr.onEdit = false;

          // set default value state of sequenc number
          dr.sequenceNo = index;

          // set default percentage to 0
          dr.percentage = 0;

          // set default competency
          dr.competency = {} as Competency;
        });

        // set original pool
        setOriginalPool(newDRs);

        // set all dr state -> sort alphabetically by description
        setAllDRCPool(newDRs);

        // set filtered dr to sorted
        setFilteredDRCs(newDRs);

        // set to true if data is loaded
        setDrcPoolIsFilled(true);
      }
    }
  }, [getPool]);

  // run this use effect when update is clicked
  useEffect(() => {
    if (!isEmpty(getDRCs)) {
      if (
        action === 'update' &&
        DRCIsLoaded === false &&
        selectedDRCs.core.length === 0 &&
        selectedDRCs.support.length === 0 &&
        originalPool.length === 0
      ) {
        // console.log('getDRCS HERE:', getDRCs)
        // copy existing core DRCs
        const coreDRCs = [...getDRCs.core];

        // copy existing support DRCs
        const supportDRCs = [...getDRCs.support];

        // sort core DRCs
        const sortedCoreDRCs = coreDRCs.sort(
          (a: DutyResponsibility, b: DutyResponsibility) =>
            a.description.localeCompare(b.description)
        );

        // copy existing support DRCs
        const sortedSupportDRCs = supportDRCs.sort(
          (a: DutyResponsibility, b: DutyResponsibility) =>
            a.description.localeCompare(b.description)
        );

        sortedCoreDRCs.map((dr: DutyResponsibility, index: number) => {
          // set state value for dr on select
          dr.state = true;

          // set state value for dr on edit
          dr.onEdit = false;

          // set value state of sequence number
          dr.sequenceNo = index;

          // dr.percentage = 0;
        });

        sortedSupportDRCs.map((dr: DutyResponsibility, index: number) => {
          // set state value for dr on select
          dr.state = true;

          // set state value for dr on edit
          dr.onEdit = false;

          // set value state of sequence number
          dr.sequenceNo = index;

          // dr.percentage = 0;
        });

        // set selected drs
        setSelectedDRCs({
          ...selectedDRCs,
          core: sortedCoreDRCs,
          support: sortedSupportDRCs,
        });

        setSelectedDRCsOnLoad({
          core: sortedCoreDRCs,
          support: sortedSupportDRCs,
        });

        // get original pool
        const pool = getOriginalPool(getPool, getDRCs);
        setOriginalPool(pool);

        // set DRCIsLoaded to true since data is already fetched
        setDRCIsLoaded(true);
      }
    }
  }, [getDRCs]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [isLoading]);

  // mutate if post or update is triggered
  useEffect(() => {
    if (!isEmpty(PostPositionResponse) || !isEmpty(UpdatePositionResponse)) {
      mutateGetPool();
      mutateGetDRCs();
    }
  }, [PostPositionResponse, UpdatePositionResponse]);

  // useEffect(()=>{},[])

  // when modal is loaded, set dr type to ''
  useEffect(() => {
    setSelectedDRCType('');
    if (DRCIsLoaded === false && action === 'update') setIsLoading(true);
  }, [DRCIsLoaded, action]);

  if (!selectedPosition)
    return (
      <>
        <DRModalLoading />
      </>
    );

  return (
    <div className="h-auto px-5 rounded">
      <div className="flex flex-col pt-2 mb-8 font-semibold text-gray-500">
        <span className="text-xl text-slate-500">
          {selectedPosition.positionTitle}
        </span>
        <span className="text-sm font-normal">
          {selectedPosition.itemNumber}
        </span>
        <div className="flex flex-col mt-5">
          <section>
            <div className="flex items-end justify-between ">
              <p className="flex w-[22rem] font-normal items-center ">
                Core Duties & Responsibilities <HiPuzzle />
              </p>

              {isLoading ? (
                <LoadingVisual size={5} />
              ) : (
                <Button
                  btnLabel={
                    allDRCPool.length === 0
                      ? 'No core duties available in pool, please contact HR to add more duties'
                      : '+ Add Core'
                  }
                  btnVariant="white"
                  // light
                  className="min-w-[16rem] border-none text-indigo-600 "
                  isDisabled={allDRCPool.length === 0 ? true : false}
                  onClick={onClickCoreBtn}
                />
              )}
            </div>
            {/**Core Duties Box */}
            <div className="w-full  mt-2 mb-5 h-[14rem]  bg-slate-50 rounded  overflow-y-scroll overflow-x-hidden">
              <>
                {/* <h1 className="text-2xl font-normal text-gray-300">No selected core duties & responsibilities</h1> */}
                {isLoading ? (
                  <div className="flex justify-center w-full h-full place-items-center">
                    {<LoadingVisual size={12} />}{' '}
                  </div>
                ) : (
                  <>
                    {selectedDRCs.core.length === 0 ? (
                      <>
                        <div className="flex items-center justify-center h-full">
                          <h1 className="text-2xl font-normal text-gray-300">
                            No selected core duties, responsibilities, &
                            competencies
                          </h1>
                        </div>
                      </>
                    ) : (
                      <>
                        <SelectedCoreDRs />
                      </>
                    )}
                  </>
                )}
              </>
            </div>
          </section>
          <section>
            <div className="flex items-end justify-between ">
              <p className="flex w-[22rem] font-normal items-center ">
                Support Duties & Responsibilities <HiPuzzle />
              </p>

              {isLoading ? (
                <LoadingVisual size={5} />
              ) : (
                <Button
                  btnLabel={
                    allDRCPool.length === 0
                      ? 'No support duties available in pool, please contact HR to add more duties'
                      : '+ Add Support'
                  }
                  btnVariant="white"
                  isDisabled={allDRCPool.length === 0 ? true : false}
                  className="min-w-[16rem] border-none text-indigo-600"
                  onClick={onClickSupportBtn}
                />
              )}
            </div>
            {/** Support Duties Box */}
            <div className="w-full mt-2 mb-5 h-[14rem] bg-slate-50 rounded  overflow-y-scroll overflow-x-hidden">
              <>
                {/* <h1 className="text-2xl font-normal text-gray-300">No selected support duties & responsibilities</h1> */}
                {isLoading ? (
                  <div className="flex justify-center w-full h-full place-items-center">
                    {<LoadingVisual size={12} />}{' '}
                  </div>
                ) : (
                  <>
                    {selectedDRCs.support.length === 0 ? (
                      <>
                        <div className="flex items-center justify-center h-full">
                          <h1 className="text-2xl font-normal text-gray-300">
                            No selected support duties, responsibilities, &
                            competencies
                          </h1>
                        </div>
                      </>
                    ) : (
                      <>
                        <SelectedSupportDRs />
                      </>
                    )}
                  </>
                )}
              </>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
