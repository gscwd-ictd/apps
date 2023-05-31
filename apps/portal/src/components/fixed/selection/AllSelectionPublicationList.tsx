import dayjs from 'dayjs';
import { useAppSelectionStore } from '../../../store/selection.store';
import { Publication } from '../../../types/publication.type';

export const AllSelectionPublicationList = () => {
  const publicationList = useAppSelectionStore(
    (state) => state.publicationList
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
        {publicationList && publicationList.length > 0 ? (
          publicationList.map((item: Publication, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelect(item)}
                className="flex  hover:bg-indigo-50 cursor-pointer items-center justify-between border-b border-b-gray-100 border-l-transparent py-4 transition-colors ease-in-out"
              >
                <div className=" w-full py-2 px-5 ">
                  <h1 className="font-medium text-gray-600">
                    {item.positionTitle}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Posting Date:{' '}
                    {dayjs(item.postingDate).format('MMMM d, YYYY')}
                  </p>
                  <p className="text-sm text-gray-500">{item.itemNumber}</p>
                  <p className="text-xs text-gray-500">
                    {item.placeOfAssignment}
                  </p>
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
