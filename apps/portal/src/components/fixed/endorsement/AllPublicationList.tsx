import dayjs from 'dayjs';
import { HiEye, HiPlusCircle } from 'react-icons/hi';
import { useAppEndStore } from '../../../store/endorsement.store';
import { Publication } from '../../../types/publication.type';
import { Button } from '../../modular/common/forms/Button';

export const AllPublicationList = () => {
  const filteredPublicationList = useAppEndStore(
    (state) => state.filteredPublicationList
  );
  const modal = useAppEndStore((state) => state.modal);
  const setSelectedPublication = useAppEndStore(
    (state) => state.setSelectedPublication
  );
  const setModal = useAppEndStore((state) => state.setModal);
  const setSelectedPublicationId = useAppEndStore(
    (state) => state.setSelectedPublicationId
  );

  const onSelect = (publication: Publication, action: string) => {
    setSelectedPublication(publication);
    setSelectedPublicationId(publication.vppId);

    if (action === 'create') {
      setModal({ ...modal, page: 2 });
    }
    if (action === 'view') {
      setModal({ ...modal, page: 3 });
      // router.push(`/${router.query.id}/applicant-endorsement/${publication.vppId}`)
    }
  };

  return (
    <>
      <ul>
        {filteredPublicationList &&
          filteredPublicationList.map((item: Publication, index: number) => {
            return (
              <li
                key={index}
                // onClick={() => onSelect(item)}
                className="flex items-center justify-between transition-colors ease-in-out border-b bg-inherit"
              >
                <div className="flex items-center justify-between w-full px-4 py-4 hover:bg-indigo-50">
                  <div className="flex flex-col w-full">
                    <h1 className="font-medium text-gray-600">
                      {item.positionTitle}
                    </h1>
                    <p className="text-sm text-gray-500">{item.itemNumber}</p>
                    <p className="text-xs text-gray-500">
                      {item.placeOfAssignment}
                    </p>
                    <div className="text-xs text-indigo-600">
                      {item.hasSelected === 0
                        ? 'Publication posting date: '
                        : item.hasSelected === 1
                        ? 'Fulfilled on '
                        : null}
                      {dayjs(item.postingDeadline).format('MMMM DD, YYYY')}
                    </div>
                  </div>
                  {item.hasSelected === 0 ? (
                    <Button
                      btnLabel="SET"
                      icon={<HiPlusCircle />}
                      className="w-28"
                      btnVariant="default"
                      shadow
                      iconPlacement="start"
                      onClick={() => onSelect(item, 'create')}
                    />
                  ) : (
                    <Button
                      btnLabel="View"
                      icon={<HiEye />}
                      className="w-28"
                      shadow
                      iconPlacement="start"
                      onClick={() => onSelect(item, 'view')}
                    />
                  )}
                </div>
              </li>
            );
          })}
      </ul>
    </>
  );
};
