import { Can } from 'apps/employee-monitoring/src/context/casl/CaslContext';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import { useRouter } from 'next/router';

import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import ReportOnWellnessPassPdf from 'apps/employee-monitoring/src/components/pdf/ReportOnWellnessPass';
import { LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { Navigate } from 'apps/employee-monitoring/src/components/router/navigate';
import { ReportOnWellnessPass } from 'apps/employee-monitoring/src/utils/types/report.type';

const Index = () => {
  const router = useRouter();

  // fetch data for Report On Wellness Pass Document
  const { data, error, isLoading } = useSWR(
    router.isReady
      ? `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_BE_DOMAIN}/reports/?report=${
          router.query.reportName
        }&date_from=${router.query.date_from}&date_to=${router.query.date_to}&employee_id=${
          router.query.employee_id ?? ''
        }`
      : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  return (
    <>
      <Can I="access" this="Reports">
        <div className="w-full">
          <BreadCrumbs
            title="Report on Wellness Pass"
            crumbs={[
              {
                layerNo: 1,
                layerText: 'Reports',
                path: '/reports',
              },
              { layerNo: 2, layerText: 'Report on Wellness Pass', path: '' },
            ]}
          />

          {/* Error Notifications */}
          {!isEmpty(error) ? (
            <ToastNotification
              toastType="error"
              notifMessage={'Network Error: Failed to retrieve Report on Wellness Pass Document'}
            />
          ) : null}

          <div className="flex flex-col w-full gap-6 px-5">
            <Card>
              {isLoading || isEmpty(data) ? (
                <LoadingSpinner size="lg" />
              ) : (
                <ReportOnWellnessPassPdf reportOnWellnessPassDoc={data.data as ReportOnWellnessPass} />
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
