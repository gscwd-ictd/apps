/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/ban-types */
import { Publication } from 'apps/job-portal/utils/types/data/publication-type';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import type { NextComponentType, NextPageContext } from 'next';
import { ActionDropDown } from '../fixed/dropdown/ActionDropdown';

export interface JobOpeningsProps {
  jobOpenings: Array<Publication>;
}

const JobOpeningsTable: NextComponentType<
  NextPageContext,
  {},
  JobOpeningsProps
> = ({ jobOpenings }: JobOpeningsProps) => {
  return (
    <>
      <div className="px-[5%] mt-2 flex items-center justify-center ">
        {!isEmpty(jobOpenings) ? (
          <div className="border rounded-lg shadow dark:border-gray-200">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-300">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-[20%]"
                  >
                    Position Title
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900  w-[15%]"
                  >
                    Item Number
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900  w-[10%]"
                  >
                    No. of Positions
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900  w-[25%]"
                  >
                    Place of Assignment
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900  w-[15%]"
                  >
                    Deadline of Submission
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900  w-[15%]"
                  >
                    Actions
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobOpenings.map((publication) => {
                  return (
                    <tr key={publication.positionId}>
                      <td className="py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">
                        {publication.positionTitle}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 ">
                        {publication.itemNumber}
                      </td>
                      <td className="px-3 py-4 text-sm ">
                        {publication.numberOfPositions}
                      </td>
                      <td className="px-3 py-4 text-sm ">
                        {publication.placeOfAssignment}
                      </td>
                      <td className="px-3 py-4 text-sm ">
                        {dayjs(publication.postingDeadline).format(
                          'MMMM DD, YYYY'
                        )}
                      </td>
                      <td className="px-3 py-4 text-sm ">
                        <span className="flex justify-center">
                          <div className="flex">
                            <div>
                              <ActionDropDown publication={publication} />
                            </div>
                          </div>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="flex justify-center w-full py-10 mt-24 text-3xl">
            No job openings at the moment
          </p>
        )}
      </div>
    </>
  );
};

export default JobOpeningsTable;
