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
import DetailedReportOnPersonalBusinessPassSlipCosJoPdf from 'apps/employee-monitoring/src/components/pdf/DetailedReportOnPersonalBusinessPassSlipCosJo';

const Index = () => {
  const router = useRouter();

  // fetch data for Detailed Report On Personal Business Pass Slip Document
  const {
    data: swrDetailedReportOnPersonalBusinessPassSlipDocument,
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
    DetailedReportOnPbPassSlipCosJoDoc,
    SetDetailedReportOnPbPassSlipCosJoDoc,
    ErrorDetailedReportOnPbPassSlipCosJoDoc,
    SetErrorDetailedReportOnPbPassSlipCosJoDoc,
  } = useReportsStore((state) => ({
    DetailedReportOnPbPassSlipCosJoDoc: state.detailedReportOnPbPassSlipCosJoDoc,
    SetDetailedReportOnPbPassSlipCosJoDoc: state.setDetailedReportOnPbPassSlipCosJoDoc,

    ErrorDetailedReportOnPbPassSlipCosJoDoc: state.errorDetailedReportOnPbPassSlipCosJoDoc,
    SetErrorDetailedReportOnPbPassSlipCosJoDoc: state.setErrorDetailedReportOnPbPassSlipCosJoDoc,
  }));

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrDetailedReportOnPersonalBusinessPassSlipDocument)) {
      SetDetailedReportOnPbPassSlipCosJoDoc(swrDetailedReportOnPersonalBusinessPassSlipDocument.data);
    }

    if (!isEmpty(swrError)) {
      SetErrorDetailedReportOnPbPassSlipCosJoDoc(swrError.message);
    }
  }, [swrDetailedReportOnPersonalBusinessPassSlipDocument, swrError]);

  return (
    <>
      <Can I="access" this="Reports">
        <div className="w-full">
          <BreadCrumbs
            title="Detailed Report on Personal Business Pass Slip (COS/JO)"
            crumbs={[
              {
                layerNo: 1,
                layerText: 'Reports',
                path: '/reports',
              },
              { layerNo: 2, layerText: 'Detailed Report on Personal Business Pass Slip (COS/JO)', path: '' },
            ]}
          />

          {/* Error Notifications */}
          {!isEmpty(ErrorDetailedReportOnPbPassSlipCosJoDoc) ? (
            <ToastNotification
              toastType="error"
              notifMessage={'Network Error: Failed to retrieve Detailed Report on Personal Business Pass Slip Document'}
            />
          ) : null}

          <div className="flex flex-col w-full gap-6 px-5">
            <Card>
              {swrIsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <DetailedReportOnPersonalBusinessPassSlipCosJoPdf
                  detailedReportOnPbPassSlipCosJoDoc={DetailedReportOnPbPassSlipCosJoDoc}
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
