import dayjs from 'dayjs';
import { HiOutlineCalendar } from 'react-icons/hi';

type PrfDateCardProps = {
  label: string;
  date: Date;
};

export const PrfDateCard = ({ label, date }: PrfDateCardProps) => {
  return (
    <div className="rounded-md border py-3 px-5">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        <HiOutlineCalendar className="h-5 w-5 text-gray-600" />
        <h5 className="mt-1 text-gray-600">{dayjs(date).format('MMMM DD, YYYY')}</h5>
      </div>
    </div>
  );
};
