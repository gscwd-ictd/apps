/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/ban-types */
import { Publication } from 'apps/job-portal/utils/types/data/publication-type';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import type { NextComponentType, NextPageContext } from 'next';
import { ActionDropDown } from '../fixed/dropdown/ActionDropdown';
import { useContext } from 'react';
import { VerticalActionDropDown } from '../fixed/dropdown/VerticalActionDropdown';
import { PageContentContext } from '../fixed/page/PageContent';

export interface JobOpeningsProps {
  jobOpenings: Array<Publication>;
}

const JobOpeningsTable: NextComponentType<NextPageContext, {}, JobOpeningsProps> = ({
  jobOpenings,
}: JobOpeningsProps) => {
  const {
    aside: { isMobile },
  } = useContext(PageContentContext);
  return (
    <>
      {/* <div className="px-[5%] mt-2 flex items-center justify-center "> */}

      {!isEmpty(jobOpenings) && !isMobile ? (
        <div className="relative overflow-x-auto lg:mx-[20%] rounded-lg pt-10">
          <h3 className="pt-5 text-lg font-medium pb-2">List of available positions and deadlines</h3>
          <table className=" divide-y divide-gray-300">
            <thead className="bg-slate-400">
              <tr>
                <th scope="col" className="py-4 px-2 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-[20%]">
                  Position Title
                </th>
                <th scope="col" className="py-4 px-2 text-left text-sm font-semibold text-gray-900  w-[15%]">
                  Item Number
                </th>
                <th scope="col" className="py-4 px-2 text-left text-sm font-semibold text-gray-900  w-[10%]">
                  No. of Positions
                </th>
                <th scope="col" className="py-4 px-2 text-left text-sm font-semibold text-gray-900  w-[25%]">
                  Place of Assignment
                </th>
                <th scope="col" className="py-4 px-2 text-left text-sm font-semibold text-gray-900  w-[15%]">
                  Deadline of Submission
                </th>
                <th scope="col" className="py-4 px-2 text-center text-sm font-semibold text-gray-900  w-[15%]">
                  Actions
                </th>
                <th scope="col" className="relative ">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 w-full">
              {jobOpenings.map((publication) => {
                return (
                  <tr key={publication.positionId}>
                    <td className="py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">
                      {publication.positionTitle}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 ">{publication.itemNumber}</td>
                    <td className="px-3 py-4 text-sm ">{publication.numberOfPositions}</td>
                    <td className="px-3 py-4 text-sm ">{publication.placeOfAssignment}</td>
                    <td className="px-3 py-4 text-sm ">{dayjs(publication.postingDeadline).format('MMMM DD, YYYY')}</td>
                    <td className="px-3 py-4 text-sm flex justify-center ">
                      <ActionDropDown publication={publication} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : !isEmpty(jobOpenings) && isMobile ? (
        <>
          <h3 className="pt-5 p-4">List of available positions and deadlines</h3>
          <div className="w-full px-[2%] flex flex-col gap-2 relative overflow-x-auto rounded-lg pt-2 ">
            {jobOpenings.map((publication, idx) => {
              return (
                <div key={idx} className="w-full bg-white shadow-lg p-4 rounded flex gap-1  justify-between  ">
                  <div className="flex flex-col gap-0">
                    <section className="font-semibold text-xs">{publication.itemNumber}</section>
                    <section className="font-semibold text-xs">{publication.positionTitle}</section>

                    <section className="text-xs pt-1">{publication.placeOfAssignment}</section>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <div className="flex flex-col justify-center items-end gap-1 text-end">
                      {/* <section className="text-gray-400 text-xs">Deadline</section> */}
                      <section className="text-xs">{dayjs(publication.postingDeadline).format('MMM DD, YYYY')}</section>
                      <section className="text-xs text-gray-400 ">
                        {publication.numberOfPositions}{' '}
                        {Number(publication.numberOfPositions) > 1 ? 'positions' : 'position'}
                      </section>
                    </div>
                    <VerticalActionDropDown publication={publication} />
                    {/* <ActionDropDown publication={publication} /> */}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="flex justify-center w-full py-10 mt-24 text-3xl">No job openings at the moment</p>
      )}
    </>
  );
};

export default JobOpeningsTable;
