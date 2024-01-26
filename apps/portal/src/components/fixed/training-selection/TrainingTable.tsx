/* eslint-disable @nx/enforce-module-boundaries */
import { Button, ListDef, Select } from '@gscwd-apps/oneui';
import { EmployeeDetails } from '../../../types/employee.type';
import Link from 'next/link';
import { useDtrStore } from '../../../store/dtr.store';
import { UseLateChecker } from 'libs/utils/src/lib/functions/LateChecker';
import { UseUndertimeChecker } from 'libs/utils/src/lib/functions/UndertimeChecker';
import dayjs from 'dayjs';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { HiOutlineSearch, HiPencil, HiPencilAlt } from 'react-icons/hi';
import { EmployeeDtrWithSchedule } from 'libs/utils/src/lib/types/dtr.type';
import { useState } from 'react';
import { SpinnerDotted } from 'spinners-react';
import { HolidayTypes } from 'libs/utils/src/lib/enums/holiday-types.enum';
import { useTrainingSelectionStore } from 'apps/portal/src/store/training-selection.store';
import { Training } from 'libs/utils/src/lib/types/training.type';
import TrainingDetailsModal from './TrainingDetailsModal';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

type TrainingProps = {
  employeeDetails: EmployeeDetails;
};

export const TrainingTable = ({ employeeDetails }: TrainingProps) => {
  const { trainingList, loadingTrainingList, errorTrainingList, trainingModalIsOpen, setIndividualTrainingDetails } =
    useTrainingSelectionStore((state) => ({
      trainingList: state.trainingList,
      loadingTrainingList: state.loading.loadingTrainingList,
      errorTrainingList: state.error.errorTrainingList,
      trainingModalIsOpen: state.setTrainingModalIsOpen,
      setIndividualTrainingDetails: state.setIndividualTrainingDetails,
    }));

  const openTrainingModal = (data: Training) => {
    trainingModalIsOpen(true);
    setIndividualTrainingDetails(data);
  };

  return (
    <>
      {loadingTrainingList ? (
        <div className="w-full h-[90%] static flex flex-col justify-items-center items-center place-items-center">
          <SpinnerDotted
            speed={70}
            thickness={70}
            className="flex w-full h-full transition-all "
            color="slateblue"
            size={100}
          />
        </div>
      ) : !loadingTrainingList && trainingList?.length > 0 ? (
        <>
          <div className="flex overflow-x-hidden w-full md:w-full flex-col">
            <div className="overflow-x-hidden w-[50rem] md:w-full">
              <table className="w-screen md:w-full border-0 border-separate bg-slate-50 border-spacing-0 z-0">
                <thead className="border-0">
                  <tr>
                    <th className="w-1/6 px-2 py-2 text-sm text-center border md:px-6 md:text-md font-medium text-gray-700 ">
                      Course Title
                    </th>
                    <th className="px-2 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                      Location
                    </th>
                    <th className="px-2 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                      Start
                    </th>
                    <th className="px-2 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                      End
                    </th>
                    <th className="px-2 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                      Slots
                    </th>
                    <th className="px-2 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-2 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-center ">
                  {trainingList?.length > 0 ? (
                    trainingList.map((training, index) => {
                      return (
                        <tr key={index}>
                          <td className={`py-2 px-2 text-center border`}>{training.courseTitle}</td>
                          <td className={`border text-center py-2`}>{training.location}</td>
                          <td className={`whitespace-nowrap border text-center py-2 px-2`}>
                            {DateFormatter(training.trainingStart, 'MM-DD-YYYY')}
                          </td>
                          <td className={`whitespace-nowrap border text-center py-2 px-2`}>
                            {DateFormatter(training.trainingEnd, 'MM-DD-YYYY')}
                          </td>
                          <td className={`whitespace-nowrap border text-center py-2 px-2`}>{training.numberOfSlots}</td>
                          <td className={`border text-center py-2 capitalize`}>{training.trainingPreparationStatus}</td>

                          <td className={`py-2 text-center border`}>
                            <Button
                              variant={'primary'}
                              size={'sm'}
                              loading={false}
                              onClick={() => openTrainingModal(training)}
                            >
                              <div className="flex justify-center">
                                <HiPencilAlt className="w-3 h-4 md:w-4 md:h-5" />
                              </div>
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="border-0">
                      <td colSpan={6}>NO DATA FOUND</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-end w-full pt-4">
            {/* <Link href={`/123/dtr/${date}`} target={'_blank'}>
                <Button variant={'primary'} size={'md'} loading={false}>
                  View
                </Button>
              </Link> */}
          </div>
        </>
      ) : (
        <div className="h-80 w-full text-8xl text-slate-200 flex justify-center items-center">NO DATA</div>
      )}
    </>
  );
};
