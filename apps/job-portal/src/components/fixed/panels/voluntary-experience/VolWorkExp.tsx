import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../modular/buttons/Button';
import { Card } from '../../../modular/cards/Card';
import { InputReactForm } from '../../../modular/inputs/InputReactForm';
import { Modal } from '../../../modular/modals/Modal';
import {
  Table,
  TableDimension,
  TableHeader,
} from '../../../modular/tables/Table';
import { NoDataVisual } from '../../visuals/NoDataVisual';
import { CheckboxRF } from '../../../modular/inputs/CheckboxRF';
import { yupResolver } from '@hookform/resolvers/yup';
import { ModalAction } from '../../modals/Action';
import { DeleteButton } from '../../buttons/Delete';
import { usePdsStore } from '../../../../store/pds.store';
import schema from '../../../../schema/VolWork';
import { VoluntaryWork } from 'apps/job-portal/utils/types/data/vol-work.type';

export const VolWorkExp = (): JSX.Element => {
  // set voluntary work array, employee object state from pds context
  const voluntaryWork = usePdsStore((store) => store.voluntaryWork);
  const setVoluntaryWork = usePdsStore((store) => store.setVoluntaryWork);

  const [addVolWorkIsOpen, setAddVolWorkIsOpen] = useState<boolean>(false); // open add modal
  const [removeVolWorkIsOpen, setRemoveVolWorkIsOpen] =
    useState<boolean>(false); // remove voluntary work state
  const [volWorkToRemove, setVolWorkToRemove] = useState<number>(-1); // voluntary work to remove (number)
  const [removedVolWork, setRemovedVolWork] = useState<VoluntaryWork>(
    {} as VoluntaryWork
  );
  const deletedVolWorks = usePdsStore((state) => state.deletedVolWorks);
  const setDeletedVolWorks = usePdsStore((state) => state.setDeletedVolWorks);

  // initialize react hook form and set default values, mode is set to on change
  const {
    setValue,
    handleSubmit,
    getValues,
    reset,
    watch,
    register,
    clearErrors,
    formState: { errors },
  } = useForm<VoluntaryWork>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      isCurrentlyVol: false,
      organizationName: '',
      position: '',
      from: '',
      to: null,
      numberOfHours: null,
      _id: '',
    },
  });

  const getIsCurrentlyVol = getValues('isCurrentlyVol'); // assign getvalues is currently volunteering
  const watchIsCurrentlyVol = watch('isCurrentlyVol'); // assign watch is currently volunteering

  // fire submit button
  const onSubmit = handleSubmit((work: VoluntaryWork, e: any) => {
    e.preventDefault();
    if (work.to === '') work.to = 'Presently volunteering';
    const updatedVolWork = [...voluntaryWork];
    updatedVolWork.push(work);
    setVoluntaryWork(updatedVolWork);
    reset();
    setAddVolWorkIsOpen(false);
  });

  // open add modal
  const openModal = () => {
    reset();
    clearErrors();
    setAddVolWorkIsOpen(true);
  };

  // close add modal
  const closeModal = () => {
    reset();
    clearErrors();
    setAddVolWorkIsOpen(false);
  };

  // remove action modal
  const openRemoveActionModal = (
    volWork: VoluntaryWork,
    volWorkIdx: number
  ) => {
    setRemoveVolWorkIsOpen(true);
    setVolWorkToRemove(volWorkIdx);
    setRemovedVolWork(volWork);
  };

  // remove work action
  const handleRemoveWork = (workIdx: number) => {
    const updatedVolWork = [...voluntaryWork];
    const deleted = [...deletedVolWorks];
    setDeletedVolWorks(deleted);
    updatedVolWork.splice(workIdx, 1);
    setVoluntaryWork(updatedVolWork);
    setRemoveVolWorkIsOpen(false);
  };

  // set the date-to to default if Currently Volunteering is ticked
  useEffect(() => {
    if (getIsCurrentlyVol === true) {
      setValue('to', null);
      setValue('numberOfHours', null);
      clearErrors('numberOfHours');
      clearErrors('to');
    }
  }, [watchIsCurrentlyVol]);

  return (
    <>
      <Card
        title="Voluntary Work Experience"
        subtitle=""
        remarks={
          <Button
            btnLabel="Add Voluntary Work"
            type="button"
            variant="theme"
            shadow
            onClick={openModal}
            className="xs:w-full sm:w-full lg:w-72"
          />
        }
      >
        <>
          <Modal
            title="Voluntary Work Experience"
            subtitle={
              <>
                Involvment in Civic/Non-Government /People/Voluntary
                Organizations <br></br> Please fill-out all required fields ({' '}
                <span className="text-red-700">*</span> )
              </>
            }
            formId="volwork"
            isOpen={addVolWorkIsOpen}
            setIsOpen={setAddVolWorkIsOpen}
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
                    id="volworkorgname"
                    name="volworkorgname"
                    label="Organization Name"
                    placeholder="Write in Full. Do not abbreviate."
                    type="text"
                    labelIsRequired
                    controller={{
                      ...register('organizationName', { required: true }),
                    }}
                    withLabel={true}
                    isError={errors.organizationName ? true : false}
                    errorMessage={errors.organizationName?.message}
                  />
                </div>

                <div className="w-full mt-5 ">
                  <InputReactForm
                    id="volworkpos"
                    name="volworkpos"
                    label="Position Title"
                    placeholder="Write in Full."
                    type="text"
                    labelIsRequired
                    controller={{
                      ...register('position', { required: true }),
                    }}
                    withLabel={true}
                    isError={errors.position ? true : false}
                    errorMessage={errors.position?.message}
                  />
                </div>

                <div className="grid-cols-2 gap-8 mt-10 sm:grid md:grid lg:flex">
                  <div className="w-full col-span-1 sm:block">
                    <InputReactForm
                      id="volworkfrom"
                      name="volworkfrom"
                      label="From"
                      placeholder=""
                      type="date"
                      className="cursor-pointer"
                      labelIsRequired
                      controller={{ ...register('from', { required: true }) }}
                      withLabel={true}
                      isError={errors.from ? true : false}
                      errorMessage={errors.from?.message}
                    />
                  </div>
                  <div className="w-full col-span-1 sm:block">
                    <div className="justify-end xs:flex sm:-mt-6 sm:flex md:-mt-6 md:flex lg:-mt-6 lg:flex">
                      <CheckboxRF
                        id="isCurrentlyVol"
                        name="isCurrentlyVol"
                        label="Currently Volunteering?"
                        controller={{ ...register('isCurrentlyVol') }}
                      />
                    </div>
                    <InputReactForm
                      id="volworkto"
                      name="volworkto"
                      label="To"
                      placeholder=""
                      className="cursor-pointer"
                      labelIsRequired={!getIsCurrentlyVol}
                      type="date"
                      controller={{ ...register('to') }}
                      withLabel={true}
                      muted={getIsCurrentlyVol}
                      isError={errors.to ? true : false}
                      errorMessage={errors.to?.message}
                    />
                  </div>
                </div>

                <div className="w-full my-10">
                  <InputReactForm
                    id="volworkhours"
                    name="volworkhours"
                    label="Number of Hours"
                    placeholder={
                      getIsCurrentlyVol === false
                        ? 'Total number of hours'
                        : 'Not Applicable'
                    }
                    withHelpButton
                    helpContent="Indicate the number of hours of voluntary work rendered."
                    type="number"
                    muted={getIsCurrentlyVol}
                    labelIsRequired={false}
                    controller={{
                      ...register('numberOfHours', {
                        required: true,
                        min: 1,
                      }),
                    }}
                    withLabel={true}
                    isError={errors.numberOfHours ? true : false}
                    errorMessage={errors.numberOfHours?.message}
                  />
                </div>
              </div>
            </>
          </Modal>
          <ModalAction
            isOpen={removeVolWorkIsOpen}
            setIsOpen={setRemoveVolWorkIsOpen}
            action={() => handleRemoveWork(volWorkToRemove)}
          />
          {voluntaryWork.length === 0 ? (
            <NoDataVisual />
          ) : (
            <>
              <Table
                tableHeader={
                  <>
                    <TableHeader
                      label="Organization Name"
                      headerWidth="w-[25%]"
                      className="pl-4"
                    />
                    <TableHeader label="Position" headerWidth="w-[25%]" />
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
                    {voluntaryWork.map(
                      (work: VoluntaryWork, workIdx: number) => {
                        return (
                          <tr
                            key={workIdx}
                            className="odd:bg-gray-100/80 even:bg-gray-200/70 hover:cursor-default hover:bg-indigo-200 hover:transition-all "
                          >
                            <TableDimension
                              isText={true}
                              label={work.organizationName}
                              className="px-4 "
                            />
                            <TableDimension
                              isText={true}
                              label={work.position}
                              className="select-none"
                            />
                            <TableDimension
                              isText={true}
                              className=""
                              label={work.from}
                            />
                            <TableDimension
                              isText={true}
                              className=""
                              label={work.to ? work.to : 'Ongoing'}
                            />
                            <TableDimension
                              isText={true}
                              className=""
                              label={
                                work.numberOfHours ? work.numberOfHours : 'N/A'
                              }
                            />
                            <TableDimension
                              isText={false}
                              className="px-2 text-center select-none"
                              tableDimension={
                                <>
                                  <DeleteButton
                                    action={() =>
                                      openRemoveActionModal(work, workIdx)
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
