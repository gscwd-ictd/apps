/* eslint-disable @nx/enforce-module-boundaries */
import { useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/CaslContext';
import { Navigate } from 'apps/employee-monitoring/src/components/router/navigate';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { CHART_TABS } from 'apps/employee-monitoring/src/components/charts/org/chart-config';
import { OrgChartTab } from 'apps/employee-monitoring/src/components/charts/org/OrgChartTab';

/** Charts: tardiness, undertime, leave types, LWOP, pass slip types, time log corrections and overtime per office / department / division */
export default function Index() {
  const [active, setActive] = useState(0);

  return (
    <>
      <Can I="access" this="Charts">
        <div className="w-full">
          <BreadCrumbs title="Charts" />
          <div className="mx-5">
            <Card>
              {/* tabs */}
              <div className="flex flex-row flex-wrap gap-1 mb-5 border-b border-gray-200">
                {CHART_TABS.map((t, i) => (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 ${
                      active === i
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {t.tab}
                  </button>
                ))}
              </div>

              {/* key: each tab keeps its own filters fresh */}
              <OrgChartTab key={CHART_TABS[active].type} config={CHART_TABS[active]} />
            </Card>
          </div>
        </div>
      </Can>

      <Can not I="access" this="Charts">
        <Navigate to="/page-404" />
      </Can>
    </>
  );
}
