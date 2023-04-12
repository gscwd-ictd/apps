/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import useSWR from 'SWR';

export default function Index() {
  const { data: swrPassSlips, isLoading: swrIsLoading } = useSWR(
    '/pass-slip',
    fetcherEMS,
    { shouldRetryOnError: false, revalidateOnFocus: false }
  );

  return (
    <>
      <div className="min-h-[100%] w-full">
        <BreadCrumbs
          title="Pass Slips"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Pass Slips',
              path: '',
            },
          ]}
        />

        <Can I="access" this="Pass_slips">
          <div className="sm:mx-0 lg:mx-5">
            <Card>a</Card>
          </div>
        </Can>
      </div>
    </>
  );
}
