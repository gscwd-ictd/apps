import { useAppEndStore } from '../../../store/endorsement.store';
import { Publication } from '../../../types/publication.type';
import dayjs from 'dayjs';

type AllPublicationListTabProps = {
  publications: Array<Publication>;
  tab: number;
};

export const AllPublicationListTab = ({ publications, tab }: AllPublicationListTabProps) => {
  const modal = useAppEndStore((state) => state.modal);

  const setSelectedPublication = useAppEndStore((state) => state.setSelectedPublication);

  const setModal = useAppEndStore((state) => state.setModal);

  const setSelectedPublicationId = useAppEndStore((state) => state.setSelectedPublicationId);

  const setAction = useAppEndStore((state) => state.setAction);

  const onSelect = (publication: Publication) => {
    setSelectedPublication(publication);
    setSelectedPublicationId(publication.vppId);
    if (tab === 1) {
      setAction('create');
      setModal({ ...modal, page: 2, isOpen: true });
    } else if (tab === 2) {
      setAction('view');
      setModal({ ...modal, page: 3, isOpen: true });
    }
  };

  return (
    <>
      {publications && publications.length > 0 ? (
        <ul className={'mt-4 lg:mt-0'}>
          {publications.map((item: Publication, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelect(item)}
                className="flex items-center justify-between px-5 py-4 transition-colors ease-in-out bg-white border-b rounded-tr-none rounded-bl-none cursor-pointer rounded-xl border-b-gray-200 hover:bg-indigo-50"
              >
                <div className="w-full px-1 py-2 ">
                  <h1 className="text-xl font-medium text-gray-600">{item.positionTitle}</h1>
                  {/* <p className="text-gray-500 text-md"></p> */}
                  <p className="text-md text-gray-600 font-semibold">{item.itemNumber}</p>
                  <p className="text-xs text-gray-500">{item.placeOfAssignment}</p>
                  <p className="text-sm text-indigo-500">
                    {tab === 1 ? 'Publication Posting Date: ' : tab === 2 ? 'Fulfilled on ' : null}
                    {tab === 1
                      ? dayjs(item.postingDate).format('MMMM DD, YYYY')
                      : tab === 2
                      ? dayjs(item.requestingEntitySelectionDate).format('MMMM DD, YYYY')
                      : null}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex justify-center pt-20">
          <h1 className="text-4xl text-gray-300">
            No {tab === 1 ? 'pending endorsement list for selection' : tab === 2 ? 'fulfilled endorsement list' : ''} at
            the moment
          </h1>
        </div>
      )}
    </>
  );
};
