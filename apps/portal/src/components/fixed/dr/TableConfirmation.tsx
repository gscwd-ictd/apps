import { HiBadgeCheck, HiCheck, HiCheckCircle } from 'react-icons/hi';
import { DutyResponsibility } from '../../../types/dr.type';
import { Table, TableBody, TableHeader } from '../table/Table';

type TableConfirmationProps = {
  array: Array<DutyResponsibility>;
};

export const TableConfirmation = ({ array }: TableConfirmationProps) => {
  return (
    <>
      {array.map((dr: DutyResponsibility, index: number) => {
        return (
          <div key={index} className="min-w-[50rem]">
            <div className="flex items-center w-full py-3 my-1 text-sm border rounded-md bg-slate-200 border-slate-100">
              <div className="w-[5%] flex justify-center">
                {' '}
                <HiCheck size={20} fill="#7b42f5" />
              </div>
              <div className="w-[40%] ">
                <p className="w-full pr-1 whitespace-pre-line "> {dr.description}</p>
              </div>
              <div className="w-[8%]">{dr.competency.code}</div>
              <div className="w-[20%]">{dr.competency.name}</div>
              <div className="w-[12%] flex justify-center">{dr.competency.level}</div>
              <div className="flex flex-row items-center justify-center w-[15%]">
                <div className="px-5 bg-indigo-200 rounded">{dr.percentage}%</div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
