import { isEmpty } from 'lodash'
import type { NextComponentType, NextPageContext } from 'next'
import { Publication } from '../../types/data/publication-type'
import { ActionDropDown } from '../fixed/dropdown/ActionDropdown'

export interface JobOpeningsProps {
  jobOpenings: Array<Publication>
}

const JobOpeningsTable: NextComponentType<NextPageContext, {}, JobOpeningsProps> = ({ jobOpenings }: JobOpeningsProps) => {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="inline-block min-w-full py-2 align-middle">
        <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          {!isEmpty(jobOpenings) ? (
            <>
              <table className="min-w-full divide-y divide-gray-300 overflow-visible">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Position Title
                    </th>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Item Number
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Number of Positions
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Place of Assignment
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {jobOpenings.map((publication) => (
                    <tr key={publication.positionId}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">
                        {publication.positionTitle}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{publication.itemNumber}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">{publication.numberOfPositions}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">{publication.placeOfAssignment}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className="flex justify-center">
                          <div className="flex">
                            <div>
                              <ActionDropDown publication={publication} />
                            </div>
                          </div>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="mt-24 flex w-full justify-center py-10 text-3xl">No job openings at the moment</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobOpeningsTable
