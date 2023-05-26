import { Button, ListDef, Select } from '@gscwd-apps/oneui';
import { format } from 'date-fns';
import { HiOutlineSearch } from 'react-icons/hi';
import { useDtrStore } from '../../../../src/store/dtr.store';

type Month = { month: string; code: string };
type Year = { year: string };

export const DtrDateSelect = () => {
  const selectedMonth = useDtrStore((state) => state.selectedMonth);
  const selectedYear = useDtrStore((state) => state.selectedYear);
  const date = useDtrStore((state) => state.date);

  const setSelectedMonth = useDtrStore((state) => state.setSelectedMonth);
  const setSelectedYear = useDtrStore((state) => state.setSelectedYear);
  const setDate = useDtrStore((state) => state.setDate);

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

  const years = [
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
    setDate(
      `${selectedMonth ? selectedMonth : monthNow}-01-${
        selectedYear ? selectedYear : yearNow
      }`
    );
  };

  return (
    <form className="flex flex-col md:flex-row justify-end gap-2">
      <Select
        className="w-28 md:w-40"
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
      <Button
        variant={'primary'}
        size={'sm'}
        loading={false}
        onClick={(e) => searchDtr(e)}
        type="submit"
      >
        <div className="flex justify-center">
          <HiOutlineSearch className="w-6 h-6 md:w-5 md:h-5" />
        </div>
      </Button>
    </form>
  );
};
