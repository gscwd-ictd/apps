import { Publication } from '../../../types/publication.type';

type SelectedPlacementPublicationProps = {
  publication: Publication;
};

export const SelectedPlacementPublication = ({
  publication,
}: SelectedPlacementPublicationProps) => {
  return (
    <>
      <div className="w-full">
        <div className="bg-indigo-800 h-auto rounded p-4 flex">
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
              <p className="flex justify-start font-normal text-xs text-gray-100 w-[75%] pl-10">
                PRF No:
              </p>
              <p className="flex justify-start font-normal text-sm text-white w-[25%]">
                {publication.prfNo}
              </p>
            </div>

            <div className="flex w-full align-text-top pt-[0.2rem]">
              <p className="flex justify-start font-normal text-xs text-gray-100 w-[75%] pl-10">
                With Exam:
              </p>
              <p className="flex justify-start font-normal text-sm text-white w-[25%]">
                {Boolean(publication.withExam) === false ? 'No' : 'Yes'}
              </p>
            </div>

            <div className="flex w-full align-text-top pt-[0.2rem]">
              <p className="flex justify-start font-normal text-xs text-gray-100 w-[75%]  pl-10">
                No. of positions needed:
              </p>
              <p className="flex justify-start font-normal text-sm text-white w-[25%]">
                {publication.numberOfPositions}
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
