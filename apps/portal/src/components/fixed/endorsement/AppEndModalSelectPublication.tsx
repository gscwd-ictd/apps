import { useAppEndStore } from '../../../store/endorsement.store';
import { AllPublicationList } from './AllPublicationList';

export const AppEndSelectPublication = () => {
  const publicationList = useAppEndStore((state) => state.publicationList);
  return (
    <>
      <div className="flex flex-col w-full mb-5">
        <section>
          <div className="flex justify-end px-3 mb-1 text-sm">
            <p className="text-gray-600">
              {publicationList.length > 0 &&
                `${publicationList.length} endorsements for selection`}{' '}
            </p>
          </div>
          <div className="relative px-3 mt-2 mb-5">
            {/* <HiOutlineSearch className="absolute mt-[0.9rem] ml-3 h-[1.25rem] w-[1.25rem] text-gray-500" />
                        <input className="w-full py-3 pl-10 pr-12 border-gray-200 rounded" placeholder="Seach for a publication by position title" type="text" /> */}
            <div className="min-h-[9.5rem] max-h-[36rem]  overflow-y-auto">
              {publicationList.length > 0 ? (
                <AllPublicationList />
              ) : (
                <>
                  <div className="w-full text-3xl font-medium flex text-gray-600 justify-center place-items-center justify-items-center h-full">
                    NO ENDORSEMENTS FOUND
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
