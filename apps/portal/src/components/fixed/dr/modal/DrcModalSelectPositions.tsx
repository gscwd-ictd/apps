/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { usePositionStore } from 'apps/portal/src/store/position.store';
import {
  FormEvent,
  FunctionComponent,
  MutableRefObject,
  useEffect,
  useRef,
} from 'react';
import useSWR from 'swr';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';
import { DRModalPosLoading } from '../DRModalPosLoading';
import { Position } from 'apps/portal/src/types/position.type';
import { HiOutlineSearch, HiXCircle } from 'react-icons/hi';

export const DrcModalSelectPositions: FunctionComponent = () => {
  const {
    IsLoading,
    positions,
    filteredPositions,
    filteredValue,
    setFilteredValue,
    setFilteredPositions,
    GetAllPositions,
    GetAllPositionsSuccess,
    GetAllPositionsFail,
  } = usePositionStore((state) => ({
    IsLoading: state.loading,
    positions: state.positions,
    filteredPositions: state.filteredPositions,
    filteredValue: state.filteredValue,
    setFilteredValue: state.setFilteredValue,
    setFilteredPositions: state.setFilteredPositions,
    GetAllPositions: state.getAllDrcPositions,
    GetAllPositionsSuccess: state.getAllDrcPositionsSuccess,
    GetAllPositionsFail: state.getAllDrcPositionsFail,
  }));

  const employee = useEmployeeStore((state) => state.employeeDetails);
  const {
    data: swrPositions,
    error: swrError,
    isLoading: swrLoading,
    mutate: mutatePositions,
  } = useSWR(
    `occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}`,
    fetcherHRIS,
    { shouldRetryOnError: false, revalidateOnFocus: false }
  );

  // initialize ref for search input
  const searchRef = useRef(
    null
  ) as unknown as MutableRefObject<HTMLInputElement>;

  // on search function used for filtering positions
  const onSearch = (event: FormEvent<HTMLInputElement>) => {
    // get the current value of the search input
    const value = event.currentTarget.value;

    // create an array that will contain the search results
    const filteredResult: Array<Position> = [];

    // loop through positions array and filter according to position title
    positions.filter((position: Position) => {
      // check if there is a match
      if (position.positionTitle.match(new RegExp(value, 'i'))) {
        // insert the matching position inside the filtered result

        filteredResult.push(position);
      }
    });

    // set search value to current value of the search input
    setFilteredValue(value);

    // update the state of the filtered positions
    setFilteredPositions(filteredResult);
  };

  // clear search
  const onClearSearch = () => {
    // set focus on the search input
    searchRef.current.focus();

    // set the search value back to default
    setFilteredValue('');

    // set the filtered positions back to default
    setFilteredPositions(positions);
  };

  // get from use swr
  useEffect(() => {
    if (!isEmpty(swrPositions)) {
      console.log(swrPositions.data);

      // success
      GetAllPositionsSuccess(swrPositions.data);
    }

    if (!isEmpty(swrError)) {
      console.log(swrError);
      GetAllPositionsFail(swrError);
    }
  }, [swrPositions, swrError]);

  // set focus whenever filtered positions change
  useEffect(() => searchRef.current.focus(), [filteredPositions]);

  useEffect(() => {
    if (swrLoading) {
      GetAllPositions(true);
    }
  }, [swrLoading]);

  return (
    <>
      {IsLoading ? (
        <DRModalPosLoading />
      ) : (
        <div className="flex flex-col w-full mb-5">
          <section>
            <div className="flex justify-end px-3 mb-1 text-sm">
              <p className="text-gray-600">
                {positions.length} pending{' '}
                {positions.length < 1 ? 'position' : 'positions'}
              </p>
            </div>
            <div className="relative px-3 mt-2 mb-5">
              <HiOutlineSearch className="absolute mt-[0.9rem] ml-3 h-[1.25rem] w-[1.25rem] text-gray-500" />
              <input
                ref={searchRef}
                value={filteredValue}
                onChange={(event) => onSearch(event)}
                type="text"
                className="w-full py-3 pl-10 pr-12 border-gray-200 rounded"
                placeholder="Search for a position"
              />
              {filteredValue !== '' ? (
                <>
                  <button
                    className="absolute -right-0 mr-7 focus:outline-none"
                    onClick={onClearSearch}
                  >
                    <HiXCircle className="w-6 h-6 mt-3 transition-colors ease-in-out text-slate-300 hover:text-slate-400" />
                  </button>
                </>
              ) : null}
            </div>
          </section>
        </div>
      )}
    </>
  );
};
