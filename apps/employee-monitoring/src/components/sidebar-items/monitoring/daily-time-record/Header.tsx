import { SearchBox } from 'apps/employee-monitoring/src/components/inputs/SearchBox';
import { useDtrStore } from 'apps/employee-monitoring/src/store/dtr.store';
import fetcherHRIS from '../../../../utils/fetcher/FetcherHris';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Assignment } from 'libs/utils/src/lib/types/employee.type';

export const DailyTimeRecordPageHeader = (): JSX.Element => {
  const searchValue = useDtrStore((state) => state.searchValue);
  const setSearchValue = useDtrStore((state) => state.setSearchValue);
  const setSelectedAssignment = useDtrStore(
    (state) => state.setSelectedAssignment
  );
  const [assignments, setAssignments] = useState<Array<Assignment>>([]);

  const { data } = useSWR(`organization/mixed`, fetcherHRIS);

  useEffect(() => {
    if (data) {
      setAssignments(data.data);
    }
  }, [data]);

  return (
    <div className="flex w-full pl-3 ">
      <div className="w-[24rem]">
        <SearchBox
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          fluid
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="dtrSelectAssignment" className="">
          <span className="text-xs">Assignment:</span>
        </label>
        <div className="w-[20rem]">
          <select
            id="dtrSelectAssignment"
            className="w-full text-xs border border-gray-300 rounded bg-gray-200/50"
            onChange={(e) => setSelectedAssignment(e.currentTarget.value)}
          >
            <option value="">All</option>
            {assignments &&
              assignments.map((assignment: Assignment) => {
                return (
                  <React.Fragment key={assignment._id}>
                    <option value={assignment._id}>{assignment.name}</option>
                  </React.Fragment>
                );
              })}
          </select>
        </div>
      </div>
    </div>
  );
};
