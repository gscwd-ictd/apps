import { AppSelAlertSuccess } from './AppSelAlertSuccess';
import { AppSelAlertConfirmation } from './AppSelAlertConfirmation';
import { useAppSelectionStore } from '../../../store/selection.store';

type AppSelAlertControllerProps = {
  page: number;
};

export const AppSelAlertController = ({ page }: AppSelAlertControllerProps) => {
  const { selectedApplicants } = useAppSelectionStore((state) => ({
    selectedApplicants: state.selectedApplicants,
  }));

  return (
    <div className="max-h-[90%]">
      {page === 1 && (
        <AppSelAlertConfirmation selectedApplicants={selectedApplicants} />
      )}
      {page === 2 && <AppSelAlertSuccess />}
    </div>
  );
};
