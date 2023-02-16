import { format } from 'date-fns';
import { HiOutlineClipboardList, HiOutlineExternalLink } from 'react-icons/hi';

interface Props {
  reminders: string;
}
export const RemindersCard: React.FC<Props> = ({ reminders = '' }) => {
  const reminderstemp = [
    {
      id: 1,
      title: 'Force Leave',
      desc: 'Please use your force leaves before November 30 to avoid leave deductions...',
      date: '2022-11-11T13:00',
      url: '/test/test',
    },
    {
      id: 2,
      title: 'Battle of the Bands',
      desc: 'Register now and wins prizes...',
      date: '2022-11-15T13:00',
      url: '/test/test',
    },
  ];

  return (
    <div className="w-full h-auto shadow rounded-md bg-white flex flex-col p-4 gap-2">
      <div className="flex gap-2 justify-start items-center">
        <label className="text-lg font-bold text-slate-700">Reminders</label>
        <HiOutlineClipboardList className="w-8 h-8 text-indigo-500" />
      </div>

      {reminderstemp.map((reminder) => {
        return (
          <a href="/test/test" key={reminder.id}>
            <div className="px-1 flex gap-2 justify-between items-center cursor-pointer hover:bg-slate-200">
              <div className="flex flex-row gap-2 items-center justify-start">
                <HiOutlineExternalLink className="w-8 h-8 text-indigo-500" />
                <div className="flex flex-col cursor-pointer">
                  <span className="text-sm font-bold text-slate-700">{reminder.title}</span>
                  <span className="text-xs text-slate-600">{reminder.desc}</span>
                </div>
              </div>
              <div className="text-xs text-slate-600 text-center whitespace-nowrap">{format(new Date(reminder.date), 'MMM dd')}</div>
            </div>
          </a>
        );
      })}
    </div>
  );
};
