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
  LoadingSpinner,
  Modal,
} from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';

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

  // zustand store initialization
  const {
    IsLoading,

    GetCustomGroupWithMembers,
    GetCustomGroupWithMembersSuccess,
    GetCustomGroupWithMembersFail,
  } = useCustomGroupStore((state) => ({
    IsLoading: state.loading.loadingCustomGroupWithMembers,

    GetCustomGroupWithMembers: state.getCustomGroupWithMembers,
    GetCustomGroupWithMembersSuccess: state.getCustomGroupWithMembersSuccess,
    GetCustomGroupWithMembersFail: state.getCustomGroupWithMembersFail,
  }));

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
            <span className="text-2xl text-gray-600">Member Assignment</span>
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

            {JSON.stringify(swrCustomGroupWithMembers)}
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
