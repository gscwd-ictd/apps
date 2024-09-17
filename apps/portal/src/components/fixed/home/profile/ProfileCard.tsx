/* eslint-disable @nx/enforce-module-boundaries */
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';

/* eslint-disable @next/next/no-img-element */
interface Props {
  fullName: string;
  position: string;
  division: string;
  photoUrl: string;
}
export const ProfileCard: React.FC<Props> = ({ fullName, position, division, photoUrl }) => {
  const photoUrl_temp = '/profile.jpg';
  const { windowHeight } = UseWindowDimensions();
  const employee = useEmployeeStore((state) => state.employeeDetails);

  return (
    <div
      className={`${
        windowHeight > 820 ? 'h-full' : 'h-full'
      } w-full border-blue-800 shadow bg-white flex gap-1 flex-col justify-center items-center text-center rounded p-5`}
    >
      <img
        className="rounded-full border border-stone-100 shadow w-2/4"
        src={photoUrl ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL + photoUrl : photoUrl_temp}
        alt={'photo'}
      ></img>
      <label className="text-xl font-medium text-gray-800 pt-2">{fullName}</label>
      <label className="text-md font-medium text-gray-400">{position}</label>
      <label className="text-xs font-medium text-gray-400">{division}</label>
      {employee.employmentDetails.officerOfTheDay.length > 0 ? (
        <label className="text-sm font-medium text-green-400">Officer of the Day</label>
      ) : null}
    </div>
  );
};
