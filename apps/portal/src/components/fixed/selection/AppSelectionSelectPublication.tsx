import { HiOutlineSearch } from 'react-icons/hi';
import { useAppSelectionStore } from '../../../store/selection.store';
import { AllSelectionPublicationList } from './AllSelectionPublicationList';

export const AppSelectionSelectPublication = () => {
  // const { publicationList } = useContext(PlacementContext);
  const publicationList = useAppSelectionStore(
    (state) => state.publicationList
  );

  return (
    <>
      <div className="flex flex-col w-full mb-5">
        <section>
          <div className="flex justify-end px-3 mb-1 text-sm">
            <p className="text-gray-600">
              {publicationList &&
                publicationList.length > 0 &&
                `${publicationList.length} publications for selection`}{' '}
            </p>
          </div>
          <div className="relative px-3 mt-2 mb-5">
            <div className="overflow-y-auto">
              <AllSelectionPublicationList />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
