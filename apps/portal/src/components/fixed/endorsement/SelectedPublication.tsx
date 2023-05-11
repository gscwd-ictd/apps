import { Publication } from '../../../types/publication.type';

type SelectedPublicationProps = {
  publication: Publication;
};

export const SelectedPublication = ({
  publication,
}: SelectedPublicationProps) => {
  return (
    <>
      <div className="w-full">
        <div className="flex h-auto p-4 bg-indigo-800 rounded">
          <section className="w-[50%] ">
            <div className="flex w-full align-text-top pt-[0.2rem]">
              <p className="flex justify-start font-normal text-xs text-gray-100 w-[25%]">
                Position title:
              </p>
              <p className="flex justify-start font-normal text-sm text-white w-[75%] pl-10">
                {publication.positionTitle} (Salary Grade{' '}
                {publication.salaryGradeLevel})
              </p>
            </div>

            <div className="flex w-full align-text-top pt-[0.2rem]">
              <p className="flex justify-start font-normal text-xs text-gray-100 w-[25%]">
                Item No:
              </p>
              <p className="flex justify-start font-normal text-sm text-white w-[75%] pl-10">
                {publication.itemNumber}
              </p>
            </div>

            <div className="flex w-full align-text-top pt-[0.2rem]">
              <p className="flex justify-start font-normal text-xs text-gray-100 w-[25%]">
                Assignment:
              </p>
              <p className="flex justify-start font-normal text-sm text-white w-[75%] pl-10">
                {publication.placeOfAssignment}
              </p>
            </div>
          </section>

          <section className="w-[50%] pl-28">
            <div className="flex w-full align-text-top pt-[0.2rem]">
              <p className="flex justify-start font-normal text-xs text-gray-100 w-[25%]">
                PRF No:
              </p>
              <p className="flex justify-start font-normal text-sm text-white w-[75%] pl-10">
                {publication.prfNo}
              </p>
            </div>

            <div className="flex w-full align-text-top pt-[0.2rem]">
              <p className="flex justify-start font-normal text-xs text-gray-100 w-[25%]">
                With Exam:
              </p>
              <p className="flex justify-start font-normal text-sm text-white w-[75%] pl-10">
                {publication.itemNumber === '0' ? 'No' : 'Yes'}
              </p>
            </div>

            <div className="flex w-full align-text-top pt-[0.2rem]">
              <p className="flex justify-start font-normal text-xs text-gray-100 w-[25%]">
                No. of positions needed:
              </p>
              <p className="flex justify-start font-normal text-sm text-white w-[75%] pl-10">
                {publication.numberOfPositions}
              </p>
            </div>
          </section>
        </div>
        {/* <div className="flex items-center justify-between w-full px-4 py-4 bg-indigo-100 rounded">
          <div className="flex flex-col w-full ">
            <h1 className="text-xl font-medium text-gray-600">
              {publication.positionTitle}
            </h1>
            <p className="text-gray-500 text-md">{publication.itemNumber}</p>
            <p className="text-sm text-gray-500">
              {publication.placeOfAssignment}
            </p>
            <div className="text-sm text-indigo-600">
              {publication.hasSelected === 0
                ? 'Publication posting date: '
                : publication.hasSelected === 1
                ? 'Fulfilled on '
                : null}
              {dayjs(publication.postingDeadline).format('MMMM DD, YYYY')}
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};
