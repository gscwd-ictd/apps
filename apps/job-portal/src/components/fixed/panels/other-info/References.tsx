import { useContext, useEffect, useState } from 'react';
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
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ModalAction } from '../../modals/Action';
import { RefErrorContext } from '../../../../context/RefErrorContext';
import { DeleteButton } from '../../buttons/Delete';
import { usePdsStore } from '../../../../store/pds.store';
import { useApplicantStore } from '../../../../store/applicant.store';
import { Reference } from 'apps/job-portal/utils/types/data/supporting-info.type';

// yup validation schema
const schema = yup.object().shape({
  name: yup.string().required('Please enter a name').label('This'),
  address: yup.string().required('Please enter an address').label('This'),
  telephoneNumber: yup
    .string()
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
  const applicant = useApplicantStore((state) => state.applicant);
  const { refError, setRefError, refRef, shake, setShake } =
    useContext(RefErrorContext); // set reference error state, references ref variable from references error context
  const [addRefIsOpen, setAddRefIsOpen] = useState<boolean>(false); // add reference modal state
  const [removeRefIsOpen, setRemoveRefIsOpen] = useState<boolean>(false); // remove reference modal state
  const [refToRemove, setRefToRemove] = useState<number>(-1); // reference to remove state
  const [isBtnRefDisabled, setIsBtnRefDisabled] = useState(true); // button ref
  const [removedReference, setRemovedReference] = useState<Reference>(
    {} as Reference
  );
  const deletedReferences = usePdsStore((state) => state.deletedReferences);
  const setDeletedReferences = usePdsStore(
    (state) => state.setDeletedReferences
  );

  // initialize react hook form and set default values, mode is set to on change
  const {
    register,
    reset,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<Reference>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { _id: '', name: '', address: '', telephoneNumber: '' },
  });

  // fire submit button
  const onSubmit = handleSubmit((ref: Reference, e: any) => {
    e.preventDefault();
    const updatedRef = [...references];
    updatedRef.push(ref);
    setReferences(updatedRef);

    reset();
    setAddRefIsOpen(false);
  });

  // open add modal
  const openModal = () => {
    reset();
    clearErrors();
    setAddRefIsOpen(true);
  };

  // close add modal
  const closeModal = () => {
    reset();
    clearErrors();
    setAddRefIsOpen(false);
  };

  // open remove action modal
  const openRemoveActionModal = (ref: Reference, refIdx: number) => {
    setRemoveRefIsOpen(true);
    setRefToRemove(refIdx);
    setRemovedReference(ref);
  };

  // handle remove title action
  const handleRemoveTitle = (refIdx: number) => {
    const updatedRef = [...references];
    const deleted = [...deletedReferences];
    deleted.push(removedReference);
    setDeletedReferences(deleted);
    updatedRef.splice(refIdx, 1);
    setReferences(updatedRef);
    setRemoveRefIsOpen(false);
  };

  // disable button if length of array is equal to 3
  useEffect(() => {
    references.length < 3
      ? setIsBtnRefDisabled(false)
      : setIsBtnRefDisabled(true);
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
        remarks={
          <Button
            btnLabel={
              references.length < 3
                ? `Add Character Reference`
                : `Cannot Add more`
            }
            variant="theme"
            type="button"
            shadow
            className="sm:w-full lg:w-60"
            onClick={openModal}
            muted={isBtnRefDisabled}
          />
        }
      >
        <>
          {refError ? (
            <div
              className={`${shake && 'animate'} rounded-md bg-red-500`}
              onAnimationEnd={() => setShake(false)}
              tabIndex={1}
              ref={refRef}
            >
              <p className="w-full px-10 not-italic text-center text-white uppercase ">
                Incomplete References
              </p>
            </div>
          ) : (
            <></>
          )}

          <Modal
            title="References"
            subtitle={
              <>
                Indicate the FULL name of references with the format SURNAME,
                FIRST NAME MI, their addresses and respective telephone numbers.{' '}
                <br></br>Please fill-out all required fields ({' '}
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
            actionLabel="Submit"
            cancelLabel="Cancel"
          >
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
                    label="Address"
                    labelIsRequired
                    withHelpButton
                    helpContent="Provide the full address"
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
          </Modal>
          <ModalAction
            isOpen={removeRefIsOpen}
            setIsOpen={setRemoveRefIsOpen}
            action={() => handleRemoveTitle(refToRemove)}
          />
          {references.length === 0 ? (
            <>
              <NoDataVisual />
            </>
          ) : (
            <>
              <Table
                tableHeader={
                  <>
                    <TableHeader
                      label="Full Name"
                      headerWidth="w-[25%]"
                      className="pl-4"
                    />
                    <TableHeader label="Address" headerWidth="w-[35%]" />
                    <TableHeader
                      label="Telephone or Mobile Number"
                      headerWidth="w-[25%]"
                    />
                    <TableHeader
                      label="Actions"
                      headerWidth="w-[15%]"
                      alignment="center"
                    />
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
                              <TableDimension
                                isText={true}
                                label={ref.name}
                                className="pl-4"
                              />
                              <TableDimension
                                isText={true}
                                label={ref.address}
                              />
                              <TableDimension
                                isText={true}
                                label={ref.telephoneNumber}
                              />
                              <TableDimension
                                isText={false}
                                className="px-2 text-center select-none"
                                tableDimension={
                                  <>
                                    <DeleteButton
                                      action={() =>
                                        openRemoveActionModal(ref, refIdx)
                                      }
                                    />
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
