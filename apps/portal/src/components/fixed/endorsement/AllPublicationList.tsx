import { HiEye, HiPlusCircle } from 'react-icons/hi';
import { useAppEndStore } from '../../../store/endorsement.store';
import { Publication } from '../../../types/publication.type';
import { Button } from '../../modular/common/forms/Button';

export const AllPublicationList = () => {
  const publicationList = useAppEndStore((state) => state.publicationList);
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
        {publicationList &&
          publicationList.map((item: Publication, index: number) => {
            return (
              <li
                key={index}
                // onClick={() => onSelect(item)}
                className="flex items-center justify-between py-4 transition-colors ease-in-out bg-inherit border-l-transparent"
              >
                <div className="flex items-center justify-between w-full px-5 py-2 hover:bg-indigo-50 ">
                  <div className="flex flex-col w-full">
                    <h1 className="font-medium text-gray-600">
                      {item.positionTitle}
                    </h1>
                    <p className="text-sm text-gray-500">{item.itemNumber}</p>
                    <p className="text-xs text-gray-500">
                      {item.placeOfAssignment}
                    </p>
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
