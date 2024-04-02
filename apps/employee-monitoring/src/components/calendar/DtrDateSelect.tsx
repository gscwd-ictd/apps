import { Button, ListDef, Select } from '@gscwd-apps/oneui';
import { useDtrStore } from 'apps/employee-monitoring/src/store/dtr.store';
import { format } from 'date-fns';
import { useEffect, FunctionComponent } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { EmployeeWithDetails } from 'libs/utils/src/lib/types/employee.type';
import axios from 'axios';
import { isEmpty } from 'lodash';

type Month = { month: string; code: string };
type Year = { year: string };

type EmployeeDtrTableProps = {
  employeeData: EmployeeWithDetails;
};

export const DtrDateSelect: FunctionComponent<EmployeeDtrTableProps> = ({ employeeData }) => {
  const {
    SelectedMonth,
    SetSelectedMonth,

    SelectedYear,
    SetSelectedYear,

    IsDateSearched,
    SetIsDateSearched,

    GetEmployeeDtr,
    GetEmployeeDtrFail,
    GetEmployeeDtrSuccess,
  } = useDtrStore((state) => ({
    SelectedMonth: state.selectedMonth,
    SetSelectedMonth: state.setSelectedMonth,

    SelectedYear: state.selectedYear,
    SetSelectedYear: state.setSelectedYear,

    IsDateSearched: state.isDateSearched,
    SetIsDateSearched: state.setIsDateSearched,

    GetEmployeeDtr: state.getEmployeeDtr,
    GetEmployeeDtrSuccess: state.getEmployeeDtrSuccess,
    GetEmployeeDtrFail: state.getEmployeeDtrFail,
  }));

  const monthNow = format(new Date(), 'M');
  const yearNow = format(new Date(), 'yyyy');

  const months = [
    { month: '--', code: '--' },
    { month: 'January', code: '01' },
    { month: 'February', code: '02' },
    { month: 'March', code: '03' },
    { month: 'April', code: '04' },
    { month: 'May', code: '05' },
    { month: 'June', code: '06' },
    { month: 'July', code: '07' },
    { month: 'August', code: '08' },
    { month: 'September', code: '09' },
    { month: 'October', code: '10' },
    { month: 'November', code: '11' },
    { month: 'December', code: '12' },
  ] as Month[];

  const years = [{ year: '--' }, { year: `${yearNow}` }, { year: `${Number(yearNow) - 1}` }] as Year[];

  //month select
  const list: ListDef<Month> = {
    key: 'month',
    render: (info, state) => (
      <div className={`${state.active ? 'bg-indigo-200' : state.selected ? 'bg-slate-200' : ''} pl-2 cursor-pointer`}>
        {info.month}
      </div>
    ),
  };

  //year select
  const yearList: ListDef<Year> = {
    key: 'year',
    render: (info, state) => (
      <div className={`${state.active ? 'bg-indigo-200' : state.selected ? 'bg-slate-200 ' : ''} pl-4 cursor-pointer`}>
        {info.year}
      </div>
    ),
  };

  // set value for month
  const onChangeMonth = (month: string) => {
    SetSelectedMonth(month);
  };

  // set value for year
  const onChangeYear = (year: string) => {
    SetSelectedYear(year);
  };

  // first load search using curent month & year
  const searchDtr = async () => {
    if (employeeData.companyId && SelectedYear && SelectedMonth) {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_BE_DOMAIN}/daily-time-record/employees/${employeeData.companyId}/${SelectedYear}/${SelectedMonth}`
        );

        if (!isEmpty(data)) {
          GetEmployeeDtrSuccess(data);
        }
      } catch (error) {
        GetEmployeeDtrFail(error.message);
      }
    }
  };

  // set zustand store default year and month value
  useEffect(() => {
    SetSelectedYear(format(new Date(), 'yyyy'));
    SetSelectedMonth(format(new Date(), 'M'));
  }, []);

  // check if selected month and year has been set
  useEffect(() => {
    if (SelectedMonth !== '--' && SelectedYear !== '--') {
      GetEmployeeDtr();
      searchDtr();
    }
  }, [SelectedYear, SelectedMonth]);

  return (
    <div className="flex justify-end gap-2">
      <Select
        className="w-40"
        data={months}
        textSize="sm"
        initial={months[Number(monthNow)]}
        // initial={months[0]}
        listDef={list}
        onSelect={(selectedItem) => onChangeMonth(selectedItem.code)}
      />

      <Select
        className="w-28"
        data={years}
        textSize="sm"
        // initial={years[0]}
        initial={{ year: yearNow }}
        listDef={yearList}
        onSelect={(selectedItem) => onChangeYear(selectedItem.year)}
      />

      <Button
        variant={'info'}
        size={'sm'}
        loading={false}
        onClick={() => SetIsDateSearched(true)}
        type="button"
        disabled={SelectedMonth === '--' || SelectedYear === '--' ? true : false}
      >
        <HiOutlineSearch className="w-4 h-4" />
      </Button>
    </div>
  );
};
