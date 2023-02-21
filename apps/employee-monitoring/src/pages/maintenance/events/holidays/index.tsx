import { GetServerSideProps } from 'next';
import { Holiday } from '../../../../utils/types/holiday.type';
import { HolidayTypes } from '../../../../utils/enum/holiday-types.enum';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTableHrms } from '@gscwd-apps/oneui';

const defaultData: Holiday[] = [
  {
    _id: '001',
    event: "New Year's Day",
    eventDate: '01/01/2023',
    holidayTypes: HolidayTypes.REGULAR_HOLIDAY,
  },
  {
    _id: '002',
    event: 'EDSA People Power Revolution Anniversary',
    eventDate: '02/25/2023',
    holidayTypes: HolidayTypes.SPECIAL_HOLIDAY,
  },
];

const columnHelper = createColumnHelper<Holiday>();

const columns = [
  columnHelper.accessor('_id', {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.event, {
    id: 'event',
    header: () => 'Event',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('eventDate', {
    header: () => 'Age',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('holidayTypes', {
    header: () => 'Visits',
  }),
];

const Index = () => {
  return (
    <div>
      <DataTableHrms data={defaultData} columns={columns} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};

export default Index;
