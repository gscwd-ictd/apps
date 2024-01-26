import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import { useRouter } from 'next/router';

import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import ReportOnAttendancePdf from 'apps/employee-monitoring/src/components/pdf/ReportOnAttendance';
import { useReportsStore } from 'apps/employee-monitoring/src/store/report.store';
import { LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { Navigate } from 'apps/employee-monitoring/src/components/router/navigate';

const Index = () => {
  const router = useRouter();

  // fetch data for Report On Attendance Document
  const {
    data: swrReportOnAttendanceDocument,
    error: swrError,
    isLoading: swrIsLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_BE_DOMAIN}/reports/?report=${router.query.reportName}&date_from=${router.query.date_from}&date_to=${router.query.date_to}`,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // Zustand initialization
  const { ReportOnAttendanceDoc, SetReportOnAttendanceDoc, ErrorReportOnAttendanceDoc, SetErrorReportOnAttendanceDoc } =
    useReportsStore((state) => ({
      ReportOnAttendanceDoc: state.reportOnAttendanceDoc,
      SetReportOnAttendanceDoc: state.setReportOnAttendanceDoc,

      ErrorReportOnAttendanceDoc: state.errorReportOnAttendanceDoc,
      SetErrorReportOnAttendanceDoc: state.setErrorReportOnAttendanceDoc,
    }));

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrReportOnAttendanceDocument)) {
      SetReportOnAttendanceDoc(swrReportOnAttendanceDocument.data);
    }

    if (!isEmpty(swrError)) {
      SetErrorReportOnAttendanceDoc(swrError.message);
    }
  }, [swrReportOnAttendanceDocument, swrError]);

  return (
    <>
      <Can I="access" this="Reports">
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

          {/* Error Notifications */}
          {!isEmpty(ErrorReportOnAttendanceDoc) ? (
            <ToastNotification
              toastType="error"
              notifMessage={'Network Error: Failed to retrieve Report on Attendance Document'}
            />
          ) : null}

          <div className="flex flex-col w-full gap-6 px-5">
            <Card>
              {swrIsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <ReportOnAttendancePdf reportOnAttendanceData={ReportOnAttendanceDoc} />
              )}
            </Card>
          </div>
        </div>
      </Can>

      <Can not I="access" this="Reports">
        <Navigate to="/page-404" />
      </Can>
    </>
  );
};

export default Index;
