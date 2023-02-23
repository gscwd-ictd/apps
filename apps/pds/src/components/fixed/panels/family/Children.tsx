import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../modular/buttons/Button';
import { Card } from '../../../modular/cards/Card';
import { InputReactForm } from '../../../modular/inputs/InputReactForm';
import { Modal } from '../../../modular/modals/Modal';
import { Table, TableDimension, TableHeader } from '../../../modular/tables/Table';
import { NoDataVisual } from '../../visuals/NoDataVisual';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { usePdsStore } from '../../../../store/pds.store';
import { useEmployeeStore } from '../../../../store/employee.store';
import { Child } from '../../../../types/data/family.type';
import { Alert } from '../../../../../../../libs/oneui/src/components/Alert';
import { ChildrenAlert } from './ChildrenAlert';
import { DeleteButton } from 'components/fixed/buttons/Delete';
import { useUpdatePdsStore } from 'store/update-pds.store';
import { EditButton } from 'components/fixed/buttons/Edit';
import { isEmpty } from 'lodash';
import { DeleteSVG } from 'components/fixed/svg/Delete';
import { AlertDesc } from 'components/fixed/alerts/AlertDesc';

export const ChildrenInfo = (): JSX.Element => {
  // set children or children array, employee object from pds context
  // const { children, setChildren, employee }: OffspringState = useContext(PDSContext)

  const hasPds = useEmployeeStore((state) => state.hasPds);
  const [action, setAction] = useState<string>('');
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const children = usePdsStore((state) => state.children);
  const [addChildIsOpen, setAddChildIsOpen] = useState<boolean>(false); // set add modal state
  const [removeChildIsOpen, setRemoveChildIsOpen] = useState<boolean>(false); // set remove modal state
  const [childToRemove, setChildToRemove] = useState<number>(-1); // set child to remove state
  const childrenOnEdit = usePdsStore((state) => state.childrenOnEdit);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const deletedChildren = useUpdatePdsStore((state) => state.deletedChildren);
  const [removedChild, setRemovedChild] = useState<Child>({} as Child);
  const [childForEdit, setChildForEdit] = useState<Child>({} as Child);
  const [childIndexForEdit, setChildIndexForEdit] = useState<number>(-1);
  const allowDeleteChildren = useUpdatePdsStore((state) => state.allowDeleteChildren);
  const allowEditChildren = useUpdatePdsStore((state) => state.allowEditChildren);
  const setChildren = usePdsStore((state) => state.setChildren);

  // yup validation schema
  const schema = yup.object({
    childName: yup.string().trim().required('Child name is required'),
    birthDate: yup
      .string()
      .trim()
      .required('Date is required')
      .test('DOB', 'Please choose a valid date of birth', (value) => {
        return dayjs().diff(dayjs(value), 'hours') >= 0;
      }),
  });

  // initialize react hook form and set default values, mode is set to on change
  const {
    reset,
    handleSubmit,
    setValue,
    register,
    clearErrors,
    formState: { errors },
  } = useForm<Child>({
    mode: 'onChange',
    resolver: yupResolver(schema),

    defaultValues: {
      _id: '',
      employeeId: employee.employmentDetails.userId,
      childName: '',
      birthDate: '',
    },
  });

  // fire submit button
  const onSubmit = handleSubmit((child: Child, e: any) => {
    // create
    if (action === 'create') {
      e.preventDefault();
      const newChildren = [...children];
      newChildren.push(child);
      // sort
      const sortedNewChildren = [...newChildren].sort((firstItem, secondItem) =>
        firstItem.birthDate > secondItem.birthDate ? 1 : secondItem.birthDate > firstItem.birthDate ? -1 : 0
      );
      setChildren(sortedNewChildren);
      reset();
      setAction('');
      setAddChildIsOpen(false);
    }
    // update
    else if (action === 'update') {
      e.preventDefault();
      const updatedChildren = [...children];
      const newUpdatedChildren = updatedChildren.map((previousChild: Child, childIdx: number) => {
        if (childIdx === childIndexForEdit) {
          return { ...previousChild, _id: child._id, birthDate: child.birthDate, childName: child.childName, employeeId: child.employeeId };
        }
        return previousChild;
      });

      const sortedUpdatedChildren = [...newUpdatedChildren].sort((firstItem, secondItem) =>
        firstItem.birthDate > secondItem.birthDate ? -1 : secondItem.birthDate > firstItem.birthDate ? 1 : 0
      );
      setChildren(sortedUpdatedChildren);
      setChildForEdit({} as Child);
      setChildIndexForEdit(-1);
      reset();
      setAddChildIsOpen(false);
      setAction('');
    }
  });

  // load data on edit
  const loadNewDefaultValues = (child: Child) => {
    setValue('_id', child._id);
    setValue('birthDate', child.birthDate);
    setValue('childName', child.childName);
    setValue('employeeId', child.employeeId);
  };

  // when edit button is clicked
  const onEdit = (child: Child, index: number) => {
    setAction('update');
    setChildForEdit(child);
    loadNewDefaultValues(child);
    setAddChildIsOpen(true);
    setChildIndexForEdit(index);
  };

  // open add modal
  const openModal = () => {
    setAction('create');
    reset();
    clearErrors;
    setAddChildIsOpen(true);
  };

  // close add modal
  const closeModal = () => {
    setAction('');
    setChildForEdit({} as Child);
    reset();
    clearErrors();
    setAddChildIsOpen(false);
  };

  // open remove modal
  const openRemoveActionModal = (childIdx: number, child: Child) => {
    setRemoveChildIsOpen(true);
    setChildToRemove(childIdx);
    setRemovedChild(child);
  };

  // remove modal action
  const handleRemoveChild = async (childIdx: number) => {
    const updatedOffspring = [...children];
    updatedOffspring.splice(childIdx, 1);
    if (!isEmpty(removedChild._id)) deletedChildren.push(removedChild);
    setChildren(updatedOffspring);
    setRemoveChildIsOpen(false);
  };

  // set to initial values
  const setInitialValues = () => {
    setChildren(initialPdsState.children);
  };

  return (
    <>
      <Card
        title={`Children's Information`}
        subtitle={`List your children's information.`}
        remarks={
          <div className="flex flex-col items-end justify-end w-full">
            <ChildrenAlert setInitialValues={setInitialValues} />
          </div>
        }
      >
        <div className={`flex flex-col items-end justify-end ${childrenOnEdit ? 'visible' : !hasPds ? 'visible lg:-mt-6 lg:pb-6' : 'hidden'}`}>
          <Button btnLabel="Add Children" variant="theme" onClick={openModal} type="button" className="xs:w-full sm:w-full lg:w-56" />
        </div>
        <>
          <Modal
            formId="children"
            title={`Child's Information`}
            subtitle={
              <>
                Please fill-out all required fields ( <span className="text-red-700">*</span> )
              </>
            }
            isOpen={addChildIsOpen}
            setIsOpen={setAddChildIsOpen}
            withCancelBtn
            modalSize="xl"
            isStatic={true}
            action={onSubmit}
            onClose={closeModal}
            actionLabel={action === 'create' ? 'Submit' : action === 'update' ? 'Update' : ''}
            cancelLabel="Cancel"
            verticalCenter
            modalChildren={
              <>
                <div className="gap-4 p-5 mb-5 ">
                  <div className="mb-5">
                    <InputReactForm
                      id="childfullname"
                      name="childfullname"
                      form="children"
                      withLabel={true}
                      label="Full Name"
                      withHelpButton
                      helpContent="First name and surname only."
                      placeholder="First name and surname"
                      type="text"
                      labelIsRequired
                      controller={{ ...register('childName', { required: true }) }}
                      isError={errors.childName && errors.childName.message ? true : false}
                      errorMessage={errors.childName?.message}
                    />
                  </div>

                  <InputReactForm
                    id="childbirthdate"
                    name="birthDate"
                    label="Birthday"
                    className="cursor-pointer"
                    withLabel={true}
                    placeholder=""
                    withHelpButton
                    helpContent="Provide the child's birthdate"
                    type="date"
                    labelIsRequired
                    controller={{ ...register('birthDate', { required: true }) }}
                    isError={errors.birthDate ? true : false}
                    errorMessage={errors.birthDate?.message}
                  />
                </div>
              </>
            }
          />
          <Alert open={removeChildIsOpen} setOpen={setRemoveChildIsOpen}>
            <Alert.Description>
              <AlertDesc>Are you sure you want to delete this?</AlertDesc>
            </Alert.Description>
            <Alert.Footer>
              <div className="flex w-full gap-4">
                <div className="w-full border border-gray-300 rounded">
                  <Button variant="light" onClick={() => setRemoveChildIsOpen(false)} className="hover:bg-gray-300 active:bg-gray-200">
                    No
                  </Button>
                </div>
                <Button variant="danger" onClick={() => handleRemoveChild(childToRemove)}>
                  Yes
                </Button>
              </div>
            </Alert.Footer>
          </Alert>

          {children.length === 0 ? (
            <NoDataVisual />
          ) : (
            <>
              <Table
                tableHeader={
                  <>
                    <TableHeader label="Full Name" headerWidth="w-[45%]" className="select-none pl-14" />
                    <TableHeader label="Birthday" headerWidth="w-[40%]" alignment="left" />
                    <TableHeader label="Actions" headerWidth="w-[15%]" alignment="center" />
                  </>
                }
                tableBody={
                  <tbody>
                    {children.map((child, childIdx) => {
                      const { birthDate, childName, _id } = child;
                      return (
                        <tr key={childIdx} className="odd:bg-indigo-50 even:bg-slate-50 hover:cursor-default hover:bg-indigo-300">
                          <TableDimension
                            isText={false}
                            tableDimension={
                              <>
                                <div className="flex items-center px-2">
                                  <div className="flex-shrink-0 w-10 h-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-auto h-auto pl-1" viewBox="0 0 24 24" fill="indigo">
                                      <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>

                                  <div className="pl-2 text-sm font-normal text-gray-900 break-words select-none max-w-fit ">{childName}</div>
                                </div>
                              </>
                            }
                          />

                          <TableDimension isText={true} label={birthDate} className="text-left select-none " />
                          <TableDimension
                            isText={false}
                            className="px-2 text-center select-none"
                            tableDimension={
                              <>
                                {!isEmpty(child._id) ? (
                                  <>
                                    <div className="flex justify-center gap-4 ">
                                      {allowEditChildren ? (
                                        <div className="w-8">
                                          <EditButton
                                            action={() => onEdit(child, childIdx)}
                                            disabled={hasPds && childrenOnEdit ? false : hasPds && !childrenOnEdit ? true : !hasPds && false}
                                          />
                                        </div>
                                      ) : null}
                                      {allowDeleteChildren ? (
                                        <div className="w-8">
                                          <DeleteButton
                                            action={() => openRemoveActionModal(childIdx, child)}
                                            muted={hasPds && childrenOnEdit ? false : hasPds && !childrenOnEdit ? true : !hasPds && false}
                                          />
                                        </div>
                                      ) : null}

                                      {!allowEditChildren && !allowDeleteChildren ? <div className="flex justify-center w-full">-</div> : null}
                                    </div>
                                  </>
                                ) : isEmpty(child._id) ? (
                                  <>
                                    <div className="flex justify-center gap-4 ">
                                      <div className="w-8">
                                        <EditButton
                                          action={() => onEdit(child, childIdx)}
                                          disabled={hasPds && childrenOnEdit ? false : hasPds && !childrenOnEdit ? true : !hasPds && false}
                                        />
                                      </div>

                                      <div className="w-8">
                                        <DeleteButton
                                          action={() => openRemoveActionModal(childIdx, child)}
                                          muted={hasPds && childrenOnEdit ? false : hasPds && !childrenOnEdit ? true : !hasPds && false}
                                        />
                                      </div>
                                    </div>
                                  </>
                                ) : null}
                              </>
                            }
                          />
                        </tr>
                      );
                    })}
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
