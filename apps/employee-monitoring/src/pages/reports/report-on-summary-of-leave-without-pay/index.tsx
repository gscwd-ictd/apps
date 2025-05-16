import { Can } from 'apps/employee-monitoring/src/context/casl/CaslContext';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import { useRouter } from 'next/router';

import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import ReportOnEmployeeLeaveCreditBalanceWithMoneyPdf from 'apps/employee-monitoring/src/components/pdf/ReportOnEmployeeLeaveCreditBalanceWithMoney';
import { useReportsStore } from 'apps/employee-monitoring/src/store/report.store';
import { LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { Navigate } from 'apps/employee-monitoring/src/components/router/navigate';
import ReportOnSummaryOfLeaveWithoutPayPdf from 'apps/employee-monitoring/src/components/pdf/ReportOnSummaryOfLeaveWithoutPay';

const Index = () => {
  const router = useRouter();

  // fetch data for Report on Summary of Leave Without Pay Document
  const {
    data: swrReportOnSummaryOfLeaveWithoutPayDocument,
    error: swrError,
    isLoading: swrIsLoading,
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
    ReportOnSummaryLeaveWithoutPayDoc,
    SetReportOnSummaryLeaveWithoutPayDoc,
    ErrorReportOnSummaryLeaveWithoutPayDoc,
    SetErrorReportOnSummaryLeaveWithoutPayDoc,
  } = useReportsStore((state) => ({
    ReportOnSummaryLeaveWithoutPayDoc: state.reportOnSummaryLeaveWithoutPayDoc,
    SetReportOnSummaryLeaveWithoutPayDoc: state.setReportOnSummaryLeaveWithoutPayDoc,

    ErrorReportOnSummaryLeaveWithoutPayDoc: state.errorReportOnSummaryLeaveWithoutPayDoc,
    SetErrorReportOnSummaryLeaveWithoutPayDoc: state.setErrorReportOnSummaryLeaveWithoutPayDoc,
  }));

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrReportOnSummaryOfLeaveWithoutPayDocument)) {
      SetReportOnSummaryLeaveWithoutPayDoc(swrReportOnSummaryOfLeaveWithoutPayDocument.data);
    }

    if (!isEmpty(swrError)) {
      SetErrorReportOnSummaryLeaveWithoutPayDoc(swrError.message);
    }
  }, [swrReportOnSummaryOfLeaveWithoutPayDocument, swrError]);

  return (
    <>
      <Can I="access" this="Reports">
        <div className="w-full">
          <BreadCrumbs
            title="Report on Summary of Leave Without Pay"
            crumbs={[
              {
                layerNo: 1,
                layerText: 'Reports',
                path: '/reports',
              },
              { layerNo: 2, layerText: 'Report on Summary of Leave Without Pay', path: '' },
            ]}
          />

          {/* Error Notifications */}
          {!isEmpty(ErrorReportOnSummaryLeaveWithoutPayDoc) ? (
            <ToastNotification
              toastType="error"
              notifMessage={'Network Error: Failed to retrieve Report on Summary of Leave Without Pay Document'}
            />
          ) : null}

          <div className="flex flex-col w-full gap-6 px-5">
            <Card>
              {swrIsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <ReportOnSummaryOfLeaveWithoutPayPdf
                  reportOnSummaryOfLeaveWithoutPayData={ReportOnSummaryLeaveWithoutPayDoc}
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
