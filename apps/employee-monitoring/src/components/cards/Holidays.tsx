import { Card } from './Card';

export const Holidays = () => {
  return (
    <div className="w-full  flex static h-[22rem] rounded">
      <Card title="Upcoming Holidays" className="border-none rounded">
        <div className="flex flex-col w-full h-full pb-5 text-xs">
          <span className="text-gray-500"> Regular Holidays</span>
          <p className="px-2">
            • Maundy Thursday - April 6
            <br />• Good Friday - April 7
            <br />• Araw ng Kagitingan - April 10 (Monday)
            <br />• Labor Day - May 1 (Monday)
            <br />• Independence Day - June 12 (Monday)
            <br />
            <br />
          </p>
          <span className="text-gray-500"> Special non-working Holidays</span>
          <p className="px-2">
            • Edsa People Power Revolution Anniversary - February 25 (Saturday)
            <br />• Black Saturday - April 8
            <br />• Ninoy Aquino Day - August 21 (Monday)
          </p>
        </div>
        <div className="flex flex-col justify-end">
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
