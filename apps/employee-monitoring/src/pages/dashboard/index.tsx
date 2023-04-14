import { Card } from '../../components/cards/Card';
import { CardEmployee } from '../../components/cards/CardEmployee';
import { Holidays } from '../../components/cards/Holidays';
import { TardinessChart } from '../../components/charts/Tardiness';
import { PendingDashboard } from '../../components/layouts/PendingDashboard';
import { BreadCrumbs } from '../../components/navigations/BreadCrumbs';

export function Index() {
  return (
    <div className="w-full">
      <BreadCrumbs title="" />
      <div className="sm:mx-0 md:mx-0 lg:mx-5 ">
        <Card>
          <div className="gap-5 lg:flex lg:flex-row md:flex md:flex-col sm:flex sm:flex-col">
            <section className="sm:w-full md:w-full lg:w-[30%] flex flex-col gap-5 ">
              <CardEmployee />
              <Holidays />
            </section>

            <section className="flex flex-col sm:w-full lg:w-[70%] h-full gap-5">
              <PendingDashboard />

              <TardinessChart />
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Index;
