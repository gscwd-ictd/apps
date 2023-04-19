import dayjs from 'dayjs';
import { useAppSelectionStore } from '../../../store/selection.store';
import { Publication } from '../../../types/publication.type';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';

type AllSelectionPublicationListTabProps = {
  publications: Array<Publication>;
  tab: number;
};

export const AllSelectionPublicationListTab = ({
  publications,
  tab,
}: AllSelectionPublicationListTabProps) => {
  const {
    appSelectionModalIsOpen,

    setAppSelectionModalIsOpen,
  } = useAppSelectionStore((state) => ({
    appSelectionModalIsOpen: state.appSelectionModalIsOpen,

    setAppSelectionModalIsOpen: state.setAppSelectionModalIsOpen,
  }));

  const modal = useAppSelectionStore((state) => state.modal);

  const setSelectedPublication = useAppSelectionStore(
    (state) => state.setSelectedPublication
  );

  const setModal = useAppSelectionStore((state) => state.setModal);

  const setSelectedPublicationId = useAppSelectionStore(
    (state) => state.setSelectedPublicationId
  );

  const onSelect = (publication: Publication) => {
    setSelectedPublication(publication);
    setSelectedPublicationId(publication.vppId);
    setModal({ ...modal, page: 2, isOpen: true });
    setAppSelectionModalIsOpen(true);
  };

  useEffect(() => {
    console.log(tab, 'test');
  }, []);

  return (
    <>
      {!isEmpty(publications) ? (
        <ul className="mt-4">
          {publications.map((item: Publication, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelect(item)}
                className="flex bg-white rounded-md border-b border-b-gray-200 hover:bg-indigo-50 cursor-pointer items-center justify-between px-5 py-4 transition-colors ease-in-out"
              >
                <div className=" w-full py-2 px-1 ">
                  <h1 className="font-medium text-xl text-gray-600">
                    {item.positionTitle}
                  </h1>
                  {/* <p className="text-md text-gray-500"></p> */}
                  <p className="text-md text-gray-500">
                    Fulfilled on{' '}
                    {dayjs(item.postingDate).format('MMMM d, YYYY')}
                  </p>
                  <p className="text-sm text-gray-500">{item.itemNumber}</p>
                  <p className="text-xs text-gray-500">
                    {item.placeOfAssignment}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex justify-center pt-20">
          <h1 className="text-4xl text-gray-300">
            No{' '}
            {tab === 1
              ? 'pending publication for selection'
              : tab === 2
              ? 'fulfilled publication'
              : ''}{' '}
            at the moment
          </h1>
        </div>
      )}
    </>
  );
};
