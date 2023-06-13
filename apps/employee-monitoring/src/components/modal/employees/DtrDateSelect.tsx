import { Button, ListDef, Select } from '@gscwd-apps/oneui';
import { useDtrStore } from 'apps/employee-monitoring/src/store/dtr.store';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

type Month = { month: string; code: string };
type Year = { year: string };

export const DtrDateSelect = () => {
  const {
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    setIsDateSearched,
  } = useDtrStore((state) => ({
    selectedMonth: state.selectedMonth,
    selectedYear: state.selectedYear,
    setSelectedMonth: state.setSelectedMonth,
    setSelectedYear: state.setSelectedYear,
    setIsDateSearched: state.setIsDateSearched,
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

  const years = [
    { year: '--' },
    { year: `${yearNow}` },
    { year: `${Number(yearNow) - 1}` },
  ] as Year[];

  //month select
  const list: ListDef<Month> = {
    key: 'month',
    render: (info, state) => (
      <div
        className={`${
          state.active ? 'bg-indigo-200' : state.selected ? 'bg-slate-200' : ''
        } pl-2 cursor-pointer`}
      >
        {info.month}
      </div>
    ),
  };

  //year select
  const yearList: ListDef<Year> = {
    key: 'year',
    render: (info, state) => (
      <div
        className={`${
          state.active ? 'bg-indigo-200' : state.selected ? 'bg-slate-200 ' : ''
        } pl-4 cursor-pointer`}
      >
        {info.year}
      </div>
    ),
  };

  const onChangeMonth = (month: string) => {
    setSelectedMonth(month);
  };

  const onChangeYear = (year: string) => {
    setSelectedYear(year);
  };

  const searchDtr = (e) => {
    e.preventDefault();
    setIsDateSearched(true);
  };

  return (
    <div className="flex justify-end gap-2">
      <Select
        className="w-40"
        data={months}
        textSize="sm"
        // initial={months[Number(monthNow) - 1]}
        initial={months[0]}
        listDef={list}
        onSelect={(selectedItem) => onChangeMonth(selectedItem.code)}
      />
      <Select
        className="w-28"
        data={years}
        textSize="sm"
        initial={years[0]}
        listDef={yearList}
        onSelect={(selectedItem) => onChangeYear(selectedItem.year)}
      />

      <Button
        variant={'info'}
        size={'sm'}
        loading={false}
        onClick={(e) => searchDtr(e)}
        type="button"
        disabled={
          selectedMonth === '--' || selectedYear === '--' ? true : false
        }
      >
        <HiOutlineSearch className="w-4 h-4" />
      </Button>
    </div>
  );
};
