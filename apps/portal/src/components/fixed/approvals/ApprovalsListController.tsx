import PassSlipApplicationModal from './ApprovalsModal';
import ApprovalPassSlipModal from './ApprovalsPassSlipModal';
import PassSlipFulFilledModal from './ApprovalsPassSlipModal';

type ApprovalListControllerProps = {
  page: number;
};

export const ApprovalListController = ({
  page,
}: ApprovalListControllerProps) => {
  return (
    <div className="max-h-[90%] overflow-x-hidden overflow-y-auto">
      <>
        {page === 1 && <>test1</>}
        {page === 2 && <ApprovalPassSlipModal />}
        {page === 3 && <>test3 </>}
        {page === 4 && <>test4 </>}
      </>
    </div>
  );
};
