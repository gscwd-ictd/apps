import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import { useRouter } from 'next/router';

import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { useReportsStore } from 'apps/employee-monitoring/src/store/report.store';
import { LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { Navigate } from 'apps/employee-monitoring/src/components/router/navigate';
import ReportOnLeaveApplicationLateFilingPdf from 'apps/employee-monitoring/src/components/pdf/ReportOnLeaveApplicationLateFiling';

const Index = () => {
  const router = useRouter();

  // fetch data for Report On Unused Pass Slip Document
  const {
    data: swrReportOnLeaveApplicationLateFilingDocument,
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
  const {
    ReportOnLeaveApplicationLateFilingDoc,
    SetReportOnUnusedPassSlipDoc,
    ErrorReportOnUnusedPassSlipDoc,
    SetErrorReportOnUnusedPassSlipDoc,
  } = useReportsStore((state) => ({
    ReportOnLeaveApplicationLateFilingDoc: state.reportOnLeaveApplicationLateFilingDoc,
    SetReportOnUnusedPassSlipDoc: state.setReportOnLeaveApplicationLaeFilingDoc,

    ErrorReportOnUnusedPassSlipDoc: state.errorReportOnLeaveApplicationLateFilingDoc,
    SetErrorReportOnUnusedPassSlipDoc: state.setErrorReportOnLeaveApplicationLateFilingDoc,
  }));

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrReportOnLeaveApplicationLateFilingDocument)) {
      SetReportOnUnusedPassSlipDoc(swrReportOnLeaveApplicationLateFilingDocument.data);
    }

    if (!isEmpty(swrError)) {
      SetErrorReportOnUnusedPassSlipDoc(swrError.message);
    }
  }, [swrReportOnLeaveApplicationLateFilingDocument, swrError]);

  return (
    <>
      <Can I="access" this="Reports">
        <div className="w-full">
          <BreadCrumbs
            title="Report on Leave Application (Late Filing)"
            crumbs={[
              {
                layerNo: 1,
                layerText: 'Reports',
                path: '/reports',
              },
              { layerNo: 2, layerText: 'Report on Leave Application (Late Filing)', path: '' },
            ]}
          />

          {/* Error Notifications */}
          {!isEmpty(ErrorReportOnUnusedPassSlipDoc) ? (
            <ToastNotification
              toastType="error"
              notifMessage={'Network Error: Failed to retrieve Report on Leave Application (Late Filing) Document'}
            />
          ) : null}

          <div className="flex flex-col w-full gap-6 px-5">
            <Card>
              {swrIsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <ReportOnLeaveApplicationLateFilingPdf
                  reportOnLeaveApplicationLateFilingDoc={ReportOnLeaveApplicationLateFilingDoc}
                />
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
