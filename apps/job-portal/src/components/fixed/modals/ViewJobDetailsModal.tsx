/* eslint-disable @nx/enforce-module-boundaries */
import { Modal } from '@gscwd-apps/oneui';
import { usePublicationStore } from 'apps/job-portal/src/store/publication.store';
import { Dispatch, SetStateAction } from 'react';
import { JobDetails } from '../../job-details.tsx/JobDetails';

type ViewJobDetailsModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction?: () => void;
};

export const ViewJobDetailsModal = ({
  modalState,
  closeModalAction,
  setModalState,
}: ViewJobDetailsModalProps) => {
  const publication = usePublicationStore((state) => state.publication);

  return (
    <Modal open={modalState} setOpen={setModalState} size="lg">
      <Modal.Header>
        <div className="flex justify-between w-full px-5">
          <div className="text-3xl font-semibold">Position Details</div>
          <div className="w-[1.5rem]">
            <button
              className="px-2 text-gray-500 transition-colors rounded cursor-pointer h-9 w-9 hover:bg-slate-100"
              onClick={closeModalAction}
            >
              x
            </button>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <JobDetails publication={publication} />
      </Modal.Body>
    </Modal>
  );
};
