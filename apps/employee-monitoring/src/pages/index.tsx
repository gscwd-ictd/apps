import { PageContentContext } from '@gscwd-apps/oneui';
import { useContext, useEffect, useState } from 'react';
import { CardEmployee } from '../components/cards/CardEmployee';
import { Holidays } from '../components/cards/Holidays';
import { TardinessChart } from '../components/charts/Tardiness';
import { PendingDashboard } from '../components/layouts/PendingDashboard';

export function Index() {
  const [isMobile, setIsMobile] = useState(false);
  const {
    aside: { setIsCollapsed },
  } = useContext(PageContentContext);

  //choose the screen size
  const handleResize = () => {
    if (window.innerWidth < 1080) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    if (isMobile) setIsCollapsed(true);
    else if (!isMobile) setIsCollapsed(false);
  }, [isMobile, setIsCollapsed]);

  // create an event listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  return (
    <div className="min-h-[100%] min-w-full">
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
