import { useRouter } from 'next/router';

import { Employee } from '../../../utils/types/data';

import { DashboardCard } from '../../modular/common/cards/DashboardCard';
import { useAllowedModulesStore } from '../../../store/allowed-modules.store';
import { useEmployeeStore } from '../../../store/employee.store';

export const EmployeeDashboard = (): JSX.Element => {
  return (
    <>
      <VerticalLayout />
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
      <section className="h-100vh w-full lg:w-[28rem]">
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
                      ? `${process.env.NEXT_PUBLIC_PSB_URL}/psb/schedule`
                      : destination === 'dtr'
                      ? `/${router.query.id}/dtr`
                      : destination === 'leaves'
                      ? `/${router.query.id}/leaves`
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
