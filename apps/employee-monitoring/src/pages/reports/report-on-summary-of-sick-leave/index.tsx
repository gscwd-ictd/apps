import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import { useRouter } from 'next/router';

import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import ReportOnEmployeeSickLeaveCreditsPdf from 'apps/employee-monitoring/src/components/pdf/ReportOnSummaryOfSickLeave';
import { useReportsStore } from 'apps/employee-monitoring/src/store/report.store';
import { LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { Navigate } from 'apps/employee-monitoring/src/components/router/navigate';

const Index = () => {
  const router = useRouter();

  // fetch data for Report On Summary of Sick Leave Document
  const {
    data: swrReportOnSummaryOfSickLeaveDocument,
    error: swrError,
    isLoading: swrIsLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_BE_DOMAIN}/reports/?report=${router.query.reportName}&date_from=${
      router.query.date_from
    }&date_to=${router.query.date_to}&employee_id=${!isEmpty(router.query.employee_id) || ''}`,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // Zustand initialization
  const {
    ReportOnEmpSickLeaveCreditsDoc,
    SetReportOnEmpSickLeaveCreditsDoc,
    ErrorReportOnEmpSickLeaveCreditsDoc,
    SetErrorReportOnEmpSickLeaveCreditsDoc,
  } = useReportsStore((state) => ({
    ReportOnEmpSickLeaveCreditsDoc: state.reportOnEmpSickLeaveCreditsDoc,
    SetReportOnEmpSickLeaveCreditsDoc: state.setReportOnEmpSickLeaveCreditsDoc,

    ErrorReportOnEmpSickLeaveCreditsDoc: state.errorReportOnEmpSickLeaveCreditsDoc,
    SetErrorReportOnEmpSickLeaveCreditsDoc: state.setErrorReportOnEmpSickLeaveCreditsDoc,
  }));

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrReportOnSummaryOfSickLeaveDocument)) {
      SetReportOnEmpSickLeaveCreditsDoc(swrReportOnSummaryOfSickLeaveDocument.data);
    }

    if (!isEmpty(swrError)) {
      SetErrorReportOnEmpSickLeaveCreditsDoc(swrError.message);
    }
  }, [swrReportOnSummaryOfSickLeaveDocument, swrError]);

  return (
    <>
      <Can I="access" this="Reports">
        <div className="w-full">
          <BreadCrumbs
            title="Report on Summary of Sick Leave"
            crumbs={[
              {
                layerNo: 1,
                layerText: 'Reports',
                path: '/reports',
              },
              { layerNo: 2, layerText: 'Report on Summary of Sick Leave', path: '' },
            ]}
          />

          {/* Error Notifications */}
          {!isEmpty(ErrorReportOnEmpSickLeaveCreditsDoc) ? (
            <ToastNotification
              toastType="error"
              notifMessage={'Network Error: Failed to retrieve Report on Summary of Sick Leave'}
            />
          ) : null}

          <div className="flex flex-col w-full gap-6 px-5">
            <Card>
              {swrIsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <ReportOnEmployeeSickLeaveCreditsPdf reportOnEmpSickLeaveCreditsDoc={ReportOnEmpSickLeaveCreditsDoc} />
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
