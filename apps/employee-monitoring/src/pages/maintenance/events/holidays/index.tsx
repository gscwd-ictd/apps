import { GetServerSideProps } from 'next';
import { Holiday } from '../../../../utils/types/holiday.type';
import { HolidayTypes } from '../../../../utils/enum/holiday-types.enum';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTableHrms } from '@gscwd-apps/oneui';
import { Card } from '../../../../components/cards/Card';
import { BreadCrumbs } from '../../../../components/navigations/BreadCrumbs';

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
  {
    _id: '003',
    event: 'Test 2 Day',
    eventDate: '01/01/2023',
    holidayTypes: HolidayTypes.REGULAR_HOLIDAY,
  },
  {
    _id: '004',
    event: 'Test 3 Anniversary',
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

const columnVisibility = { _id: false };

const Index = () => {
  return (
    <div className="min-h-[100%] min-w-full px-4">
      <BreadCrumbs title="Holidays" />

      <Card>
        <DataTableHrms
          data={defaultData}
          columns={columns}
          columnVisibility={columnVisibility}
          paginate
        />
      </Card>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};

export default Index;
