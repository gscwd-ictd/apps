// apps/employee-monitoring/src/pages/reports/report-on-pass-slip-deductible-to-pay/index.tsx
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import { useRouter } from 'next/router';

import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import ReportOnPassSlipDeductibleToPayPdf from 'apps/employee-monitoring/src/components/pdf/ReportOnPassSlipDeductibleToPay';
import { useReportsStore } from 'apps/employee-monitoring/src/store/report.store';
import { LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { Navigate } from 'apps/employee-monitoring/src/components/router/navigate';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';

const Index = () => {
  const router = useRouter();

  const {
    data: swrReportOnPassSlipDeductibleToPayDocument,
    error: swrReportOnPassSlipDeductibleToPayDocumentError,
    isLoading: swrReportOnPassSlipDeductibleToPayDocumentIsLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_BE_DOMAIN}/reports/?report=${router.query.reportName}&month_year=${router.query.month_year}`,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // Zustand initialization
  const {
    ReportOnPassSlipDeductibleToPay,
    SetReportOnPassSlipDeductibleToPay,
    ErrorReportOnPassSlipDeductibleToPay,
    SetErrorReportOnPassSlipDeductibleToPay,
  } = useReportsStore((state) => ({
    ReportOnPassSlipDeductibleToPay: state.reportOnPassSlipDeductibleToPayDoc,
    SetReportOnPassSlipDeductibleToPay: state.setReportOnPassSlipDeductibleToPayDoc,
    ErrorReportOnPassSlipDeductibleToPay: state.errorReportOnPassSlipDeductibleToPayDoc,
    SetErrorReportOnPassSlipDeductibleToPay: state.setErrorReportOnPassSlipDeductibleToPayDoc,
  }));

  useEffect(() => {
    if (!isEmpty(swrReportOnPassSlipDeductibleToPayDocument)) {
      SetReportOnPassSlipDeductibleToPay(swrReportOnPassSlipDeductibleToPayDocument.data);
    }

    if (!isEmpty(swrReportOnPassSlipDeductibleToPayDocumentError)) {
      switch (swrReportOnPassSlipDeductibleToPayDocumentError?.response?.status) {
        case 400:
          SetErrorReportOnPassSlipDeductibleToPay('Bad Request');
          break;
        case 401:
          SetErrorReportOnPassSlipDeductibleToPay('Unauthorized');
          break;
        case 403:
          SetErrorReportOnPassSlipDeductibleToPay('Forbidden');
          break;
        case 404:
          SetErrorReportOnPassSlipDeductibleToPay(
            'Report on pass slip deductible to pay in selected month and year is not found'
          );
          break;
        case 500:
          SetErrorReportOnPassSlipDeductibleToPay('Internal Server Error');
          break;
        default:
          SetErrorReportOnPassSlipDeductibleToPay('An error occurred. Please try again later.');
          break;
      }
    }
  }, [swrReportOnPassSlipDeductibleToPayDocument, swrReportOnPassSlipDeductibleToPayDocumentError]);

  return (
    <>
      <Can I="access" this="Reports">
        <div className="w-full">
          <BreadCrumbs
            title="Report on Pass Slip Deductible To Pay"
            crumbs={[
              {
                layerNo: 1,
                layerText: 'Reports',
                path: '/reports',
              },
              { layerNo: 2, layerText: 'Report on Pass Slip Deductible To Pay', path: '' },
            ]}
          />

          {/* Error Notifications */}
          {!isEmpty(ErrorReportOnPassSlipDeductibleToPay) ? (
            <ToastNotification toastType="error" notifMessage={ErrorReportOnPassSlipDeductibleToPay} />
          ) : null}

          <div className="flex flex-col w-full gap-6 px-5">
            <Card>
              {swrReportOnPassSlipDeductibleToPayDocumentIsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <ReportOnPassSlipDeductibleToPayPdf
                  ReportOnPassSlipDeductibleToPayData={ReportOnPassSlipDeductibleToPay}
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
