import { useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import useSWR from 'swr';

import { CustomGroup } from 'apps/employee-monitoring/src/utils/types/custom-group.type';
import { useCustomGroupStore } from 'apps/employee-monitoring/src/store/custom-group.store';

import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { createColumnHelper } from '@tanstack/react-table';

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<CustomGroup>(
    {} as CustomGroup
  );

  // fetch data for list of custom groups
  const {
    data: swrCustomGroups,
    error: swrError,
    isLoading: swrIsLoading,
    mutate: mutateCustomGroups,
  } = useSWR('/custom-groups', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Render row actions in the table component
  const renderRowActions = (rowData: CustomGroup) => {
    return (
      <div className="text-center">
        <button
          type="button"
          className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
          // onClick={() => openEditActionModal(rowData)}
        >
          <i className="bx bx-edit-alt"></i>
        </button>

        <button
          type="button"
          className="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
          // onClick={() => openDeleteActionModal(rowData)}
        >
          <i className="bx bx-trash-alt"></i>
        </button>
      </div>
    );
  };

  // Define table columns
  const columnHelper = createColumnHelper<CustomGroup>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => info.getValue(),
    }),

    columnHelper.display({
      id: 'actions',
      enableColumnFilter: false,
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // Zustand initialization
  const {
    CustomGroups,

    IsLoading,
    ErrorCustomGroups,
    ErrorCustomGroup,

    GetCustomGroups,
    GetCustomGroupsSuccess,
    GetCustomGroupsFail,

    // EmptyResponse,
  } = useCustomGroupStore((state) => ({
    CustomGroups: state.customGroups,

    IsLoading: state.loading.loadingCustomGroups,
    ErrorCustomGroups: state.error.errorCustomGroups,
    ErrorCustomGroup: state.error.errorCustomGroup,

    GetCustomGroups: state.getCustomGroups,
    GetCustomGroupsSuccess: state.getCustomGroupsSuccess,
    GetCustomGroupsFail: state.getCustomGroupsFail,

    // EmptyResponse: state.emptyResponse,
  }));

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="Custom Groups" />

        <Can I="access" this="Custom Groups">
          <div className="mx-5">
            <Card>
              <div className="flex flex-col w-full">TEST</div>
            </Card>
          </div>
        </Can>
      </div>
    </>
  );
};

export default Index;
