import { Card } from './Card';

type Holidays = {
  date: string;
  title: string;
};

type Events = {
  date: string;
  title: string;
};

const regularHolidays: Array<Holidays> = [
  { date: 'April 6', title: 'Maundy Thursday' },
  { date: 'April 7', title: 'Good Friday' },
  { date: 'April 10', title: 'Araw ng Kagitingan' },
  { date: 'May 1', title: 'Labor Day' },
  { date: 'June 12', title: 'Independence Day' },
];

const specialHolidays: Array<Holidays> = [
  { date: 'February 25', title: 'EDSA People Power Revolution Day' },
  { date: 'April 8', title: 'Black Saturday' },
  { date: 'August 21', title: 'Ninoy Aquino Day' },
];

const events: Array<Events> = [
  { date: 'February 1-31', title: 'Philippine Heart Month' },
];

export const Holidays = (): JSX.Element => {
  return (
    <div className="w-full  flex static h-[24rem] rounded">
      <Card title="Upcoming Holidays & Events" className="border-none rounded">
        <div className="flex flex-col w-full h-full text-xs">
          {/* Regular Holidays */}
          <span className="text-gray-500"> Regular Holidays</span>
          <div className="flex flex-col w-full px-2 py-1 rounded bg-blue-50">
            {regularHolidays.slice(0, 5).map((holiday, index) => {
              return (
                <div key={index} className="flex gap-2">
                  <div className="w-[30%]">• {holiday.date}</div>
                  <div className="w-[70%]">{holiday.title}</div>
                </div>
              );
            })}
          </div>
          <br />

          {/* Special Holidays */}
          <span className="text-gray-500"> Special non-working Holidays</span>
          <div className="flex flex-col w-full px-2 py-2 rounded bg-blue-50">
            {specialHolidays.slice(0, 5).map((holiday, index) => {
              return (
                <div key={index} className="flex gap-2">
                  <div className="w-[30%]">• {holiday.date}</div>
                  <div className="w-[70%]">{holiday.title}</div>
                </div>
              );
            })}
          </div>
          <br />

          {/* Special Holidays */}
          <span className="text-gray-500"> Events</span>
          <div className="flex flex-col w-full px-2 py-2 rounded bg-blue-50">
            {events.slice(0, 5).map((event, index) => {
              return (
                <div key={index} className="flex gap-2">
                  <div className="w-[30%]">• {event.date}</div>
                  <div className="w-[70%]">{event.title}</div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Button */}
        <div className="flex flex-col justify-end pt-2">
          <div className="w-[16rem]">
            <button className="px-3 py-1 bg-blue-400 rounded">
              <span className="text-xs text-white">View More →</span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
