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
        <div className="bg-indigo-800 h-auto rounded p-4 mx-2 flex flex-col lg:flex-row">
          <section className="w-full lg:w-[50%] ">
            <div className="flex w-full align-text-top pt-[0.2rem]">
              <p className="flex justify-start text-sm font-light text-gray-100 w-[25%]">
                Position title:
              </p>
              <p className="flex justify-start font-semibold text-md text-white w-[75%] pl-10">
                {publication.positionTitle} (Salary Grade{' '}
                {publication.salaryGradeLevel})
              </p>
            </div>

            <div className="flex w-full align-text-top pt-[0.2rem]">
              <p className="flex justify-start font-light text-sm text-gray-100 w-[25%]">
                Item No:
              </p>
              <p className="flex justify-start font-normal text-sm text-white w-[75%] pl-10">
                {publication.itemNumber}
              </p>
            </div>

            <div className="flex w-full align-text-top pt-[0.2rem]">
              <p className="flex justify-start font-light text-sm text-gray-100 w-[25%]">
                Assignment:
              </p>
              <p className="flex justify-start font-normal text-sm text-white w-[75%] pl-10">
                {publication.placeOfAssignment}
              </p>
            </div>
          </section>

          <section className="w-full lg:w-[50%] lg:pl-28">
            <div className="flex w-full align-text-top pt-[0.2rem]">
              <p className="flex justify-start font-light text-sm text-gray-100 w-[25%] lg:w-[75%] lg:pl-10">
                PRF No:
              </p>
              <p className="flex justify-start font-normal text-sm text-white w-[75%] lg:w-[25%] pl-10 lg:pl-0">
                {publication.prfNo}
              </p>
            </div>

            <div className="flex w-full align-text-top pt-[0.2rem]">
              <p className="flex justify-start font-light text-sm text-gray-100 w-[25%] lg:w-[75%] lg:pl-10">
                With Exam:
              </p>
              <p className="flex justify-start font-normal text-sm text-white w-[75%] lg:w-[25%] pl-10 lg:pl-0">
                {Boolean(publication.withExam) === false ? 'No' : 'Yes'}
              </p>
            </div>

            <div className="flex w-full align-text-top pt-[0.2rem]">
              <p className="flex justify-start font-light text-sm text-gray-100 w-[25%] lg:w-[75%] lg:pl-10">
                No. of positions needed:
              </p>
              <p className="flex justify-start font-normal text-sm text-white w-[75%] lg:w-[25%] pl-10 lg:pl-0">
                {publication.numberOfPositions}
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
