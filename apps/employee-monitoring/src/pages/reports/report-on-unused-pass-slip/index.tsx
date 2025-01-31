import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import { useRouter } from 'next/router';

import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import DetailedReportOnPersonalBusinessPassSlipPdf from 'apps/employee-monitoring/src/components/pdf/DetailedReportOnPersonalBusinessPassSlip';
import { useReportsStore } from 'apps/employee-monitoring/src/store/report.store';
import { LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { Navigate } from 'apps/employee-monitoring/src/components/router/navigate';
import ReportOnUnusedPassSlipPdf from 'apps/employee-monitoring/src/components/pdf/ReportOnUnusedPassSlip';

const Index = () => {
  const router = useRouter();

  // fetch data for Report On Unused Pass Slip Document
  const {
    data: swrReportOnUnusedPassSlipDocument,
    error: swrError,
    isLoading: swrIsLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_BE_DOMAIN}/reports/?report=${router.query.reportName}&date_from=${router.query.date_from}&date_to=${router.query.date_to}&pass_slip=${router.query.pass_slip}`,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // Zustand initialization
  const {
    ReportOnUnusedPassSlipDoc,
    SetReportOnUnusedPassSlipDoc,
    ErrorReportOnUnusedPassSlipDoc,
    SetErrorReportOnUnusedPassSlipDoc,
  } = useReportsStore((state) => ({
    ReportOnUnusedPassSlipDoc: state.reportOnUnusedPassSlipDoc,
    SetReportOnUnusedPassSlipDoc: state.setReportOnUnusedPassSlipDoc,

    ErrorReportOnUnusedPassSlipDoc: state.errorReportOnUnusedPassSlipDoc,
    SetErrorReportOnUnusedPassSlipDoc: state.setErrorReportOnUnusedPassSlipDoc,
  }));

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrReportOnUnusedPassSlipDocument)) {
      SetReportOnUnusedPassSlipDoc(swrReportOnUnusedPassSlipDocument.data);
    }

    if (!isEmpty(swrError)) {
      SetErrorReportOnUnusedPassSlipDoc(swrError.message);
    }
  }, [swrReportOnUnusedPassSlipDocument, swrError]);

  return (
    <>
      <Can I="access" this="Reports">
        <div className="w-full">
          <BreadCrumbs
            title="Report on Unused Pass Slip"
            crumbs={[
              {
                layerNo: 1,
                layerText: 'Reports',
                path: '/reports',
              },
              { layerNo: 2, layerText: 'Report on Unused Pass Slip', path: '' },
            ]}
          />

          {/* Error Notifications */}
          {!isEmpty(ErrorReportOnUnusedPassSlipDoc) ? (
            <ToastNotification
              toastType="error"
              notifMessage={'Network Error: Failed to retrieve Report on Unused Pass Slip Document'}
            />
          ) : null}

          <div className="flex flex-col w-full gap-6 px-5">
            <Card>
              {swrIsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <ReportOnUnusedPassSlipPdf reportOnUnusedPassSlipDoc={ReportOnUnusedPassSlipDoc} />
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
