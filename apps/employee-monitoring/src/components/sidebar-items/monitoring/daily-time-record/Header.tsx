import { SearchBox } from 'apps/employee-monitoring/src/components/inputs/SearchBox';
import { useDtrStore } from 'apps/employee-monitoring/src/store/dtr.store';
import fetcher from 'apps/employee-monitoring/src/utils/fetcher/Fetcher';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Assignment } from 'libs/utils/src/lib/types/employee.type';

export const DailyTimeRecordPageHeader = (): JSX.Element => {
  const searchValue = useDtrStore((state) => state.searchValue);
  const setSearchValue = useDtrStore((state) => state.setSearchValue);
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [assignments, setAssignments] = useState<Array<Assignment>>([]);

  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/organization/mixed`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      console.log(data.data);
      setAssignments(data.data);
    }
  }, [data]);

  useEffect(() => {
    console.log('Selected >>>>> ', selectedAssignment);
  }, [selectedAssignment]);

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
