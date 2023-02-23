import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { Holiday } from '../../../../utils/types/holiday.type';
import { HolidayRowData } from '../../../../utils/types/table-row-types/maintenance/holiday-row.type';
import { HolidayTypes } from '../../../../utils/enum/holiday-types.enum';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTableHrms, Modal } from '@gscwd-apps/oneui';
import { Card } from '../../../../components/cards/Card';
import { BreadCrumbs } from '../../../../components/navigations/BreadCrumbs';
import { useState } from 'react';
import axios from 'axios';

const Index = ({
  holidays,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
      <Modal open={addModalIsOpen} setOpen={setAddModalIsOpen} steady size="md">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600"></span>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeAddActionModal}
            >
              <i className="bx bx-x"></i>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>INSERT FORM HERE</Modal.Body>
      </Modal>

      {/* Edit modal */}
      <Modal
        open={editModalIsOpen}
        setOpen={setEditModalIsOpen}
        steady
        size="sm"
      >
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600"></span>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeEditActionModal}
            >
              <i className="bx bx-x"></i>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>{JSON.stringify(currentRowData)}</Modal.Body>
      </Modal>

      {/* Delete modal */}
      <Modal
        open={deleteModalIsOpen}
        setOpen={setDeleteModalIsOpen}
        steady
        size="xs"
      >
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600"></span>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeDeleteActionModal}
            >
              <i className="bx bx-x"></i>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <p className="text-sm text-center">
            Are you sure you want to delete entry{' '}
            {JSON.stringify(currentRowData.name)}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
              // onClick={() => openEditActionModal(rowData)}
            >
              Confirm
            </button>

            <button
              type="button"
              className="text-white bg-red-700 hover:bg-blue-800 focus:outline-none focus:ring-red-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-700"
              onClick={closeDeleteActionModal}
            >
              Cancel
            </button>
          </div>
        </Modal.Footer>
      </Modal>
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
