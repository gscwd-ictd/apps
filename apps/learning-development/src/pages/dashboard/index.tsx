import { Card } from '../../components/cards/Card';
import { BreadCrumbs } from '../../components/navigations/BreadCrumbs';

export default function Index() {
  return (
    <div className="w-full">
      <BreadCrumbs title="" />
      <div className="sm:mx-0 md:mx-0 lg:mx-5">
        <Card className="">
          <div className="gap-5 lg:flex lg:flex-row md:flex md:flex-col sm:flex sm:flex-col">
            <div className="flex items-center justify-center w-full h-[calc(100vh-16rem)] ">
              <div className="text-gray-500 xs:text-lg sm:text-xl md:text-5xl lg:text-5xl px-[5%] select-none font-medium">
                Welcome to{' '}
                <span className="text-sky-600">Learning & Development</span>{' '}
                Dashboard
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
