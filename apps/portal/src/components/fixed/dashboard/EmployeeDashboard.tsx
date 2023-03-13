import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import {
  HiOutlineClipboardCheck,
  HiOutlineClipboardList,
  HiOutlineCollection,
  HiOutlineDocumentDuplicate,
  HiOutlineDuplicate,
  HiOutlinePuzzle,
} from 'react-icons/hi';
import { Employee } from '../../../utils/types/data';
import { EmployeeContext } from '../../../context/contexts';
import { DashboardCard } from '../../modular/common/cards/DashboardCard';
import { Modules } from '../../../utils/constants/card';
import { useAllowedModulesStore } from '../../../store/allowed-modules.store';
import { useEmployeeStore } from '../../../store/employee.store';

type DivisionManagerDashboardProps = {
  employee: Employee;
};

export const EmployeeDashboard = (): JSX.Element => {
  // set layout style
  const [isHorizontal, setIsHorizontal] = useState(false);

  return (
    <>
      {isHorizontal ? <HorizontalLayout /> : <VerticalLayout />}
      {/* <button className="p-2 text-white bg-indigo-400 rounded" onClick={() => setIsHorizontal(!isHorizontal)}>
        switch
      </button> */}
    </>
  );
};

const VerticalLayout = (): JSX.Element => {
  const employee = useEmployeeStore((state) => state.employeeDetails);
  // initialize router
  const router = useRouter();
  const allowedModules = useAllowedModulesStore(
    (state) => state.allowedModules
  );

  return (
    <div className="flex">
      <section className="h-100vh w-[28rem] pr-5">
        {/**
         * Map list of selection
         */}
        {allowedModules &&
          allowedModules.map((item, itemIdx: number) => {
            const { color, description, destination, icon, title, linkType } =
              item;
            return (
              <div key={itemIdx}>
                <DashboardCard
                  icon={icon}
                  color={color}
                  title={title}
                  linkType={linkType}
                  description={description}
                  destination={
                    destination === 'prf'
                      ? `/${router.query.id}/prf`
                      : destination === 'dnr'
                      ? `${router.query.id}/duties-and-responsibilities`
                      : destination === 'endorsement'
                      ? `/${router.query.id}/applicant-endorsement`
                      : destination === 'selection'
                      ? `/${router.query.id}/applicant-selection`
                      : destination === 'pds'
                      ? `/${router.query.id}/pds`
                      : destination === 'psb'
                      ? `http://192.168.137.249:3004/psb/login`
                      : destination === 'leaves'
                      ? `/${router.query.id}/leaves`
                      : destination === 'dtr'
                      ? `/${router.query.id}/dtr`
                      : destination === 'pass-slip'
                      ? `/${router.query.id}/pass-slip`
                      : destination === 'approvals'
                      ? `/${router.query.id}/approvals`
                      : destination
                  }
                  // children={<></>}
                />
              </div>
            );
          })}
      </section>
    </div>
  );
};

const HorizontalLayout = (): JSX.Element => {
  return (
    <div className="h-[calc(100vh-6rem)] w-full px-10">
      <div className="flex gap-10">
        <div className="flex items-center w-full gap-3 p-5 mb-5 transition-all ease-in-out bg-white rounded shadow-md cursor-pointer shadow-slate-100 hover:scale-105 hover:shadow-xl hover:shadow-slate-200">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-orange-50">
            <HiOutlineClipboardCheck className="w-6 h-6 text-orange-400 text-opacity-50" />
          </div>
          <div>
            <h5 className="text-lg font-semibold text-gray-600">
              Daily Accomplishment
            </h5>
            <p className="text-xs text-gray-400">
              Log your daily accomplishments
            </p>
          </div>
        </div>
        <div className="flex items-center w-full gap-3 p-5 mb-5 transition-all ease-in-out bg-white rounded shadow-md cursor-pointer shadow-slate-100 hover:scale-105 hover:shadow-xl hover:shadow-slate-200">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-rose-50">
            <HiOutlineDuplicate className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h5 className="text-lg font-semibold text-gray-600">
              Personal Data
            </h5>
            <p className="text-xs text-gray-400">
              Update your personal data sheet
            </p>
          </div>
        </div>
        <div className="flex items-center w-full gap-3 p-5 mb-5 transition-all ease-in-out bg-white rounded shadow-md cursor-pointer shadow-slate-100 hover:scale-105 hover:shadow-xl hover:shadow-slate-200">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-indigo-50">
            <HiOutlineCollection className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h5 className="text-lg font-semibold text-gray-600">
              Position Request
            </h5>
            <p className="text-xs text-gray-400">Request for new positions</p>
          </div>
        </div>
      </div>
    </div>
  );
};
