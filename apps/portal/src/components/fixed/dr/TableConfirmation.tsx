import { HiBadgeCheck, HiCheck, HiCheckCircle } from 'react-icons/hi';
import { DutyResponsibility } from '../../../types/dr.type';
import { Table, TableBody, TableHeader } from '../table/Table';

type TableConfirmationProps = {
  array: Array<DutyResponsibility>;
};

export const TableConfirmation = ({ array }: TableConfirmationProps) => {
  return (
    <Table
      tableHeader={
        <>
          {/* <TableHeader header="Description" className="flex justify-start font-medium text-slate-600 text-md w-[75%]" />
          <TableHeader header="Percentage" className="flex justify-center font-medium text-slate-600 text-md w-[25%]" /> */}
          {/* <TableHeader header="" className="font-normal w-[2%] flex justify-start" />
          <TableHeader header="" className="font-normal w-[3%] flex justify-start" />
          <TableHeader header="Description" className="font-normal w-[40%] flex justify-start" />
          <TableHeader header="Code" className="font-normal w-[5%] flex justify-start" />
          <TableHeader header="Name" className="font-normal w-[20%] flex justify-start" />
          <TableHeader header="Proficiency Level" className="font-normal w-[15%] flex justify-start" />
          <TableHeader header="Percentage" className="font-normal w-[15%] flex justify-center" /> */}
        </>
      }
      tableBody={
        <>
          <TableBody
            children={
              <>
                {array.map((dr: DutyResponsibility, index: number) => {
                  return (
                    <tr key={index}>
                      <td className="flex items-center py-3 bg-slate-200 border border-slate-100 rounded-md my-1 text-sm">
                        <div className="w-[5%] flex justify-center">
                          {' '}
                          <HiCheck size={20} fill="#7b42f5" />
                        </div>
                        <div className="w-[40%] ">
                          <p className="w-full pr-1"> {dr.description}</p>
                        </div>
                        <div className="w-[5%]">{dr.competency.code}</div>
                        <div className="w-[20%]">{dr.competency.name}</div>
                        <div className="w-[15%] flex justify-center">{dr.competency.level}</div>
                        <div className="flex flex-row items-center justify-center w-[15%]">
                          <div className="bg-indigo-200 px-5 rounded">{dr.percentage}%</div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </>
            }
          />
        </>
      }
    />
  );
};
