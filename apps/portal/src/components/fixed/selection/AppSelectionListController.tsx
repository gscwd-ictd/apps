import { AppSelectionSelectPublication } from './AppSelectionSelectPublication';
import { AppSelectionSelectApplicants } from './AppSelectionSelectApplicants';
import {} from './AppSelectionSelectApplicants';

type AppPlaceListControllerProps = {
  page: number;
};

export const AppSelectionModalController = ({
  page,
}: AppPlaceListControllerProps) => {
  return (
    <>
      {page === 1 && <AppSelectionSelectPublication />}
      {page === 2 && <AppSelectionSelectApplicants />}
    </>
  );
};
