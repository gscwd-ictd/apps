import { Button, ListDef, Select } from '@gscwd-apps/oneui';
import { format } from 'date-fns';
import { HiOutlineSearch } from 'react-icons/hi';
import { useDtrStore } from '../../../../src/store/dtr.store';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { EmployeeDetails } from 'apps/portal/src/types/employee.type';
import { useEffect } from 'react';
import { UseCapitalizer } from 'apps/employee-monitoring/src/utils/functions/Capitalizer';

type Month = { month: string; code: string };
type Year = { year: string };
type Period = { period: string };

type DtrDateSelectProps = {
  employeeDetails: EmployeeDetails;
};

export const DtrDateSelect = ({ employeeDetails }: DtrDateSelectProps) => {
  const { responseUpdateDtr, setDtrModalIsOpen } = useDtrStore((state) => ({
    responseUpdateDtr: state.response.employeeDailyRecord,
    setDtrModalIsOpen: state.setDtrModalIsOpen,
  }));

  const selectedMonth = useDtrStore((state) => state.selectedMonth);
  const selectedYear = useDtrStore((state) => state.selectedYear);

  const setSelectedMonth = useDtrStore((state) => state.setSelectedMonth);
  const setSelectedYear = useDtrStore((state) => state.setSelectedYear);
  const setDate = useDtrStore((state) => state.setDate);
  const getEmployeeDtr = useDtrStore((state) => state.getEmployeeDtr);
  const getEmployeeDtrSuccess = useDtrStore((state) => state.getEmployeeDtrSuccess);
  const getEmployeeDtrFail = useDtrStore((state) => state.getEmployeeDtrFail);
  const emptyResponseAndError = useDtrStore((state) => state.emptyResponseAndError);
  const setDtrPdfModalIsOpen = useDtrStore((state) => state.setDtrPdfModalIsOpen);

  const getEmployeeDtrPdf = useDtrStore((state) => state.getEmployeeDtrPdf);
  const getEmployeeDtrPdfSuccess = useDtrStore((state) => state.getEmployeeDtrPdfSuccess);
  const getEmployeeDtrPdfFail = useDtrStore((state) => state.getEmployeeDtrPdfFail);
  const setSelectedPeriod = useDtrStore((state) => state.setSelectedPeriod);

  const monthNow = format(new Date(), 'M');
  const yearNow = format(new Date(), 'yyyy');

  const months = [
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

  const dtrPeriod = [{ period: 'First Period PDF' }, { period: 'Second Period PDF' }, { period: 'Whole Month PDF' }];

  const years = [{ year: `${yearNow}` }, { year: `${Number(yearNow) - 1}` }] as Year[];

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

  //period select
  const periodDtrList: ListDef<Period> = {
    key: 'period',
    render: (info, state) => (
      <div className={`${state.active ? 'bg-indigo-200' : state.selected ? 'bg-slate-200 ' : ''} pl-4 cursor-pointer`}>
        {info.period}
      </div>
    ),
  };

  const onChangeMonth = (month: string) => {
    setSelectedMonth(month);
  };

  const onChangeYear = (year: string) => {
    setSelectedYear(year);
  };

  useEffect(() => {
    setSelectedYear(format(new Date(), 'yyyy'));
    setSelectedMonth(format(new Date(), 'M'));
  }, []);

  const handlePdfModal = async (selectedPeriod: string) => {
    let period = '';
    //mutate search
    if (selectedPeriod === 'First Period PDF') {
      period = 'first';
    } else if (selectedPeriod === 'Second Period PDF') {
      period = 'second';
    } else {
      period = '';
    }
    setSelectedPeriod(period);
    if (period != '') {
      getEmployeeDtrPdf(true);
      setDtrPdfModalIsOpen(true);
      if (employeeDetails.employmentDetails.companyId && selectedYear && selectedMonth) {
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/daily-time-record/employees/${employeeDetails.employmentDetails.companyId}/${selectedYear}/${selectedMonth}?half=${period}`
          );

          if (!isEmpty(data)) {
            getEmployeeDtrPdfSuccess(false, data);
          }
        } catch (error) {
          getEmployeeDtrPdfFail(false, error.message);
        }

        setDate(`${selectedMonth ? selectedMonth : monthNow}-01-${selectedYear ? selectedYear : yearNow}`);
      }
    } else {
      setDtrPdfModalIsOpen(true);
    }
  };

  const searchDtr = async () => {
    getEmployeeDtr(true);

    if (employeeDetails.employmentDetails.companyId && selectedYear && selectedMonth) {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/daily-time-record/employees/${employeeDetails.employmentDetails.companyId}/${selectedYear}/${selectedMonth}`
        );

        if (!isEmpty(data)) {
          getEmployeeDtrSuccess(false, data);
        }
      } catch (error) {
        getEmployeeDtrFail(false, error.message);
      }

      setDate(`${selectedMonth ? selectedMonth : monthNow}-01-${selectedYear ? selectedYear : yearNow}`);
    }
  };

  return (
    <form className="flex flex-col justify-end gap-2 md:flex-row">
      <Select
        className="w-36 md:w-40"
        data={months}
        initial={months[Number(monthNow) - 1]}
        listDef={list}
        onSelect={(selectedItem) => onChangeMonth(selectedItem.code)}
      />
      <Select
        className="w-36 md:w-28"
        data={years}
        initial={years[0]}
        listDef={yearList}
        onSelect={(selectedItem) => onChangeYear(selectedItem.year)}
      />
      {/* <Button variant={'primary'} size={'sm'} loading={false} onClick={() => searchDtr()} type="button">
        <div className="flex justify-center">
          <HiOutlineSearch className="w-6 h-6 md:w-5 md:h-5" />
        </div>
      </Button> */}

      <Select
        className="w-36 md:w-56"
        data={dtrPeriod}
        initial={dtrPeriod[0]}
        listDef={periodDtrList}
        onSelect={(selectedItem) => handlePdfModal(selectedItem.period)}
      />

      {/* <Button variant={'primary'} size={'md'} loading={false} type="button" onClick={() => handlePdfModal('first')}>
        1st Period
      </Button>
      <Button variant={'primary'} size={'md'} loading={false} type="button" onClick={() => handlePdfModal('second')}>
        2nd Period
      </Button>
      <Button variant={'primary'} size={'md'} loading={false} type="button" onClick={() => handlePdfModal('')}>
        Full DTR
      </Button> */}
    </form>
  );
};
