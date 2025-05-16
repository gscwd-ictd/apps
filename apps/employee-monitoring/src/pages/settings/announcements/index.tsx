import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/CaslContext';
import useSWR from 'swr';
import { isEmpty } from 'lodash';

import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';

// store and type
import { useAnnouncementsStore } from 'apps/employee-monitoring/src/store/announcement.store';
import { Announcement, AnnouncementTableColumns } from 'apps/employee-monitoring/src/utils/types/announcement.type';

import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { createColumnHelper } from '@tanstack/react-table';

// modals
import AddAnnouncementModal from 'apps/employee-monitoring/src/components/modal/settings/announcements/AddAnnouncementModal';
import EditAnnouncementModal from 'apps/employee-monitoring/src/components/modal/settings/announcements/EditAnnouncementModal';
import DeleteAnnouncementModal from 'apps/employee-monitoring/src/components/modal/settings/announcements/DeleteAnnouncementModal';

import ConvertFullMonthNameToDigit from 'apps/employee-monitoring/src/utils/functions/ConvertFullMonthNameToDigit';

const Index = () => {
  // Add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // Edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: AnnouncementTableColumns) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // Delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: AnnouncementTableColumns) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<AnnouncementTableColumns>({} as AnnouncementTableColumns);

  // fetch data for list of announcements
  const {
    data: announcements,
    error: announcementsError,
    isLoading: announcementsLoading,
    mutate: mutateAnnouncements,
  } = useSWR('/events-announcements', fetcherEMS, {});

  // Zustand initialization
  const {
    Announcements,
    SetGetAnnouncements,

    PostAnnouncement,

    UpdateAnnouncement,

    DeleteAnnouncement,

    ErrorAnnouncements,
    SetErrorAnnouncements,

    EmptyResponse,
  } = useAnnouncementsStore((state) => ({
    Announcements: state.getAnnouncements,
    SetGetAnnouncements: state.setGetAnnouncements,

    PostAnnouncement: state.postAnnouncement,

    UpdateAnnouncement: state.updateAnnouncement,

    DeleteAnnouncement: state.deleteAnnouncement,

    ErrorAnnouncements: state.errorAnnouncements,
    SetErrorAnnouncements: state.setErrorAnnouncements,

    EmptyResponse: state.emptyResponse,
  }));

  // Render row actions in the table component
  const renderRowActions = (rowData: AnnouncementTableColumns) => {
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
  const columnHelper = createColumnHelper<AnnouncementTableColumns>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('title', {
      enableSorting: true,
      header: () => 'Title',
      cell: (info) => (
        <div className="w-40">
          <p>{info.getValue()}</p>
        </div>
      ),
    }),
    columnHelper.accessor('eventAnnouncementDate', {
      enableSorting: true,
      header: () => 'Date',
      cell: (info) => ConvertFullMonthNameToDigit(info.getValue()),
    }),
    columnHelper.accessor('url', {
      enableSorting: true,
      header: () => 'URL',
      cell: (info) => (
        <div className="flex w-32">
          <a
            href={info.getValue()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 overflow-hidden overflow-ellipsis"
          >
            {info.getValue()}
          </a>
        </div>
      ),
    }),
    columnHelper.accessor('photoUrl', {
      enableSorting: true,
      header: () => 'Image',
      cell: (info) => (
        <div className="flex flex-row justify-center">
          {info.getValue() ? (
            <div className="flex flex-col items-center">
              <a href={info.getValue()} target="_blank" rel="noopener noreferrer">
                {/* <Image src={info.getValue()} alt="Image" width={84.3} height={84.3} priority /> */}
                <img src={info.getValue()} alt="Image" width={84.3} height={84.3} />
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-20 h-20 bg-gray-400">
              <i className="bx bxs-error text-3xl text-white"></i>
            </div>
          )}
        </div>
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
    if (!isEmpty(PostAnnouncement) || !isEmpty(UpdateAnnouncement) || !isEmpty(DeleteAnnouncement)) {
      mutateAnnouncements();

      setTimeout(() => {
        EmptyResponse();
      }, 5000);
    }
  }, [PostAnnouncement, UpdateAnnouncement, DeleteAnnouncement]);

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
