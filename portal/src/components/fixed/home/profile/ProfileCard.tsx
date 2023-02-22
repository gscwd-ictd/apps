interface Props {
  firstName: string;
  lastName: string;
  position: string;
  division: string;
  photoUrl: string;
}
export const ProfileCard: React.FC<Props> = ({
  firstName,
  lastName,
  position,
  division,
  photoUrl,
}) => {
  const photoUrl_temp = '/profile.jpg';
  return (
    <div className="h-3/5 w-100 border-blue-800 shadow bg-white flex gap-1 flex-col justify-center items-center text-center rounded p-5 mr-5">
      <img
        className="rounded-full border border-stone-100 shadow w-2/4"
        src={photoUrl_temp}
        alt={'sample'}
      ></img>
      <label className="text-xl font-medium text-stone-900 pt-2">
        {firstName} {lastName}
      </label>
      <label className="text-md font-medium text-stone-400">{position}</label>
      <label className="text-xs font-medium text-stone-400">{division}</label>
    </div>
  );
};
