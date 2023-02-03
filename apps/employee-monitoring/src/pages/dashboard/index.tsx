import { CardEmployee } from '../../components/cards/CardEmployee';
import { Holidays } from '../../components/cards/Holidays';
import { TardinessChart } from '../../components/charts/Tardiness';
import { PendingDashboard } from '../../components/layouts/PendingDashboard';
import { BreadCrumbs } from '../../components/navigations/BreadCrumbs';

export function Index() {
  return (
    <div className="min-h-[100%] min-w-full">
      <BreadCrumbs title="" />
      <div className="relative w-full h-full gap-5 px-5 lg:flex lg:flex-row md:flex md:flex-col sm:flex sm:flex-col">
        <div className="sm:w-full lg:w-[30%] min-w-[18rem] h-full flex flex-col gap-5 ">
          <CardEmployee />
          <Holidays />
        </div>

        <section className="flex flex-col sm:w-full lg:w-[70%] h-full gap-5">
          <PendingDashboard />
          <TardinessChart />
        </section>
      </div>
    </div>
  );
}

export default Index;
