import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import { useRouter } from 'next/router';

import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import DetailedReportOnOfficialBusinessPassSlipPdf from 'apps/employee-monitoring/src/components/pdf/DetailedReportOnOfficialBusinessPassSlip';
import { useReportsStore } from 'apps/employee-monitoring/src/store/report.store';
import { LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { Navigate } from 'apps/employee-monitoring/src/components/router/navigate';

const Index = () => {
  const router = useRouter();

  // fetch data for Detailed Report On Official Business Pass Slip Document
  const {
    data: swrDetailedReportOnOfficialBusinessPassSlipDocument,
    error: swrError,
    isLoading: swrIsLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_BE_DOMAIN}/reports/?report=${router.query.reportName}&date_from=${
      router.query.date_from
    }&date_to=${router.query.date_to}&employee_id=${
      !isEmpty(router.query.employee_id) ? router.query.employee_id : ''
    }`,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // Zustand initialization
  const {
    DetailedReportOnObPassSlipDoc,
    SetDetailedReportOnObPassSlipDoc,
    ErrorDetailedReportOnObPassSlipDoc,
    SetErrorDetailedReportOnObPassSlipDoc,
  } = useReportsStore((state) => ({
    DetailedReportOnObPassSlipDoc: state.detailedReportOnObPassSlipDoc,
    SetDetailedReportOnObPassSlipDoc: state.setDetailedReportOnObPassSlipDoc,

    ErrorDetailedReportOnObPassSlipDoc: state.errorDetailedReportOnObPassSlipDoc,
    SetErrorDetailedReportOnObPassSlipDoc: state.setErrorDetailedReportOnObPassSlipDoc,
  }));

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrDetailedReportOnOfficialBusinessPassSlipDocument)) {
      SetDetailedReportOnObPassSlipDoc(swrDetailedReportOnOfficialBusinessPassSlipDocument.data);
    }

    if (!isEmpty(swrError)) {
      SetErrorDetailedReportOnObPassSlipDoc(swrError.message);
    }
  }, [swrDetailedReportOnOfficialBusinessPassSlipDocument, swrError]);

  return (
    <>
      <Can I="access" this="Reports">
        <div className="w-full">
          <BreadCrumbs
            title="Detailed Report on Official Business Pass Slip"
            crumbs={[
              {
                layerNo: 1,
                layerText: 'Reports',
                path: '/reports',
              },
              { layerNo: 2, layerText: 'Detailed Report on Official Business Pass Slip', path: '' },
            ]}
          />

          {/* Error Notifications */}
          {!isEmpty(ErrorDetailedReportOnObPassSlipDoc) ? (
            <ToastNotification
              toastType="error"
              notifMessage={'Network Error: Failed to retrieve Detailed Report on Official Business Pass Slip Document'}
            />
          ) : null}

          <div className="flex flex-col w-full gap-6 px-5">
            <Card>
              {swrIsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <DetailedReportOnOfficialBusinessPassSlipPdf
                  detailedReportOnObPassSlipDoc={DetailedReportOnObPassSlipDoc}
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
