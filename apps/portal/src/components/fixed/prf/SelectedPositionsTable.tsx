import React from 'react';
import { HiOutlineCheckCircle, HiOutlineExclamation, HiOutlinePaperClip } from 'react-icons/hi';
import { Position } from '../../../types/position.type';

type SelectedPositionsTableProps = {
  selectedPositions: Array<Position>;
  displayType: 'summary' | 'details';
};

export const SelectedPositionsTable = ({ selectedPositions, displayType }: SelectedPositionsTableProps): JSX.Element => {
  return (
    <>
      <table className="w-full whitespace-nowrap">
        <tbody>
          {selectedPositions &&
            selectedPositions.map((position: Position, index: number) => {
              return (
                <React.Fragment key={index}>
                  <tr className="h-16 transition-colors duration-75 ease-in-out border border-gray-100 rounded cursor-pointer hover:bg-slate-50 focus:outline-none">
                    <td className="">
                      <div className="flex items-center gap-5">
                        <div className="ml-5">
                          {position.remarks ? (
                            <HiOutlineCheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <HiOutlineExclamation className="w-6 h-6 text-rose-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">{position.positionTitle}</p>
                          <p className="text-sm text-gray-400">{position.designation}</p>
                        </div>
                      </div>
                    </td>

                    <td className="">
                      <div className="flex items-center">
                        <p className={`ml-2 ${displayType === 'summary' ? 'text-sm' : 'font-medium'} leading-none text-gray-700`}>
                          {position.itemNumber}
                        </p>
                      </div>
                    </td>

                    <td className="">
                      <div className="flex items-center pl-5">
                        {displayType === 'summary' ? (
                          <>
                            <p className={`ml-2 text-sm leading-none ${position.remarks ? 'text-gray-600' : 'text-rose-400'}`}>
                              {position.remarks ? position.remarks : 'No remarks'}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className={`ml-2 font-medium leading-none text-gray-700`}>{position.remarks ? position.remarks : 'No remarks'}</p>
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
