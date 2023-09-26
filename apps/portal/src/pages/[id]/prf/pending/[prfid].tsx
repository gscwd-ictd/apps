import dayjs from 'dayjs';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import {
  HiOutlineUser,
  HiOutlineDocumentDuplicate,
  HiOutlineCalendar,
  HiOutlinePencil,
  HiArrowSmLeft,
} from 'react-icons/hi';
import { PrfTimeline } from '../../../../components/fixed/prf/prf-view/PrfTimeline';
import { PageTitle } from '../../../../components/modular/html/PageTitle';
import {
  getEmployeeDetailsFromHr,
  getEmployeeProfile,
} from '../../../../utils/helpers/http-requests/employee-requests';
import { getPrfById, getPrfTrailByPrfId } from '../../../../utils/helpers/prf.requests';
import { EmployeeDetailsPrf, EmployeeProfile, employeeDummy } from '../../../../types/employee.type';
import { Position, PrfDetails, PrfTrail } from '../../../../types/prf.types';
import { withCookieSession } from '../../../../../src/utils/helpers/session';

type PrfDocumentProps = {
  profile: EmployeeProfile;
  employee: EmployeeDetailsPrf;
  prfDetails: PrfDetails;
  prfTrail: PrfTrail;
};

export default function PendingPrf({ profile, employee, prfDetails, prfTrail }: PrfDocumentProps) {
  const router = useRouter();
  return (
    <>
      <PageTitle title={prfDetails.prfNo} />

      <div className="flex flex-col w-screen h-screen py-10 overflow-hidden pl-4 pr-4 lg:pl-32 lg:pr-32">
        <button
          className="flex items-center gap-2 text-gray-700 transition-colors ease-in-out hover:text-gray-700"
          onClick={() => router.back()}
        >
          <HiArrowSmLeft className="w-5 h-5" />
          <span className="font-medium">Go Back</span>
        </button>
        <header className="flex items-center justify-between">
          <section className="shrink-0">
            <h1 className="text-2xl font-semibold text-gray-700">Pending Request</h1>
            <p className="text-gray-500">{prfDetails.prfNo}</p>
          </section>
        </header>

        <section className="w-full py-5 scale-[60%] lg:scale-75">
          <PrfTimeline prfTrail={prfTrail} />
        </section>

        <main>
          <main className="flex flex-col lg:flex-row h-full">
            <aside className="shrink-0 w-[20rem]">
              <section className="flex items-center gap-4">
                <HiOutlineUser className="text-gray-700 shrink-0" />
                <p className="font-medium text-gray-600 truncate">
                  {profile.firstName} {profile.lastName}
                </p>
              </section>

              <section className="flex items-center gap-4">
                <HiOutlineDocumentDuplicate className="text-gray-700 shrink-0" />
                <p className="font-medium text-gray-600 truncate">{employee.assignment.positionTitle}</p>
              </section>

              <section className="flex items-center gap-4">
                <HiOutlineCalendar className="text-gray-700 shrink-0" />
                <p className="font-medium text-gray-600">{dayjs(prfDetails.createdAt).format('MMMM DD, YYYY')}</p>
              </section>

              <section className="flex items-center gap-4">
                <HiOutlinePencil className="text-gray-700 shrink-0" />
                {prfDetails.withExam ? (
                  <p className="font-medium text-indigo-500">Examination is required</p>
                ) : (
                  <p className="font-medium text-orange-500">No examination required</p>
                )}
              </section>
            </aside>
            <section className="w-full pt-4 lg:pt-0">
              <main className="scale-95 h-[24rem] w-full overflow-y-auto px-5">
                {prfDetails.prfPositions.map((position: Position, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`${
                        position.remarks ? 'hover:border-l-green-600' : 'hover:border-l-red-500'
                      } cursor-pointer hover:shadow-slate-200 mb-4 flex items-center justify-between border-l-4 py-3 px-5 border-gray-100 shadow-2xl shadow-slate-100 transition-all`}
                    >
                      <section className="w-full space-y-3">
                        <header>
                          <section className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-600">{position.positionTitle}</h3>
                            <p className="text-sm text-gray-600">{position.itemNumber}</p>
                          </section>
                          <p className="text-sm text-gray-400">{position.designation}</p>
                        </header>

                        <main>
                          {position.remarks ? (
                            <section className="flex items-center gap-2">
                              <p className="text-emerald-600">{position.remarks}</p>
                            </section>
                          ) : (
                            <section className="flex items-center gap-2">
                              <p className="text-red-400">No remarks set for this position.</p>
                            </section>
                          )}
                        </main>
                      </section>
                    </div>
                  );
                })}
              </main>
            </section>
          </main>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  try {
    const employee = await getEmployeeDetailsFromHr(context);

    const profile = await getEmployeeProfile(employee.userId);

    // const employee = employeeDummy;
    // const profile = await getEmployeeProfile(employee.user._id);

    // get prf details
    const prfDetails = await getPrfById(`${context.query.prfid}`, context);

    // get prf trail
    const prfTrail = await getPrfTrailByPrfId(`${context.query.prfid}`, context);

    // return the result
    return { props: { profile, employee, prfDetails, prfTrail } };
  } catch (error) {
    return { notFound: true };
  }
});
