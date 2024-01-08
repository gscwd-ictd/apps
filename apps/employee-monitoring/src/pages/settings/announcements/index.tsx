import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import useSWR from 'swr';
import { isEmpty } from 'lodash';

import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';

// store and type
import { useAnnouncementsStore } from 'apps/employee-monitoring/src/store/announcement.store';
import { Announcement } from 'apps/employee-monitoring/src/utils/types/announcement.type';

import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';

// modals
import AddAnnouncementModal from 'apps/employee-monitoring/src/components/modal/settings/announcements/AddAnnouncementModal';
import EditAnnouncementModal from 'apps/employee-monitoring/src/components/modal/settings/announcements/EditAnnouncementModal';
import DeleteAnnouncementModal from 'apps/employee-monitoring/src/components/modal/settings/announcements/DeleteAnnouncementModal';

// sample static data
const Announcements: Announcement[] = [
  {
    _id: '2001',
    title: 'Announcement 1',
    description: 'This is announcement 1',
    date: '2021-09-01',
    url: 'https://www.google.com',
    image: 'https://images.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png',
  },
  {
    _id: '2002',
    title: 'Announcement 2',
    description: 'This is announcement 2',
    date: '2021-09-01',
    url: 'https://www.google.com',
    image: 'https://images.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png',
  },
];

const Index = () => {
  // Current row data in the table that has been clicked
  //   const [currentRowData, setCurrentRowData] = useState<OfficerOfTheDay>({} as OfficerOfTheDay);

  // fetch data for list of announcements
  // const {
  //   data: swrAnnouncements,
  //   error: swrError,
  //   isLoading: swrIsLoading,
  //   mutate: mutateOfficersOfTheDay,
  // } = useSWR('/', fetcherEMS, {
  //   shouldRetryOnError: false,
  //   revalidateOnFocus: false,
  // });

  // Add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // Edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: Announcement) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // Delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: Announcement) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  const [currentRowData, setCurrentRowData] = useState<Announcement>({} as Announcement);

  // transform date
  const transformDate = (date: string | Date | null) => {
    if (date === null) return '-';
    else return dayjs(date).format('MMMM DD, YYYY');
  };

  // Render row actions in the table component
  const renderRowActions = (rowData: Announcement) => {
    return (
      <div className="text-center">
        <button
          type="button"
          className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
          onClick={() => openEditActionModal(rowData)}
        >
          <i className="bx bx-edit-alt"></i>
        </button>

        <button
          type="button"
          className="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
          onClick={() => openDeleteActionModal(rowData)}
        >
          <i className="bx bx-trash-alt"></i>
        </button>
      </div>
    );
  };

  // Define table columns
  const columnHelper = createColumnHelper<Announcement>();
  const columns = [
    columnHelper.accessor('_id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('title', {
      enableSorting: true,
      header: () => 'Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('description', {
      enableSorting: true,
      header: () => 'Description',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('date', {
      enableSorting: true,
      header: () => 'Date',
      cell: (info) => transformDate(info.getValue()),
    }),
    columnHelper.accessor('url', {
      enableSorting: true,
      header: () => 'URL',
      cell: (info) => (
        <a href={info.getValue()} target="_blank" rel="noopener noreferrer" className="text-blue-500">
          {info.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor('image', {
      enableSorting: true,
      header: () => 'Image',
      cell: (info) => (
        <a href={info.getValue()} target="_blank" rel="noopener noreferrer">
          <img src={info.getValue()} alt="Image" width={'50rem'} height={'50rem'} />
        </a>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="w-full text-center ">Actions</span>,
      cell: (props) => <div className="w-full text-center">{renderRowActions(props.row.original)}</div>,
    }),
  ];

  // Zustand initialization

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: Announcements,
    columnVisibility: { _id: false },
  });

  // Reset responses on load of page

  // Initial zustand state update

  // Upon success/fail of swr request, zustand state will be updated

  // Reset responses from all modal actions

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="Announcements" />
        <Can I="access" this="Announcements">
          <div className="mx-5">
            <Card>
              {/* {swrIsLoading ? (
                <LoadingSpinner size="lg" />
              ) : ( */}
              <div className="flex flex-row flex-wrap">
                <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                    onClick={openAddActionModal}
                  >
                    <i className="bx bxs-plus-square"></i>&nbsp; Add Announcement
                  </button>
                </div>
                <DataTable model={table} showGlobalFilter={true} showColumnFilter={false} paginate={true} />
              </div>
              {/* )} */}
            </Card>
          </div>

          {/* Add modal */}
          <AddAnnouncementModal
            modalState={addModalIsOpen}
            setModalState={setAddModalIsOpen}
            closeModalAction={closeAddActionModal}
          />

          {/* Edit modal */}
          <EditAnnouncementModal
            modalState={editModalIsOpen}
            setModalState={setEditModalIsOpen}
            closeModalAction={closeEditActionModal}
            rowData={currentRowData}
          />

          {/* Delete modal */}
          <DeleteAnnouncementModal
            modalState={deleteModalIsOpen}
            setModalState={setDeleteModalIsOpen}
            closeModalAction={closeDeleteActionModal}
            rowData={currentRowData}
          />
        </Can>
      </div>
    </>
  );
};

export default Index;
