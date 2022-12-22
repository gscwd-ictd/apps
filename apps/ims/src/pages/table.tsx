// "name": "Hayden Oneil",
// "phone": "1-519-478-9228",
// "email": "nec.diam@hotmail.couk",
// "address": "P.O. Box 973, 2407 Rutrum Rd.",
// "postalZip": "94554-227",
// "region": "Alabama",
// "country": "Singapore"

import { DataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import data from '../../mock/data.json';

type Person = {
  name: string;
  phone: string;
  email: string;
  address: string;
  postalZip: string;
  region: string;
  country: string;
};

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor('name', {
    cell: (info) => <div className="text-sm">{info.getValue()}</div>,
    header: 'Name',
  }),

  columnHelper.accessor('email', {
    cell: (info) => <div className="text-sm">{info.getValue()}</div>,
    header: 'Email address',
  }),

  columnHelper.accessor('phone', {
    cell: (info) => <div className="text-sm">{info.getValue()}</div>,
    header: 'Phone number',
  }),

  columnHelper.accessor('address', {
    cell: (info) => <div className="text-sm">{info.getValue()}</div>,
    header: 'Address',
  }),

  columnHelper.accessor('region', {
    cell: (info) => <div className="text-sm">{info.getValue()}</div>,
    header: 'Region',
  }),

  columnHelper.accessor('country', {
    cell: (info) => <div className="text-sm">{info.getValue()}</div>,
    header: 'Country',
  }),

  columnHelper.accessor('postalZip', {
    cell: (info) => <div className="text-sm">{info.getValue()}</div>,
    header: 'Zip code',
  }),
];

export default function Table() {
  return (
    <div className="h-screen w-screen">
      <div className="p-5">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
