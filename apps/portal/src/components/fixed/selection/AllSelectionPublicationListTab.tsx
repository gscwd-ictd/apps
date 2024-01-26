import dayjs from 'dayjs';
import { useAppSelectionStore } from '../../../store/selection.store';
import { Publication, PublicationPostingStatus } from '../../../types/publication.type';
import { isEmpty } from 'lodash';

type AllSelectionPublicationListTabProps = {
  publications: Array<Publication>;
  tab: number;
};

export const AllSelectionPublicationListTab = ({ publications, tab }: AllSelectionPublicationListTabProps) => {
  const modal = useAppSelectionStore((state) => state.modal);

  const setSelectedPublication = useAppSelectionStore((state) => state.setSelectedPublication);

  const setModal = useAppSelectionStore((state) => state.setModal);

  const setSelectedPublicationId = useAppSelectionStore((state) => state.setSelectedPublicationId);

  const onSelect = (publication: Publication) => {
    setSelectedPublication(publication);
    setSelectedPublicationId(publication.vppId);
    setModal({ ...modal, page: 2, isOpen: true });
  };

  return (
    <>
      {!isEmpty(publications) ? (
        <ul className={'mt-4 lg:mt-0'}>
          {publications.map((item: Publication, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelect(item)}
                className="flex items-center justify-between px-5 py-4 transition-colors ease-in-out bg-white border-b rounded-md cursor-pointer border-b-gray-200 hover:bg-indigo-50"
              >
                <div className="w-full px-1 py-2 ">
                  <h1 className="text-xl font-medium text-gray-600">{item.positionTitle}</h1>
                  {/* <p className="text-gray-500 text-md"></p> */}
                  <p className="text-md text-gray-600 font-semibold">{item.itemNumber}</p>
                  <p className="text-xs text-gray-500">{item.placeOfAssignment}</p>

                  {item.postingStatus === PublicationPostingStatus.APPOINTING_AUTHORITY_SELECTION ? (
                    <p className="text-indigo-500 text-sm">For Appointing Authority Selection</p>
                  ) : item.postingStatus === PublicationPostingStatus.APPOINTING_AUTHORITY_SELECTION_DONE ? (
                    <p className="text-indigo-500 text-sm">
                      Appointing Authority Selection Done at {dayjs(item.updatedAt).format('MMMM d, YYYY')}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex justify-center pt-20">
          <h1 className="text-4xl text-gray-300">
            No {tab === 1 ? 'pending publication for selection' : tab === 2 ? 'fulfilled publication' : ''} at the
            moment
          </h1>
        </div>
      )}
    </>
  );
};
