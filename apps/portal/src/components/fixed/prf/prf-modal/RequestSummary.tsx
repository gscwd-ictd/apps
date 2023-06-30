import { useEmployeeStore } from '../../../../../src/store/employee.store';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { FunctionComponent } from 'react';
import {
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineDocumentDuplicate,
  HiOutlineExclamation,
  HiOutlinePencil,
  HiOutlineUser,
} from 'react-icons/hi';
import { usePrfStore } from '../../../../store/prf.store';

import { Position } from '../../../../types/prf.types';

export const RequestSummary: FunctionComponent = () => {
  // access employee from store
  const employee = useEmployeeStore((state) => state.employeeDetails);

  // access profile from store
  const profile = useEmployeeStore((state) => state.employeeDetails.profile);

  // access with exam from store
  const withExam = usePrfStore((state) => state.withExam);

  // access selected positions array from store
  const selectedPositions = usePrfStore((state) => state.selectedPositions);

  return (
    <>
      <div className="h-full flex flex-col lg:flex-row gap-5 scale-90">
        <header className="shrink-0 w-[18rem]">
          <div className="space-y-1">
            <header className="mb-7 pb-2 space-y-1">
              <h1 className="text-xl font-medium text-gray-600">
                Request Summary
              </h1>
              <p className="text-sm text-gray-500">HRD-001-2</p>
            </header>

            <section className="flex items-center gap-4">
              <HiOutlineUser className="text-gray-700 shrink-0" />
              <p className="font-medium text-gray-600 truncate">
                {profile.firstName} {profile.lastName}
              </p>
            </section>

            <section className="flex items-center gap-4">
              <HiOutlineDocumentDuplicate className="text-gray-700 shrink-0" />
              <p className="font-medium text-gray-600 truncate">
                {employee.employmentDetails.assignment.positionTitle}
              </p>
            </section>

            <section className="flex items-center gap-4">
              <HiOutlineCalendar className="text-gray-700 shrink-0" />
              <p className="font-medium text-gray-600">
                {dayjs().format('MMMM DD, YYYY')}
              </p>
            </section>

            <section className="flex items-center gap-4">
              <HiOutlinePencil className="text-gray-700 shrink-0" />
              {withExam ? (
                <p className="text-indigo-500 font-medium">
                  Examination is required
                </p>
              ) : (
                <p className="text-orange-500 font-medium">
                  No examination required
                </p>
              )}
            </section>
          </div>
        </header>

        <main className="h-full w-full overflow-y-auto px-5">
          {selectedPositions.map((position: Position, index: number) => {
            return (
              <div
                key={index}
                className={`${
                  position.remarks
                    ? 'hover:border-l-green-600'
                    : 'hover:border-l-red-500'
                } hover:scale-105 hover:shadow-slate-200 mb-4 flex items-center justify-between border-l-4 py-3 px-5 border-gray-100 shadow-2xl shadow-slate-100 transition-all`}
              >
                <section className="space-y-3 w-full">
                  <header>
                    <section className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-600 text-lg">
                        {position.positionTitle}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {position.itemNumber}
                      </p>
                    </section>
                    <p className="text-sm text-gray-400">
                      {position.designation}
                    </p>
                  </header>

                  <main>
                    {position.remarks ? (
                      <section className="flex items-center gap-2">
                        <HiOutlineCheckCircle className="h-5 w-5 text-green-600" />
                        <p className="text-emerald-600">{position.remarks}</p>
                      </section>
                    ) : (
                      <section className="flex items-center gap-2">
                        <HiOutlineExclamation className="h-5 w-5 text-rose-400" />
                        <p className="text-red-400">
                          No remarks stated but it is recommended.
                        </p>
                      </section>
                    )}
                  </main>
                </section>
              </div>
            );
          })}
        </main>
      </div>
    </>
  );
};
