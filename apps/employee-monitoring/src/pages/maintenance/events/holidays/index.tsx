import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Holiday } from '../../../../utils/types/holiday.type';
import { HolidayRowData } from '../../../../utils/types/table-row-types/maintenance/holiday-row.type';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTableHrms } from '@gscwd-apps/oneui';
import { Card } from '../../../../components/cards/Card';
import { BreadCrumbs } from '../../../../components/navigations/BreadCrumbs';
import { useState } from 'react';
import axios from 'axios';
import AddHolidayModal from '../../../../components/modal/maintenance/events/holidays/AddHolidayModal';
import EditHolidayModal from '../../../../components/modal/maintenance/events/holidays/EditHolidayModal';
import DeleteHolidayModal from '../../../../components/modal/maintenance/events/holidays/DeleteHolidayModal';

const Index = ({
  holidays,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<HolidayRowData>(
    {} as HolidayRowData
  );

  // Add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // Edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: HolidayRowData) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // Delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: HolidayRowData) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  // Define table columns
  const columnHelper = createColumnHelper<Holiday>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: () => 'Event',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('holidayDate', {
      header: () => 'Holiday Date',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('type', {
      header: () => 'Type',
      cell: (info) => renderHolidayType(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // Define visibility of columns
  const columnVisibility = { id: false };

  // Render badge pill design
  const renderHolidayType = (holidayType: string) => {
    if (holidayType === 'regular') {
      return (
        <span className="bg-red-100 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-500">
          Regular
        </span>
      );
    } else if (holidayType === 'special') {
      return (
        <span className="bg-blue-100 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-500">
          Special/Non-Working
        </span>
      );
    } else {
      return;
    }
  };

  // Render row actions in the table component
  const renderRowActions = (rowData: HolidayRowData) => {
    return (
      <>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800  focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
          onClick={() => openEditActionModal(rowData)}
        >
          <i className="bx bx-edit-alt"></i>
        </button>

        <button
          type="button"
          className="text-white bg-red-700 hover:bg-blue-800 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-700"
          onClick={() => openDeleteActionModal(rowData)}
        >
          <i className="bx bx-trash-alt"></i>
        </button>
      </>
    );
  };

  return (
    <div className="min-h-[100%] min-w-full px-4">
      <BreadCrumbs title="Holidays" />

      <Card>
        <div className="flex flex-row flex-wrap">
          <div className="table-actions-wrapper flex order-2 justify-end w-1/2">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
              onClick={openAddActionModal}
            >
              <i className="bx bxs-plus-square"></i>&nbsp; Add Holiday
            </button>
          </div>

          <DataTableHrms
            data={holidays}
            columns={columns}
            columnVisibility={columnVisibility}
            paginate
          />
        </div>
      </Card>

      {/* Add modal */}
      <AddHolidayModal
        modalState={addModalIsOpen}
        setModalState={setAddModalIsOpen}
        closeModalAction={closeAddActionModal}
      />

      {/* Edit modal */}
      <EditHolidayModal
        modalState={editModalIsOpen}
        setModalState={setEditModalIsOpen}
        closeModalAction={closeEditActionModal}
        rowData={currentRowData}
      />

      {/* Delete modal */}
      <DeleteHolidayModal
        modalState={deleteModalIsOpen}
        setModalState={setDeleteModalIsOpen}
        closeModalAction={closeDeleteActionModal}
        rowData={currentRowData}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_DOMAIN}/holidays`
    );

    return { props: { holidays: response.data } };
  } catch (error) {
    return { props: { holidays: [] } };
  }
};

export default Index;
