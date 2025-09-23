import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../modular/buttons/Button';
import { Card } from '../../../modular/cards/Card';
import { InputReactForm } from '../../../modular/inputs/InputReactForm';
import { Modal } from '../../../modular/modals/Modal';
import { Table, TableDimension, TableHeader } from '../../../modular/tables/Table';
import { NoDataVisual } from '../../visuals/NoDataVisual';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RefErrorContext } from '../../../../context/RefErrorContext';
import { DeleteButton } from '../../buttons/Delete';
import { usePdsStore } from '../../../../store/pds.store';
import { useEmployeeStore } from '../../../../store/employee.store';

import { ReferencesAlert } from './ReferencesAlert';
import { Alert } from '../../../../../../../libs/oneui/src/components/Alert';
import { isEmpty } from 'lodash';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
import { EditButton } from '../../buttons/Edit';
import { Reference } from 'apps/pds/src/types/data/supporting-info.type';

// yup validation schema
const schema = yup.object().shape({
  name: yup.string().required('Please enter a name').trim().label('This'),
  address: yup.string().required('Please enter an address').trim().label('This'),
  telephoneNumber: yup
    .string()
    .trim()
    .required('Please enter a valid telephone or mobile number')
    .transform((v, o) => (o === '' ? null : v))
    .nullable(true)
    .min(6, 'Please enter a valid telephone or mobile number')
    .max(12, 'Please enter a valid telephone or mobile number')
    .matches(/^\d+$/)
    .label('This'),
});

export const OIReferences = (): JSX.Element => {
  // set references array, employee object from pds context
  const references = usePdsStore((state) => state.references);
  const setReferences = usePdsStore((state) => state.setReferences);
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const referencesOnEdit = usePdsStore((state) => state.referencesOnEdit);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const [removedReference, setRemovedReference] = useState<Reference>({} as Reference);
  const deletedReferences = useUpdatePdsStore((state) => state.deletedReferences);
  // set reference error state, references ref variable from references error context
  const { refError, setRefError, refRef, shake, setShake } = useContext(RefErrorContext);

  const [addRefIsOpen, setAddRefIsOpen] = useState<boolean>(false); // add reference modal state

  const [removeRefIsOpen, setRemoveRefIsOpen] = useState<boolean>(false); // remove reference modal state

  const [refToRemove, setRefToRemove] = useState<number>(-1); // reference to remove state

  const [isBtnRefDisabled, setIsBtnRefDisabled] = useState(true); // button ref

  const [refForEdit, setRefForEdit] = useState<Reference>({} as Reference);
  const [action, setAction] = useState<string>('');
  const [indexForEdit, setIndexForEdit] = useState<number>(-1);
  const allowAddReference = useUpdatePdsStore((state) => state.allowAddReference);
  const allowEditReference = useUpdatePdsStore((state) => state.allowEditReference);
  const allowDeleteReference = useUpdatePdsStore((state) => state.allowDeleteReference);

  // initialize react hook form and set default values, mode is set to on change
  const {
    register,
    reset,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<Reference>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      _id: '',
      employeeId: employee.employmentDetails.userId,
      name: '',
      address: '',
      telephoneNumber: '',
      isEdited: false,
    },
  });

  const setInitialValues = () => {
    setReferences(initialPdsState.references);
  };

  // fire submit button
  const onSubmit = handleSubmit((ref: Reference, e: any) => {
    e.preventDefault();
    // create action
    if (action === 'create') {
      const createdRefs = [...references];
      createdRefs.push(ref);
      setReferences(createdRefs);
      setAction('');
      reset();
      setAddRefIsOpen(false);
    }

    // update action
    else if (action === 'update') {
      const updatedRefs: Array<Reference> = [...references];
      const newUpdatedRefs = updatedRefs.map((previousRef: Reference, refIdx: number) => {
        if (refIdx === indexForEdit) {
          return {
            ...previousRef,
            _id: ref._id,
            address: ref.address,
            employeeId: ref.employeeId,
            name: ref.name,
            telephoneNumber: ref.telephoneNumber,
            isEdited: true,
          };
        }
        return previousRef;
      });

      setReferences(newUpdatedRefs);
      setRefForEdit({} as Reference);
      setIndexForEdit(-1);
      reset();
      setAddRefIsOpen(false);
      setAction('');
    }
  });

  // open add modal
  const openModal = () => {
    setAction('create');
    reset();
    clearErrors();
    setAddRefIsOpen(true);
  };

  // close add modal
  const closeModal = () => {
    setAction('');
    setRefForEdit({} as Reference);
    reset();
    clearErrors();
    setAddRefIsOpen(false);
  };

  // when edit button is clicked
  const onEdit = (ref: Reference, index: number) => {
    setAction('update');
    setRefForEdit(ref);
    loadNewDefaultValues(ref); //!
    setAddRefIsOpen(true);
    setIndexForEdit(index);
  };

  // load state
  const loadNewDefaultValues = (ref: Reference) => {
    setValue('_id', ref._id);
    setValue('employeeId', ref.employeeId);
    setValue('name', ref.name);
    setValue('telephoneNumber', ref.telephoneNumber);
    setValue('address', ref.address);
    setValue('isEdited', ref.isEdited);
  };

  // open remove action modal
  const openRemoveActionModal = (refIdx: number, reference: Reference) => {
    setRemoveRefIsOpen(true);
    setRefToRemove(refIdx);
    setRemovedReference(reference);
  };

  // handle remove title action
  const handleRemoveTitle = (refIdx: number) => {
    const updatedRefs = [...references];
    updatedRefs.splice(refIdx, 1);
    if (!isEmpty(removedReference._id)) deletedReferences.push(removedReference);
    setReferences(updatedRefs);
    setRemoveRefIsOpen(false);
  };

  // disable button if length of array is equal to 3
  useEffect(() => {
    references.length < 3 ? setIsBtnRefDisabled(false) : setIsBtnRefDisabled(true);
  }, [references]);

  // set reference error to false if length of array is equal to 3
  useEffect(() => {
    if (references.length === 3) setRefError(false);
  }, [references, refError]);

  return (
    <>
      <Card
        title="Character References"
        subtitle="Add three(3) references."
        remarks={<ReferencesAlert setInitialValues={setInitialValues} />}
      >
        <div
          className={`flex flex-col items-end justify-end ${
            referencesOnEdit ? '  visible' : !hasPds ? 'visible' : 'hidden'
          }`}
        >
          <Button
            btnLabel={references.length < 3 ? `Add Character Reference` : `Cannot Add more`}
            variant="theme"
            type="button"
            className="sm:w-full lg:w-60"
            onClick={openModal}
            muted={isBtnRefDisabled}
          />
        </div>
        <>
          {refError ? (
            <div
              className={`${shake && 'animate'} rounded-md bg-red-500`}
              onAnimationEnd={() => setShake(false)}
              tabIndex={1}
              ref={refRef}
            >
              <p className="w-full px-10 not-italic text-center text-white uppercase ">Incomplete References</p>
            </div>
          ) : (
            <></>
          )}

          <Modal
            title="References"
            subtitle={
              <>
                Indicate the FULL name of references with the format SURNAME, FIRST NAME MI, their office or residential
                addresses and respective telephone numbers. Persons should not be related by consanguinity or affinity
                to applicant /appointee <br></br>Please fill-out all required fields ({' '}
                <span className="text-red-700">*</span> )
              </>
            }
            formId="references"
            isOpen={addRefIsOpen}
            setIsOpen={setAddRefIsOpen}
            action={onSubmit}
            onClose={closeModal}
            withCancelBtn
            isStatic={true}
            verticalCenter
            modalSize="xxl"
            actionLabel={action === 'create' ? 'Submit' : action === 'update' ? 'Update' : ''}
            cancelLabel="Cancel"
            modalChildren={
              <>
                <div className="gap-4 p-5">
                  <div className="mb-5">
                    <InputReactForm
                      id="refname"
                      name="refname"
                      label="Full Name"
                      labelIsRequired
                      placeholder={'Write in Full'}
                      type="text"
                      controller={{ ...register('name') }}
                      withLabel={true}
                      withHelpButton
                      helpContent="Provide the first name and last name only"
                      isError={errors.name ? true : false}
                      errorMessage={errors.name?.message}
                    />
                  </div>
                  <div className="my-5">
                    <InputReactForm
                      id="refaddress"
                      name="refaddress"
                      label="Office/Residential Address"
                      labelIsRequired
                      withHelpButton
                      helpContent="Provide the full office or residential address"
                      placeholder="Write in Full"
                      type="text"
                      controller={{ ...register('address') }}
                      withLabel={true}
                      isError={errors.address ? true : false}
                      errorMessage={errors.address?.message}
                    />
                  </div>
                  <div className="my-5">
                    <InputReactForm
                      id="reftelnumber"
                      name="reftelnumber"
                      label="Telephone or Mobile Number"
                      labelIsRequired
                      placeholder="Write in Full"
                      type="text"
                      maxLength={12}
                      withHelpButton
                      helpContent="Provide an active telephone or mobile number"
                      controller={{ ...register('telephoneNumber') }}
                      withLabel={true}
                      isError={errors.telephoneNumber ? true : false}
                      errorMessage={errors.telephoneNumber?.message}
                    />
                  </div>
                </div>
              </>
            }
          />
          <Alert open={removeRefIsOpen} setOpen={setRemoveRefIsOpen}>
            <Alert.Description>
              <div className="flex gap-2">
                <div className="w-[25%] text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-20 h-20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </div>

                <p className="w-[75%] px-4">Are you sure you want to remove this? This action cannot be undone. </p>
              </div>
            </Alert.Description>
            <Alert.Footer>
              <div className="flex w-full gap-4">
                <Button
                  variant="light"
                  onClick={() => setRemoveRefIsOpen(false)}
                  className="hover:bg-gray-200 active:bg-gray-200"
                >
                  No
                </Button>
                <Button variant="theme" onClick={() => handleRemoveTitle(refToRemove)}>
                  Yes
                </Button>
              </div>
            </Alert.Footer>
          </Alert>

          {references.length === 0 ? (
            <>
              <NoDataVisual />
            </>
          ) : (
            <>
              <Table
                tableHeader={
                  <>
                    <TableHeader label="Full Name" headerWidth="w-[25%]" className="pl-4" />
                    <TableHeader label="Address" headerWidth="w-[35%]" />
                    <TableHeader label="Telephone or Mobile Number" headerWidth="w-[25%]" />
                    <TableHeader label="Actions" headerWidth="w-[15%]" alignment="center" />
                  </>
                }
                tableBody={
                  <>
                    <tbody>
                      {references &&
                        references.map((ref: Reference, refIdx: number) => {
                          return (
                            <tr
                              key={refIdx}
                              className={`odd:bg-indigo-50 even:bg-slate-50 hover:cursor-default hover:bg-indigo-200`}
                            >
                              <TableDimension isText={true} label={ref.name} className="pl-4" />
                              <TableDimension isText={true} label={ref.address} />
                              <TableDimension isText={true} label={ref.telephoneNumber} />
                              <TableDimension
                                isText={false}
                                className="px-2 text-center select-none"
                                tableDimension={
                                  <>
                                    <div className="flex justify-center gap-4">
                                      <div className="w-8">
                                        <EditButton
                                          disabled={
                                            hasPds && referencesOnEdit
                                              ? false
                                              : hasPds && !referencesOnEdit
                                              ? true
                                              : !hasPds && false
                                          }
                                          action={() => onEdit(ref, refIdx)}
                                        />
                                      </div>
                                      <div className="w-8">
                                        <DeleteButton
                                          action={() => openRemoveActionModal(refIdx, ref)}
                                          muted={
                                            hasPds && referencesOnEdit
                                              ? false
                                              : hasPds && !referencesOnEdit
                                              ? true
                                              : !hasPds && false
                                          }
                                        />
                                      </div>
                                    </div>
                                  </>
                                }
                              />
                            </tr>
                          );
                        })}
                    </tbody>
                  </>
                }
              />
            </>
          )}
        </>
      </Card>
    </>
  );
};
