import { format } from 'date-fns';
import { HiCheckCircle, HiOutlineClipboardList } from 'react-icons/hi';

interface Props {
  reminders: string;
}
export const RemindersCard: React.FC<Props> = ({ reminders = '' }) => {
  const reminderstemp = [
    {
      id: 1,
      title: 'Health Protocols',
      desc: 'Please follow the Standard Health Protocols by washing your hands before entering the office.',
      date: '2022-11-11T13:00',
      url: '/',
    },
    {
      id: 2,
      title: 'Monetization Letter Request',
      desc: 'All monetization Letter Request should be signed by the respective Division Managers.',
      date: '2022-11-11T13:00',
      url: '/',
    },
    {
      id: 3,
      title: 'Flag Ceremony',
      desc: 'Weekly Flag Ceremonies will now start at 8:00AM.',
      date: '2022-11-15T13:00',
      url: '/',
    },
  ];

  return (
    <div className="w-full h-auto shadow rounded-md bg-white flex flex-col p-4 gap-2">
      <div className="flex gap-2 justify-start items-center">
        <label className="text-lg font-bold text-slate-700">Reminders</label>
        <HiOutlineClipboardList className="w-6 h-6 text-indigo-500" />
      </div>

      {reminderstemp.map((reminder) => {
        return (
          <a href="/test/test" key={reminder.id}>
            <div className="px-1 flex gap-2 justify-between items-center cursor-pointer hover:bg-slate-200">
              <div className="flex flex-row gap-2 items-center justify-start">
                <HiCheckCircle className="w-4 h-4 text-indigo-500" />
                <div className="flex flex-col cursor-pointer">
                  <span className="text-sm font-bold text-slate-700">
                    {reminder.title}
                  </span>
                  <span className="text-xs text-slate-600">
                    {reminder.desc}
                  </span>
                </div>
              </div>
              {/* <div className="text-xs text-slate-600 text-center whitespace-nowrap">{format(new Date(reminder.date), 'MMM dd')}</div> */}
            </div>
          </a>
        );
      })}
    </div>
  );
};
