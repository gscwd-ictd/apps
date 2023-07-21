import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../modular/buttons/Button';
import { Card } from '../../../modular/cards/Card';
import { InputReactForm } from '../../../modular/inputs/InputReactForm';
import { Modal } from '../../../modular/modals/Modal';
import { SelectListRF } from '../../../modular/select/SelectListRF';
import {
  Table,
  TableDimension,
  TableHeader,
} from '../../../modular/tables/Table';
import { NoDataVisual } from '../../visuals/NoDataVisual';
import { yupResolver } from '@hookform/resolvers/yup';
import { ModalAction } from '../../modals/Action';
import { DeleteButton } from '../../buttons/Delete';
import schema from '../../../../schema/LND';
import { usePdsStore } from '../../../../store/pds.store';
import { lndType } from '../../../../../utils/constants/constants';
import { useApplicantStore } from '../../../../store/applicant.store';
import { LearningDevelopment } from 'apps/job-portal/utils/types/data/lnd.type';

export const LearningNDevt = (): JSX.Element => {
  // set learning and development array, employee object state from pds store
  const learningDevelopment = usePdsStore((state) => state.learningDevelopment);
  const setLearningDevelopment = usePdsStore(
    (state) => state.setLearningDevelopment
  );
  const applicant = useApplicantStore((state) => state.applicant);
  const [addLndIsOpen, setAddLndIsOpen] = useState<boolean>(false); // open add modal state
  const [removeLndIsOpen, setRemoveLndIsOpen] = useState<boolean>(false); // open remove modal state
  const [lndToRemove, setLndToRemove] = useState<number>(-1); // learning and development to remove state
  const [removedLnd, setRemovedLnd] = useState<LearningDevelopment>(
    {} as LearningDevelopment
  );
  const deletedLearningDevelopments = usePdsStore(
    (state) => state.deletedLearningDevelopments
  );
  const setDeletedLearningDevelopments = usePdsStore(
    (state) => state.setDeletedLearningDevelopments
  );

  // initialize react hook form and set default values, mode is set to on change
  const {
    handleSubmit,
    register,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<LearningDevelopment>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      conductedBy: '',
      type: '',
      from: '',
      to: '',
      numberOfHours: null,
      _id: '',
    },
  });

  // fire submit button
  const onSubmit = handleSubmit((training: LearningDevelopment, e: any) => {
    e.preventDefault();
    // check if inclusive date is valid
    const updatedLND = [...learningDevelopment];
    updatedLND.push(training);
    const sortedUpdatedTraining = [...updatedLND].sort(
      (firstItem, secondItem) =>
        firstItem.to! > secondItem.to!
          ? -1
          : secondItem.to! > firstItem.to!
          ? 1
          : 0
    );
    setLearningDevelopment(sortedUpdatedTraining);
    reset();
    setAddLndIsOpen(false);
  });

  // open add modal
  const openModal = () => {
    reset();
    clearErrors();
    setAddLndIsOpen(true);
  };

  // close add modal
  const closeModal = () => {
    reset();
    clearErrors();
    setAddLndIsOpen(false);
  };

  // open remove action modal
  const openRemoveActionModal = (lnd: LearningDevelopment, lndIdx: number) => {
    setRemoveLndIsOpen(true);
    setLndToRemove(lndIdx);
    setRemovedLnd(lnd);
  };

  // remove lnd action
  const handleRemoveTraining = (trainingIdx: number) => {
    const updatedLND = [...learningDevelopment];
    const deleted = [...deletedLearningDevelopments];
    updatedLND.splice(trainingIdx, 1);
    deleted.push(removedLnd);
    setDeletedLearningDevelopments(deleted);
    setLearningDevelopment(updatedLND);
    setRemoveLndIsOpen(false);
  };

  return (
    <>
      <Card
        title="Learning & Development"
        subtitle=""
        remarks={
          <Button
            btnLabel="Add Learning & Development"
            type="button"
            variant="theme"
            shadow
            onClick={openModal}
            className="xs:w-full lg:w-72"
          />
        }
      >
        <>
          <Modal
            title="Learning & Development"
            subtitle={
              <>
                Start from the most recent L&D/training program and include only
                the relevant L&D/training taken for the last five (5) years for
                Division Chief/Executive/Managerial positions <br></br> Please
                fill-out all required fields ({' '}
                <span className="text-red-700">*</span> )
              </>
            }
            formId="lnd"
            isOpen={addLndIsOpen}
            setIsOpen={setAddLndIsOpen}
            action={onSubmit}
            onClose={closeModal}
            withCancelBtn
            isStatic={true}
            verticalCenter
            modalSize="xxxxl"
            actionLabel="Submit"
            cancelLabel="Cancel"
          >
            <>
              <div className="gap-4 p-5 mb-5">
                <div className="w-full mb-5">
                  <InputReactForm
                    id="lndtitle"
                    name="lndtitle"
                    label="Title"
                    placeholder="Write in Full. Do not abbreviate."
                    type="text"
                    labelIsRequired
                    controller={{ ...register('title') }}
                    withLabel={true}
                    isError={errors.title ? true : false}
                    errorMessage={errors.title?.message}
                  />
                </div>

                <div className="w-full mt-10">
                  <InputReactForm
                    id="lndconductedby"
                    name="lndconductedby"
                    label="Conducted By"
                    placeholder="Write in Full."
                    withHelpButton
                    helpContent="Indicate the FULL name of institution/agency that conducted or sponsored the program. Do not use abbreviation (e.g. CSC should be Civil Service Commission)."
                    type="text"
                    labelIsRequired
                    controller={{ ...register('conductedBy') }}
                    withLabel={true}
                    isError={errors.conductedBy ? true : false}
                    errorMessage={errors.conductedBy?.message}
                  />
                </div>

                <div className="w-full mt-10">
                  <SelectListRF
                    id="lndtype"
                    selectList={lndType}
                    defaultOption=""
                    withLabel
                    variant="simple"
                    labelIsRequired
                    label="Type of Learning & Development"
                    controller={{ ...register('type') }}
                    appearance={'modal'}
                    isError={errors.type ? true : false}
                    errorMessage={errors.type?.message}
                  />
                </div>

                <div className="grid-cols-2 gap-8 mt-10 sm:block lg:flex">
                  <div className="w-full col-span-1 mb-10">
                    <InputReactForm
                      id="lndfrom"
                      name="lndfrom"
                      label="From"
                      placeholder=""
                      type="date"
                      labelIsRequired
                      controller={{ ...register('from') }}
                      withLabel={true}
                      isError={errors.from ? true : false}
                      errorMessage={errors.from?.message}
                    />
                  </div>

                  <div className="w-full col-span-1 mb-10">
                    <InputReactForm
                      id="lndto"
                      name="lndto"
                      label="To"
                      placeholder=""
                      labelIsRequired
                      type="date"
                      controller={{ ...register('to') }}
                      withLabel={true}
                      isError={errors.to ? true : false}
                      errorMessage={errors.to?.message}
                    />
                  </div>
                </div>

                <div className="w-full mb-10">
                  <InputReactForm
                    id="lndhours"
                    name="lndhours"
                    label="Number of Hours"
                    withHelpButton
                    helpContent="Indicate the number of hours attended for the program."
                    placeholder="Total number of hours"
                    type="number"
                    labelIsRequired
                    controller={{ ...register('numberOfHours') }}
                    withLabel={true}
                    isError={errors.numberOfHours ? true : false}
                    errorMessage={errors.numberOfHours?.message}
                  />
                </div>
              </div>
            </>
          </Modal>
          <ModalAction
            isOpen={removeLndIsOpen}
            setIsOpen={setRemoveLndIsOpen}
            action={() => handleRemoveTraining(lndToRemove)}
          />
          {learningDevelopment.length === 0 ? (
            <NoDataVisual />
          ) : (
            <>
              <Table
                tableHeader={
                  <>
                    <TableHeader
                      label="Title"
                      headerWidth="w-[25%]"
                      className="pl-4"
                    />
                    <TableHeader label="Conducted By" headerWidth="w-[25%]" />
                    <TableHeader label="Type" headerWidth="w-[10%]" />
                    <TableHeader label="Date Start" headerWidth="w-[10%]" />
                    <TableHeader label="Date End" headerWidth="w-[10%]" />
                    <TableHeader
                      label="Number of Hours"
                      headerWidth="w-[10%]"
                    />
                    <TableHeader
                      label="Actions"
                      headerWidth="w-[15%]"
                      alignment="center"
                    />
                  </>
                }
                tableBody={
                  <tbody>
                    {learningDevelopment.map(
                      (training: LearningDevelopment, trainingIdx: number) => {
                        return (
                          <tr
                            key={trainingIdx}
                            className="odd:bg-gray-100/80 even:bg-gray-200/70 hover:cursor-default hover:bg-indigo-200 hover:transition-all"
                          >
                            <TableDimension
                              isText={true}
                              label={training.title}
                              className="px-4"
                            />
                            <TableDimension
                              isText={true}
                              label={training.conductedBy}
                              className="pr-1 select-none"
                            />
                            <TableDimension
                              isText={true}
                              className="pr-1"
                              label={training.type}
                            />
                            <TableDimension
                              isText={true}
                              className="pr-1"
                              label={training.from}
                            />
                            <TableDimension
                              isText={true}
                              className="pr-1"
                              label={training.to}
                            />
                            <TableDimension
                              isText={true}
                              className="pr-1"
                              label={training.numberOfHours}
                            />
                            <TableDimension
                              isText={false}
                              className="px-2 text-center select-none"
                              tableDimension={
                                <>
                                  <DeleteButton
                                    action={() =>
                                      openRemoveActionModal(
                                        training,
                                        trainingIdx
                                      )
                                    }
                                  />
                                </>
                              }
                            />
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                }
              />
            </>
          )}
        </>
      </Card>
    </>
  );
};
