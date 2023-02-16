import { useAppEndStore } from '../../../store/endorsement.store';
import { Publication } from '../../../types/publication.type';
import { useRouter } from 'next/router';
import { employee } from '../../../../utils/constants/data';
import dayjs from 'dayjs';

type AllPublicationListTabProps = {
    publications: Array<Publication>
    tab: number
}

export const AllPublicationListTab = ({ publications, tab }: AllPublicationListTabProps) => {

    const router = useRouter();

    const modal = useAppEndStore((state) => state.modal);

    const setSelectedPublication = useAppEndStore((state) => state.setSelectedPublication);

    const setModal = useAppEndStore((state) => state.setModal);

    const setSelectedPublicationId = useAppEndStore((state) => state.setSelectedPublicationId);

    const selectedPublicationId = useAppEndStore((state) => state.selectedPublicationId)

    const setAction = useAppEndStore((state) => state.setAction)

    const onSelect = (publication: Publication) => {
        setSelectedPublication(publication);
        setSelectedPublicationId(publication.vppId);
        if (tab === 1) {
            setAction('create')
            setModal({ ...modal, page: 2, isOpen: true });
        }
        else if (tab === 2) {
            setAction('view')
            setModal({ ...modal, page: 3, isOpen: true });
        }
    };

    return (
        <>
            {publications && publications.length > 0 ? (
                <ul className="mt-4">
                    {publications.map((item: Publication, index: number) => {
                        return (
                            <li
                                key={index}
                                onClick={() => onSelect(item)}
                                className="flex bg-white rounded-xl rounded-tr-none rounded-bl-none border-b border-b-gray-200 hover:bg-indigo-50 cursor-pointer items-center justify-between px-5 py-4 transition-colors ease-in-out"
                            >
                                <div className=" w-full py-2 px-1 ">
                                    <h1 className="font-medium text-xl text-gray-600">{item.positionTitle}</h1>
                                    {/* <p className="text-md text-gray-500"></p> */}
                                    <p className="text-sm text-gray-500">{item.itemNumber}</p>
                                    <p className="text-xs text-gray-500">{item.placeOfAssignment}</p>
                                    <p className="text-sm text-indigo-500">Fulfilled on {dayjs(item.postingDate).format('MMMM d, YYYY')}</p>

                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="flex justify-center pt-20">
                    <h1 className="text-4xl text-gray-300">No {tab === 1 ? 'pending endorsement list for selection' : tab === 2 ? 'fulfilled endorsement list' : ''} at the moment</h1>
                </div>
            )}
        </>
    );
};
