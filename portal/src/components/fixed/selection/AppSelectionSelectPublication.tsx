import { HiOutlineSearch } from 'react-icons/hi';
import { useAppSelectionStore } from '../../../store/selection.store';
import { AllSelectionPublicationList } from './AllSelectionPublicationList';

export const AppSelectionSelectPublication = () => {
    // const { publicationList } = useContext(PlacementContext);
    const publicationList = useAppSelectionStore((state) => state.publicationList)

    return (
        <>

            <div className="flex flex-col w-full mb-5">

                <section>
                    <div className="flex justify-end px-3 mb-1 text-sm">
                        <p className="text-gray-600">{publicationList && publicationList.length > 0 && `${publicationList.length} publications for selection`} </p>
                    </div>
                    <div className="relative px-3 mt-2 mb-5">
                        {/* <HiOutlineSearch className="absolute mt-[0.9rem] ml-3 h-[1.25rem] w-[1.25rem] text-gray-500" />
                        <input className="w-full py-3 pl-10 pr-12 border-gray-200 rounded" placeholder="Seach for a position title" type="text" /> */}
                        <div className="h-[36rem] overflow-y-auto">
                            <AllSelectionPublicationList />
                        </div>
                    </div>
                </section>
            </div>


        </>
    );
};
