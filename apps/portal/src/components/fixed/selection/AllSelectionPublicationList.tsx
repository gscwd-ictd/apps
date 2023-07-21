import dayjs from 'dayjs';
import { useAppSelectionStore } from '../../../store/selection.store';
import {
  Publication,
  PublicationPostingStatus,
} from '../../../types/publication.type';

export const AllSelectionPublicationList = () => {
  const filteredPublicationList = useAppSelectionStore(
    (state) => state.filteredPublicationList
  );
  const modal = useAppSelectionStore((state) => state.modal);
  const setSelectedPublication = useAppSelectionStore(
    (state) => state.setSelectedPublication
  );
  const setModal = useAppSelectionStore((state) => state.setModal);
  const setSelectedPublicationId = useAppSelectionStore(
    (state) => state.setSelectedPublicationId
  );

  const onSelect = (publication: Publication) => {
    setSelectedPublicationId(publication.vppId);
    setSelectedPublication(publication);
    setModal({ ...modal, page: 2 });
  };

  return (
    <>
      <ul>
        {filteredPublicationList && filteredPublicationList.length > 0 ? (
          filteredPublicationList.map((item: Publication, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelect(item)}
                className="flex  hover:bg-indigo-50 cursor-pointer items-center justify-between border-b border-b-gray-100 border-l-transparent py-4 transition-colors ease-in-out"
              >
                <div className=" w-full py-2 px-5 ">
                  <h1 className="font-medium text-lg text-gray-600">
                    {item.positionTitle}
                  </h1>

                  <p className="text-sm text-black font-semibold">
                    {item.itemNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.placeOfAssignment}
                  </p>

                  {item.postingStatus ===
                  PublicationPostingStatus.APPOINTING_AUTHORITY_SELECTION ? (
                    <p className="text-indigo-500 text-sm">
                      For Appointing Authority Selection
                    </p>
                  ) : item.postingStatus ===
                    PublicationPostingStatus.APPOINTING_AUTHORITY_SELECTION_DONE ? (
                    <p className="text-indigo-500 text-sm">
                      Updated at {dayjs(item.updatedAt).format('MMMM d, YYYY')}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })
        ) : (
          <>
            <div className="w-full text-3xl text-center font-medium flex flex-col text-gray-600 justify-center place-items-center justify-items-center h-[9.5rem]">
              NO PUBLICATIONS FOUND
            </div>
          </>
        )}
      </ul>
    </>
  );
};
