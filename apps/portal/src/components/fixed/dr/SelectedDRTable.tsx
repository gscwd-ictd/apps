import React from 'react';
import { HiOutlineCheckCircle, HiOutlineExclamation, HiOutlinePaperClip } from 'react-icons/hi';
import { DutyResponsibility } from '../../../types/dr.type';

type SelectedDRTableProps = {
  selectedDrs: Array<DutyResponsibility>;
  displayType: 'summary' | 'details';
};

export const SelectedPositionsTable = ({ selectedDrs, displayType }: SelectedDRTableProps): JSX.Element => {
  return (
    <>
      <table className="w-full whitespace-nowrap">
        <tbody>
          {selectedDrs &&
            selectedDrs.map((dr: DutyResponsibility, index: number) => {
              return (
                <React.Fragment key={index}>
                  <tr className="h-16 transition-colors duration-75 ease-in-out border border-gray-100 rounded cursor-pointer hover:bg-slate-50 focus:outline-none">
                    <td className="">
                      <div className="flex items-center gap-5">
                        <div className="ml-5">
                          {dr.percentage ? (
                            <HiOutlineCheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <HiOutlineExclamation className="w-6 h-6 text-rose-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">{dr.description}</p>
                        </div>
                      </div>
                    </td>

                    {/* <td className="">
                      <div className="flex items-center">
                        <p className={`ml-2 ${displayType === 'summary' ? 'text-sm' : 'font-medium'} leading-none text-gray-700`}>
                          {position.itemNumber}
                        </p>
                      </div>
                    </td> */}

                    <td className="">
                      <div className="flex items-center pl-5">
                        {displayType === 'summary' ? (
                          <>
                            <p className={`ml-2 text-sm leading-none ${dr.percentage ? 'text-gray-600' : 'text-rose-400'}`}>
                              {dr.percentage ? dr.percentage : 0}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className={`ml-2 font-medium leading-none text-gray-700`}>{dr.percentage ? dr.percentage : 0}</p>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="">
                      <div className="flex items-center pl-5">
                        <HiOutlinePaperClip className="w-5 h-5 text-orange-500" />
                        <p className={`ml-2 ${displayType === 'summary' ? 'text-sm' : 'font-medium'} font-me leading-none text-gray-700`}>
                          Attachments
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr className="h-3"></tr>
                </React.Fragment>
              );
            })}
        </tbody>
      </table>
    </>
  );
};
