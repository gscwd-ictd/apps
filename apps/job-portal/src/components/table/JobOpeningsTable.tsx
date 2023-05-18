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
      <div className="mx-auto max-w-7xl">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            {!isEmpty(jobOpenings) ? (
              <>
                <table className="min-w-full overflow-visible divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Position Title
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        Item Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        No. of Positions
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Place of Assignment
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Deadline of Submission
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                      >
                        Actions
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobOpenings.map((publication) => {
                      return (
                        <tr key={publication.positionId}>
                          <td className="py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 whitespace-nowrap sm:pl-6">
                            {publication.positionTitle}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {publication.itemNumber}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
                            {publication.numberOfPositions}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
                            {publication.placeOfAssignment}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
                            {dayjs(publication.postingDeadline).format(
                              'MMMM DD, YYYY'
                            )}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
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
              </>
            ) : (
              <p className="flex justify-center w-full py-10 mt-24 text-3xl">
                No job openings at the moment
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobOpeningsTable;
