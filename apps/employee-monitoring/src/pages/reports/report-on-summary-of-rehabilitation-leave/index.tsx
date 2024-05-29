import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import { useRouter } from 'next/router';

import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import ReportOnEmployeeRehabLeaveCreditsPdf from 'apps/employee-monitoring/src/components/pdf/ReportOnSummaryOfRehabLeave';
import { useReportsStore } from 'apps/employee-monitoring/src/store/report.store';
import { LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { Navigate } from 'apps/employee-monitoring/src/components/router/navigate';

const Index = () => {
  const router = useRouter();

  // fetch data for Report On Summary of Rehabilitation Leave Document
  const {
    data: swrReportOnSummaryOfRehabLeaveDocument,
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
    ReportOnEmpRehabLeaveDoc,
    SetReportOnEmpRehabLeaveDoc,
    ErrorReportOnEmpRehabLeaveDoc,
    SetErrorReportOnEmpRehabLeaveDoc,
  } = useReportsStore((state) => ({
    ReportOnEmpRehabLeaveDoc: state.reportOnEmpRehabLeaveDoc,
    SetReportOnEmpRehabLeaveDoc: state.setReportOnEmpRehabLeaveDoc,

    ErrorReportOnEmpRehabLeaveDoc: state.errorReportOnEmpRehabLeaveDoc,
    SetErrorReportOnEmpRehabLeaveDoc: state.setErrorReportOnEmpRehabLeaveDoc,
  }));

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrReportOnSummaryOfRehabLeaveDocument)) {
      SetReportOnEmpRehabLeaveDoc(swrReportOnSummaryOfRehabLeaveDocument.data);
    }

    if (!isEmpty(swrError)) {
      SetErrorReportOnEmpRehabLeaveDoc(swrError.message);
    }
  }, [swrReportOnSummaryOfRehabLeaveDocument, swrError]);

  return (
    <>
      <Can I="access" this="Reports">
        <div className="w-full">
          <BreadCrumbs
            title="Report on Summary of Rehabilitation Leave"
            crumbs={[
              {
                layerNo: 1,
                layerText: 'Reports',
                path: '/reports',
              },
              { layerNo: 2, layerText: 'Report on Summary of Rehabilitation Leave', path: '' },
            ]}
          />

          {/* Error Notifications */}
          {!isEmpty(ErrorReportOnEmpRehabLeaveDoc) ? (
            <ToastNotification
              toastType="error"
              notifMessage={'Network Error: Failed to retrieve Report on Summary of Rehabilitation Leave'}
            />
          ) : null}

          <div className="flex flex-col w-full gap-6 px-5">
            <Card>
              {swrIsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <ReportOnEmployeeRehabLeaveCreditsPdf reportOnEmpRehabLeaveCreditsDoc={ReportOnEmpRehabLeaveDoc} />
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
