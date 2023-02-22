import { format } from 'date-fns';

interface Props {
  timeIn: string;
  lunchOut: string;
  lunchIn: string;
  timeOut: string;
  dateNow: string;
}
export const AttendanceCard: React.FC<Props> = ({
  timeIn,
  lunchOut,
  lunchIn,
  timeOut,
  dateNow,
}) => {
  return (
    <div className="w-full h-auto shadow rounded-md bg-white flex flex-col p-4 gap-2">
      <label className="text-2xl text-stone-500 font-bold text-center">
        {format(new Date(dateNow), 'MMMM dd, yyyy')}
      </label>
      <div className="flex flex-row justify-around items-center">
        <div className="flex flex-col justify-center items-center">
          <label className="text-xl font-bold text-slate-700">TIME IN</label>
          <label className="text-md text-red-600">{timeIn}</label>
        </div>
        <div className="flex flex-col justify-center items-center">
          <label className="text-xl font-bold text-slate-700">LUNCH OUT</label>
          <label className="text-md text-green-600">{lunchOut}</label>
        </div>
        <div className="flex flex-col justify-center items-center">
          <label className="text-xl font-bold text-slate-700">LUNCH IN</label>
          <label className="text-md text-green-600">{lunchIn}</label>
        </div>
        <div className="flex flex-col justify-center items-center">
          <label className="text-xl font-bold text-slate-700">TIME OUT</label>
          <label className="text-md text-green-600">{timeOut}</label>
        </div>
      </div>
    </div>
  );
};
