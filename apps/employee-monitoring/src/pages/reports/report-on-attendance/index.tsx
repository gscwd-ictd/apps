import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Report } from 'apps/employee-monitoring/src/utils/types/report.type';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { Button } from '@gscwd-apps/oneui';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import ReportOnAttendancePdf from 'apps/employee-monitoring/src/components/pdf/ReportOnAttendance';

export default function Index({ reportOnAttendanceData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <div className="w-full">
        <BreadCrumbs
          title="Report on Attendance"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Reports',
              path: '/reports',
            },
            { layerNo: 2, layerText: 'Report on Attendance', path: '' },
          ]}
        />

        <div className="flex flex-col w-full gap-6 px-5">
          <Card>
            <ReportOnAttendancePdf reportOnAttendanceData={reportOnAttendanceData} />
          </Card>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_BE_DOMAIN}/reports/?report=${context.query.reportName}&date_from=${context.query.date_from}&date_to=${context.query.date_to}`
    );

    return { props: { reportOnAttendanceData: data } };
  } catch (error) {
    return {
      props: { reportOnAttendanceData: [] },
      redirect: { destination: '/404', permanent: false },
    };
  }
};
