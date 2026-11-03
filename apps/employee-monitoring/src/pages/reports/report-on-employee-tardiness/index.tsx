import { Can } from 'apps/employee-monitoring/src/context/casl/CaslContext';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import { useRouter } from 'next/router';
import ReportExcelButton from 'apps/employee-monitoring/src/components/buttons/ReportExcelButton';

import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import ReportOnEmployeeTardinessPdf from 'apps/employee-monitoring/src/components/pdf/ReportOnEmployeeTardiness';
import ReportProgressBar from 'apps/employee-monitoring/src/components/progress/ReportProgressBar';
import { ToastNotification } from '@gscwd-apps/oneui';
import { Navigate } from 'apps/employee-monitoring/src/components/router/navigate';
import { ReportOnEmployeeTardiness } from 'apps/employee-monitoring/src/utils/types/report.type';

const Index = () => {
  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    router.isReady
      ? `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_BE_DOMAIN}/reports/?report=${
          router.query.reportName
        }&date_from=${router.query.date_from}&date_to=${router.query.date_to}&org_id=${router.query.org_id ?? ''}`
      : null,
    fetcherEMS,
    { shouldRetryOnError: false, revalidateOnFocus: false }
  );

  return (
    <>
      <Can I="access" this="Reports">
        <div className="w-full">
          <BreadCrumbs
            title="Report on Employee Tardiness"
            crumbs={[
              { layerNo: 1, layerText: 'Reports', path: '/reports' },
              { layerNo: 2, layerText: 'Report on Employee Tardiness', path: '' },
            ]}
          />

          {!isEmpty(error) ? (
            <ToastNotification
              toastType="error"
              notifMessage={'Network Error: Failed to retrieve Report on Employee Tardiness'}
            />
          ) : null}

          <div className="flex flex-col w-full gap-6 px-5">
            <Card>
              {isLoading || isEmpty(data) ? (
                <ReportProgressBar isLoading={true} label="Generating Report on Employee Tardiness" />
              ) : (
                <>
                  <ReportExcelButton
                    title="Report on Employee Tardiness"
                    reportDoc={data.data as ReportOnEmployeeTardiness}
                  />
                  <ReportOnEmployeeTardinessPdf
                    reportOnEmployeeTardinessData={data.data as ReportOnEmployeeTardiness}
                  />
                </>
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
