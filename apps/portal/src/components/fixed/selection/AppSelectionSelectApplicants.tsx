import { useAppSelectionStore } from '../../../store/selection.store';
import { AllSelectionTableApplicants } from './AllSelectionTableApplicants';
import { SelectedPlacementPublication } from './SelectedPublication';
import { SelectedPublicationDetails } from './SelectedPublicationDetails';

export const AppSelectionSelectApplicants = () => {
    const selectedPublication = useAppSelectionStore((state) => state.selectedPublication);

    return (
        <>
            <header>
                <SelectedPlacementPublication publication={selectedPublication} />
            </header>
            <section>
                <AllSelectionTableApplicants />
            </section>
            <footer>
                <SelectedPublicationDetails />
            </footer>
        </>
    );
};

