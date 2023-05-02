import { Button, DataTable, useDataTable, Modal } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import AddEmpTrainingsModal from 'apps/employee-monitoring/src/components/modal/monitoring/trainings-and-seminars/AddEmployeeTrainingsModal';
import AddTrainingsModal from 'apps/employee-monitoring/src/components/modal/monitoring/trainings-and-seminars/AddTrainingsModal';
import DeleteTrainingsModal from 'apps/employee-monitoring/src/components/modal/monitoring/trainings-and-seminars/DeleteTrainingsModal';
import EditTrainingsModal from 'apps/employee-monitoring/src/components/modal/monitoring/trainings-and-seminars/EditTrainingsModal';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { useTrainingsStore } from 'apps/employee-monitoring/src/store/training.store';
import UseRenderBooleanYesOrNo from 'apps/employee-monitoring/src/utils/functions/RenderBooleanYesOrNo';
import React from 'react';
import { useEffect, useState } from 'react';
import { Training } from '../../../../../../libs/utils/src/lib/types/training.type';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';

// mock data
// const training: Array<Training> = [
//   {
//     id: '001',
//     name: 'Skills Training',
//     dateFrom: 'February 27, 2023',
//     dateTo: 'February 29, 2023',
//     hours: 18,
//     inOffice: true,
//     learningServiceProvider: 'General Santos City Water District',
//     location: 'GSCWD Office',
//     seminarTrainingType: 'foundational',
//     assignedEmployees: [
//       'Gergina Phan',
//       'Spiridon Duarte',
//       'Nidia Wolanski',
//       'Zemfira Benvenuti',
//       'Tony Hutmacher',
//     ],
//   },
//   {
//     id: '002',
//     name: 'Leadership Training',
//     dateFrom: 'March 18, 2023',
//     dateTo: 'March 18, 2023',
//     hours: 5,
//     inOffice: true,
//     learningServiceProvider: 'General Santos City Water District',
//     location: 'GSCWD Office',
//     seminarTrainingType: 'managerial',
//     assignedEmployees: ['Ellen Kron', 'Joana Loper'],
//   },
//   {
//     id: '003',
//     name: 'Senior Executive Training',
//     dateFrom: 'March 22, 2023',
//     dateTo: 'March 23, 2023',
//     hours: 10,
//     inOffice: false,
//     learningServiceProvider: 'Ree Cardo Services',
//     location: 'Green Leaf Hotel Gensan',
//     seminarTrainingType: 'managerial',
//     assignedEmployees: ['Georgina Zeman', 'Inna Trajkovski'],
//   },
//   {
//     id: '004',
//     name: 'Technical Skills Training',
//     dateFrom: 'April 01, 2023',
//     dateTo: 'April 02, 2023',
//     hours: 10,
//     inOffice: false,
//     learningServiceProvider: 'Ree Cardo Services',
//     location: 'Gumasa, Saranggani Province',
//     seminarTrainingType: 'technical',
//     assignedEmployees: ['Theo McPhee', 'Wilma Ariesen'],
//   },
//   {
//     id: '005',
//     name: 'Project Management Workshop Seminar',
//     dateFrom: 'April 05, 2023',
//     dateTo: 'April 10, 2023',
//     hours: 36,
//     inOffice: false,
//     learningServiceProvider: 'Ree Cardo Services',
//     location: 'Cebu City',
//     seminarTrainingType: 'professional',
//     assignedEmployees: ['Sofia Whitaker'],
//   },
// ];

export default function Index() {
  // Zustand initialization
  const {
    trainings,
    deleteResponse,
    postResponse,
    updateResponse,
    getTrainings,
    getTrainingsFail,
    getTrainingsSuccess,
  } = useTrainingsStore((state) => ({
    trainings: state.trainings,
    postResponse: state.training.postResponse,
    updateResponse: state.training.updateResponse,
    deleteResponse: state.training.deleteResponse,
    getTrainings: state.getTrainings,
    getTrainingsSuccess: state.getTrainingsSuccess,
    getTrainingsFail: state.getTrainingsFail,
  }));

  const {
    data: swrTrainings,
    isLoading: swrTrainingsIsLoading,
    error: swrTrainingsError,
    mutate: swrTrainingsMutate,
  } = useSWR('/trainings-seminars', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  const [currentRowData, setCurrentRowData] = useState<Training>(
    {} as Training
  );

  // add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: Training) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: Training) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  // add employee modal function
  const [addEmpModalIsOpen, setAddEmpModalIsOpen] = useState<boolean>(false);
  const openAddEmpActionModal = (rowData: Training) => {
    setAddEmpModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeAddEmpActionModal = () => setAddEmpModalIsOpen(false);

  // Render row actions in the table component
  const renderRowActions = (rowData: Training) => {
    return (
      <>
        <button
          type="button"
          className="text-white bg-blue-400 hover:bg-blue-500  focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
          onClick={() => openEditActionModal(rowData)}
        >
          <i className="bx bx-edit-alt"></i>
        </button>

        <button
          type="button"
          className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
          onClick={() => openAddEmpActionModal(rowData)}
        >
          <i className="bx bxs-user-plus"></i>
        </button>

        <button
          type="button"
          className="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
          onClick={() => openDeleteActionModal(rowData)}
        >
          <i className="bx bx-trash-alt"></i>
        </button>
      </>
    );
  };

  // define table columns
  const columnHelper = createColumnHelper<Training>();
  const columns = [
    columnHelper.accessor('id', {
      enableSorting: false,
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('name', {
      header: 'Training/Seminar Name',
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    }),

    columnHelper.accessor('seminarTrainingType.name', {
      enableSorting: false,
      header: 'Type',
      cell: (info) => info.getValue(),
    }),

    columnHelper.group({
      id: 'inclusiveDates',
      header: () => <div className="text-center w-full">Inclusive Date</div>,
      columns: [
        columnHelper.accessor('dateFrom', {
          enableSorting: false,
          header: 'Date Start',
          cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
        }),
        columnHelper.accessor('dateTo', {
          enableSorting: false,
          header: 'Date End',
          cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
        }),
      ],
    }),

    // columnHelper.accessor('hours', {
    //   enableSorting: false,
    //   header: 'Total Hours',
    //   cell: (info) => info.getValue(),
    // }),

    columnHelper.accessor('inOffice', {
      enableSorting: false,
      header: 'In-Office training?',
      cell: (info) => (
        <div className="w-[3rem]">
          {UseRenderBooleanYesOrNo(info.getValue())}
        </div>
      ),
    }),

    columnHelper.accessor('learningServiceProvider', {
      enableSorting: false,
      header: 'Learning Service Provider',
      cell: (info) => info.getValue(),
    }),

    // columnHelper.accessor('location', {
    //   enableSorting: false,
    //   header: () => 'Location',
    //   cell: (info) => info.getValue(),
    // }),

    columnHelper.display({
      header: () => 'Actions',
      id: 'actions',
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: trainings,
    columnVisibility: { id: false },
  });

  // initial zustand state
  useEffect(() => {
    if (swrTrainingsIsLoading) {
      getTrainings();
    }
  }, [swrTrainingsIsLoading]);

  // success get
  useEffect(() => {
    if (!isEmpty(swrTrainings)) getTrainingsSuccess(swrTrainings.data);

    if (!isEmpty(swrTrainingsError)) getTrainingsFail(swrTrainingsError);
  }, [swrTrainings, swrTrainingsError]);

  // mutate
  useEffect(() => {
    if (
      !isEmpty(postResponse) ||
      !isEmpty(updateResponse) ||
      !isEmpty(deleteResponse)
    ) {
      swrTrainingsMutate();
    }
  }, [postResponse, deleteResponse, updateResponse]);

  return (
    <>
      <div className="w-full px-4">
        <BreadCrumbs
          title="Trainings & Seminars"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Trainings & Seminars',
              path: '',
            },
          ]}
        />

        <AddTrainingsModal
          modalState={addModalIsOpen}
          setModalState={setAddModalIsOpen}
          closeModalAction={closeAddActionModal}
        />

        <EditTrainingsModal
          modalState={editModalIsOpen}
          setModalState={setEditModalIsOpen}
          closeModalAction={closeEditActionModal}
          rowData={currentRowData}
        />

        <DeleteTrainingsModal
          modalState={deleteModalIsOpen}
          setModalState={setDeleteModalIsOpen}
          closeModalAction={closeDeleteActionModal}
          rowData={currentRowData}
        />

        <AddEmpTrainingsModal
          modalState={addEmpModalIsOpen}
          setModalState={setAddEmpModalIsOpen}
          closeModalAction={closeAddEmpActionModal}
          rowData={currentRowData}
        />

        <Can I="access" this="Trainings_and_seminars">
          <div className="sm:mx-0 md:mx-0 lg:mx-5">
            <Card>
              <div className="flex flex-row flex-wrap">
                <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none items-center focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center sm:inline-block md:inline-block lg:inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                    onClick={() => openAddActionModal}
                  >
                    <i className="bx bxs-plus-square"></i>&nbsp;{' '}
                    <span>Add Trainings & Seminars</span>
                  </button>
                </div>

                <DataTable
                  model={table}
                  showGlobalFilter={true}
                  showColumnFilter={true}
                  paginate={true}
                />
              </div>
            </Card>
          </div>
        </Can>
      </div>
    </>
  );
}
