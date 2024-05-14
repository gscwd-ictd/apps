/* eslint-disable @nx/enforce-module-boundaries */
import { Modal } from '@gscwd-apps/oneui';
import { useAppSelectionStore } from 'apps/portal/src/store/selection.store';
import { useEffect } from 'react';
import { AppSelectionPds } from './AppSelectionPds';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';

type AppSelectionPdsAlertProps = {
  alertState: boolean;
  setAlertState: React.Dispatch<React.SetStateAction<boolean>>;
  closeAlertAction: () => void;
};

export const AppSelectionPdsAlert = ({ alertState, setAlertState, closeAlertAction }: AppSelectionPdsAlertProps) => {
  const { selectedApplicantDetails } = useAppSelectionStore((state) => ({
    selectedApplicantDetails: state.selectedApplicantDetails,
  }));

  useEffect(() => {
    if (!alertState) closeAlertAction();
  }, [alertState]);

  const { windowWidth } = UseWindowDimensions();

  return (
    <Modal open={alertState} setOpen={setAlertState} size={`${windowWidth > 1024 ? 'lg' : 'xl'}`}>
      <Modal.Body>
        <AppSelectionPds
          applicantDetails={{
            applicantId: selectedApplicantDetails.applicantId,
            applicantType: selectedApplicantDetails.applicantType,
          }}
        />
      </Modal.Body>
    </Modal>
  );
};
