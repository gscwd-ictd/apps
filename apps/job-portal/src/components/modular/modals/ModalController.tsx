import { WorkExperiencePicker } from '../../fixed/panels/work-sheet/WorkExperiencePicker';
import { WorkExperiencesSheet } from '../../fixed/panels/work-sheet/WorkExperiencesSheet';

type ModalControllerProps = {
  page: number;
  tab: number;
  setTab: (tab: number) => void;
};

export const ModalController = ({
  page,
  tab,
  setTab,
}: ModalControllerProps): JSX.Element => {
  return (
    <>
      {page === 1 && <WorkExperiencePicker tab={tab} setTab={setTab} />}
      {page === 2 && <WorkExperiencesSheet />}
    </>
  );
};
