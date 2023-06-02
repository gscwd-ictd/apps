/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect } from 'react';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';

import { CustomGroup } from 'apps/employee-monitoring/src/utils/types/custom-group.type';
import { useCustomGroupStore } from 'apps/employee-monitoring/src/store/custom-group.store';

import {
  AlertNotification,
  Button,
  DataTable,
  LoadingSpinner,
  Modal,
  useDataTable,
} from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { createColumnHelper } from '@tanstack/react-table';
import { EmployeeAsOptionWithPosition } from 'libs/utils/src/lib/types/employee.type';
import { Card } from '../../../cards/Card';

type EditModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: CustomGroup;
};

const MemberAssignmentModal: FunctionComponent<EditModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // fetch data for list of custom groups
  const {
    data: swrCustomGroupWithMembers,
    error: swrError,
    isLoading: swrIsLoading,
    mutate: mutateCustomGroupWithMembers,
  } = useSWR(`/custom-groups/${rowData.id}`, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Define table columns
  const columnHelper = createColumnHelper<EmployeeAsOptionWithPosition>();
  const columns = [
    columnHelper.accessor('employeeId', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('companyId', {
      header: 'Company ID',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('fullName', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('positionTitle', {
      header: 'Position',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('assignment', {
      header: 'Assignment',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      enableColumnFilter: false,
      // cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // zustand store initialization
  const {
    IsLoading,
    CustomGroupWithMembers,

    GetCustomGroupWithMembers,
    GetCustomGroupWithMembersSuccess,
    GetCustomGroupWithMembersFail,
  } = useCustomGroupStore((state) => ({
    IsLoading: state.loading.loadingCustomGroupWithMembers,
    CustomGroupWithMembers: state.customGroupWithMembers,

    GetCustomGroupWithMembers: state.getCustomGroupWithMembers,
    GetCustomGroupWithMembersSuccess: state.getCustomGroupWithMembersSuccess,
    GetCustomGroupWithMembersFail: state.getCustomGroupWithMembersFail,
  }));

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: CustomGroupWithMembers.members,
    enableRowSelection: true,
    columnVisibility: { employeeId: false, assignment: false },
  });

  // yup error handling initialization
  // const yupSchema = yup
  //   .object({
  //     name: yup.string().required('Name is required'),
  //     description: yup.string().required('Description is required'),
  //   })
  //   .required();

  // React hook form
  // const {
  //   reset,
  //   register,
  //   setValue,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<CustomGroup>({
  //   mode: 'onChange',
  //   resolver: yupResolver(yupSchema),
  // });

  // form submission
  // const onSubmit: SubmitHandler<CustomGroup> = (data: CustomGroup) => {
  // UpdateCustomGroup();
  // console.log(data);

  // handlePatchResult(data);
  // };

  // const handleGetResult = async (data: CustomGroup) => {
  //   const { error, result } = await getEmpMonitoring(
  //     `/custom-groups/${rowData.id}`
  //   );

  //   if (error) {
  //     UpdateCustomGroupFail(result);
  //   } else {
  //     UpdateCustomGroupSuccess(result);

  //     reset();
  //     closeModalAction();
  //   }
  // };

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      GetCustomGroupWithMembers();
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrCustomGroupWithMembers)) {
      GetCustomGroupWithMembersSuccess(swrCustomGroupWithMembers.data);
    }

    if (!isEmpty(swrError)) {
      GetCustomGroupWithMembersFail(swrError.message);
    }
  }, [swrCustomGroupWithMembers, swrError]);
  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="lg">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600">
              {CustomGroupWithMembers.customGroupDetails?.name}
            </span>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeModalAction}
            >
              <i className="bx bx-x"></i>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div>
            {/* Notifications */}
            {/* {IsLoading ? (
              <AlertNotification
                logo={<LoadingSpinner size="xs" />}
                alertType="info"
                notifMessage="Submitting request"
                dismissible={true}
              />
            ) : null} */}

            <div className="mx-5">
              <Card>
                {IsLoading ? (
                  <LoadingSpinner size="lg" />
                ) : (
                  <div className="flex flex-row flex-wrap">
                    <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                      <button
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                        // onClick={openAddActionModal}
                      >
                        <i className="bx bxs-plus-square"></i>&nbsp; Assign
                        Employees
                      </button>
                    </div>

                    <DataTable
                      model={table}
                      showGlobalFilter={false}
                      showColumnFilter={false}
                      paginate={false}
                    />
                  </div>
                )}
              </Card>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* Submit button */}
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="submit"
              form="editCustomGroupForm"
              className="ml-1 text-gray-400 disabled:cursor-not-allowed"
              disabled={IsLoading ? true : false}
            >
              <span className="text-xs font-normal">Submit</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MemberAssignmentModal;
