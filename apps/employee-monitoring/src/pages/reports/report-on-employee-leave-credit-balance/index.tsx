import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import { useRouter } from 'next/router';

import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import ReportOnEmployeeLeaveCreditBalancePdf from 'apps/employee-monitoring/src/components/pdf/ReportOnEmployeeLeaveCreditBalance';
import { useReportsStore } from 'apps/employee-monitoring/src/store/report.store';
import { LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { Navigate } from 'apps/employee-monitoring/src/components/router/navigate';

const Index = () => {
  const router = useRouter();

  // fetch data for Report On Employee Leave Credit Balance Document
  const {
    data: swrReportOnEmpLeaveCreditBalanceDocument,
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
    ReportOnEmpLeaveCreditsBalanceDoc,
    SetReportOnEmpLeaveCreditsBalanceDoc,
    ErrorReportOnEmpLeaveCreditsBalanceDoc,
    SetErrorReportOnEmpLeaveCreditsBalanceDoc,
  } = useReportsStore((state) => ({
    ReportOnEmpLeaveCreditsBalanceDoc: state.reportOnEmpLeaveCreditsBalanceDoc,
    SetReportOnEmpLeaveCreditsBalanceDoc: state.setReportOnEmpLeaveCreditsBalanceDoc,

    ErrorReportOnEmpLeaveCreditsBalanceDoc: state.errorReportOnEmpLeaveCreditsBalanceDoc,
    SetErrorReportOnEmpLeaveCreditsBalanceDoc: state.setErrorReportOnEmpLeaveCreditsBalanceDoc,
  }));

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrReportOnEmpLeaveCreditBalanceDocument)) {
      SetReportOnEmpLeaveCreditsBalanceDoc(swrReportOnEmpLeaveCreditBalanceDocument.data);
    }

    if (!isEmpty(swrError)) {
      SetErrorReportOnEmpLeaveCreditsBalanceDoc(swrError.message);
    }
  }, [swrReportOnEmpLeaveCreditBalanceDocument, swrError]);

  return (
    <>
      <Can I="access" this="Reports">
        <div className="w-full">
          <BreadCrumbs
            title="Report on Employee Leave Credit Balance"
            crumbs={[
              {
                layerNo: 1,
                layerText: 'Reports',
                path: '/reports',
              },
              { layerNo: 2, layerText: 'Report on Employee Leave Credit Balance', path: '' },
            ]}
          />

          {/* Error Notifications */}
          {!isEmpty(ErrorReportOnEmpLeaveCreditsBalanceDoc) ? (
            <ToastNotification
              toastType="error"
              notifMessage={'Network Error: Failed to retrieve Report on Employee Leave Credit Balance Document'}
            />
          ) : null}

          <div className="flex flex-col w-full gap-6 px-5">
            <Card>
              {swrIsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <ReportOnEmployeeLeaveCreditBalancePdf
                  reportOnEmployeeLeaveCreditBalanceData={ReportOnEmpLeaveCreditsBalanceDoc}
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
