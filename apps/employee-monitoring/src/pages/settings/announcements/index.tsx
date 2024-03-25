import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import useSWR from 'swr';
import { isEmpty } from 'lodash';

import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';

// store and type
import { useAnnouncementsStore } from 'apps/employee-monitoring/src/store/announcement.store';
import { Announcement } from 'apps/employee-monitoring/src/utils/types/announcement.type';

import TestAnnouncement from 'apps/employee-monitoring/public/Test-Announcement.png';

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
// const Announcements: Announcement[] = [
//   {
//     id: '2001',
//     title: 'Announcement 1',
//     description: 'This is announcement 1',
//     eventAnnouncementDate: '2021-09-01',
//     url: 'https://www.google.com',
//     photoUrl: 'TestAnnouncement.src',
//     fileName: 'TestAnnouncement.png',
//     status: 'inactive',
//   },
//   {
//     id: '2002',
//     title: 'Announcement 2',
//     description: 'This is announcement 2',
//     eventAnnouncementDate: '2021-09-02',
//     url: 'https://www.google2.com',
//     photoUrl: 'https://i.ibb.co/xSwJ5Dt/Test-Announcement.png',
//     fileName: 'TestAnnouncement.png',
//     status: 'active',
//   },
//   {
//     id: '2003',
//     title: 'Announcement 3',
//     description: 'This is announcement 3',
//     eventAnnouncementDate: '2021-09-03',
//     url: 'https://www.google3.com',
//     photoUrl: TestAnnouncement.src,
//     fileName: 'TestAnnouncement.png',
//     status: 'active',
//   },
// ];

const Index = () => {


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


  // transform date
  const transformDate = (date: string | Date | null) => {
    if (date === null) return '-';
    else return dayjs(date).format('MMMM DD, YYYY');
  };

    // Current row data in the table that has been clicked
    const [currentRowData, setCurrentRowData] = useState<Announcement>({} as Announcement);

    // fetch data for list of announcements
    const {
      data: announcements,
      error: announcementsError,
      isLoading: announcementsLoading,
      mutate: mutateAnnouncements,
    } = useSWR('/events-announcements', fetcherEMS, {
    });

  // Zustand initialization
  const {
    Announcements,
    SetGetAnnouncements,

    PostAnnouncement,
    SetPostAnnouncement,

    UpdateAnnouncement,
    SetUpdateAnnouncement,

    DeleteAnnouncement,
    SetDeleteAnnouncement,

    ErrorAnnouncement,
    SetErrorAnnouncement,

    ErrorAnnouncements,
    SetErrorAnnouncements,

    EmptyResponse,
  } = useAnnouncementsStore((state) => ({
    Announcements: state.getAnnouncements,
    SetGetAnnouncements: state.setGetAnnouncements,

    PostAnnouncement: state.postAnnouncement,
    SetPostAnnouncement: state.setPostAnnouncement,

    UpdateAnnouncement: state.updateAnnouncement,
    SetUpdateAnnouncement: state.setUpdateAnnouncement,

    DeleteAnnouncement: state.deleteAnnouncement,
    SetDeleteAnnouncement: state.setDeleteAnnouncement,

    ErrorAnnouncement: state.errorAnnouncement,
    SetErrorAnnouncement: state.setErrorAnnouncement,

    ErrorAnnouncements: state.errorAnnouncements,
    SetErrorAnnouncements: state.setErrorAnnouncements,

    EmptyResponse: state.emptyResponse,
  }));

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
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('title', {
      enableSorting: true,
      header: () => 'Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('eventAnnouncementDate', {
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
    columnHelper.accessor('photoUrl', {
      enableSorting: true,
      header: () => 'Image',
      cell: (info) => (
        <a href={info.getValue()} target="_blank" rel="noopener noreferrer">
          <img src={info.getValue()} alt="Image" width={'84.3rem'} height={'84.3rem'} />
        </a>
      ),
    }),
    columnHelper.accessor('status', {
      enableSorting: true,
      header: () => 'Status',
      cell: (info) => info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="w-full text-center ">Actions</span>,
      cell: (props) => <div className="w-full text-center">{renderRowActions(props.row.original)}</div>,
    }),
  ];


  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: Announcements,
    columnVisibility: { id: false },
  });

  // Initial zustand state update

  useEffect(() => {
    if (!isEmpty(announcements)) {
      SetGetAnnouncements(announcements.data);
    }

    if (!isEmpty(announcementsError)) {
      switch (announcementsError?.response?.status) {
        case 400:
          SetErrorAnnouncements('Bad Request');
          break;
        case 401:
          SetErrorAnnouncements('Unauthorized');
          break;
        case 403:
          SetErrorAnnouncements('Forbidden');
          break;
        case 404:
          SetErrorAnnouncements('Announcements not found');
          break;
        case 500:
          SetErrorAnnouncements('Internal Server Error');
          break;
        default:
          SetErrorAnnouncements('An error occurred. Please try again later.');
          break;
      }
    }
  }, [announcements, announcementsError]);

  useEffect(() => {
    if (
      !isEmpty(PostAnnouncement) ||
      !isEmpty(UpdateAnnouncement) ||
      !isEmpty(DeleteAnnouncement) ||
      !isEmpty(ErrorAnnouncement) ||
      !isEmpty(ErrorAnnouncements)
    ) {
      mutateAnnouncements();

      setTimeout(() => {
        EmptyResponse();
      }, 5000);
    }
  }, [PostAnnouncement, UpdateAnnouncement, DeleteAnnouncement, ErrorAnnouncement, ErrorAnnouncements]);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="Announcements" />
        {/* Notifications */}
        {!isEmpty(ErrorAnnouncements) ? (
          <ToastNotification toastType="error" notifMessage={ErrorAnnouncements} />
        ) : null}
        <Can I="access" this="Announcements">
          <div className="mx-5">
            <Card>
              {announcementsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
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
              )}
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
