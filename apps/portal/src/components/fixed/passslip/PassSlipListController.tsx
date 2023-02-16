import PassSlipApplicationModal from './PassSlipApplicationModal';
import PassSlipInfoModal from './PassSlipInfoModal';

type PassSlipModalControllerProps = {
  page: number;
};

export const PassSlipModalController = ({
  page,
}: PassSlipModalControllerProps) => {
  return (
    <div className="max-h-[90%] overflow-x-hidden overflow-y-auto">
      <>
        {page === 1 && <PassSlipApplicationModal />}
        {page === 2 && <PassSlipInfoModal />}
        {page === 3 && <PassSlipInfoModal />}
      </>
    </div>
  );
};
