import { Card } from './Card';

export const Holidays = () => {
  return (
    <div className="w-full  flex static h-[22rem] rounded">
      <Card title="Upcoming Holidays" className="border-none rounded">
        <div className="flex flex-col w-full h-full pb-5 text-xs">
          <span className="text-gray-500"> Regular Holidays</span>
          <div className="flex flex-col w-full px-2">
            <div className="flex">
              <div className="w-[30%]">• April 6 -</div>
              <div className="w-[70%]">Maundy Thursday</div>
            </div>
            <div className="flex">
              <div className="w-[30%]">• April 7 -</div>
              <div className="w-[70%]">Good Friday</div>
            </div>
            <div className="flex">
              <div className="w-[30%]">• April 10 -</div>
              <div className="w-[70%]">Araw ng Kagitingan</div>
            </div>
            <div className="flex">
              <div className="w-[30%]">• May 1 -</div>
              <div className="w-[70%]">Labor Day</div>
            </div>
            <div className="flex">
              <div className="w-[30%]">• June 12 -</div>
              <div className="w-[70%]">Independence Day</div>
            </div>
          </div>
          <br />
          <span className="text-gray-500"> Special non-working Holidays</span>
          <div className="px-2">
            <div className="flex">
              <div className="w-[30%]">• February 25 -</div>
              <div className="w-[70%]">EDSA People Power Revolution Day</div>
            </div>
            <div className="flex">
              <div className="w-[30%]">• April 8 -</div>
              <div className="w-[70%]">Black Saturday</div>
            </div>
            <div className="flex">
              <div className="w-[30%]">• August 21 -</div>
              <div className="w-[70%]">Ninoy Aquino Day</div>
            </div>
          </div>
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
