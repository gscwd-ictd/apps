import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../../modular/buttons/Button'
import { Card } from '../../../modular/cards/Card'
import { InputReactForm } from '../../../modular/inputs/InputReactForm'
import { Modal } from '../../../modular/modals/Modal'
import { Table, TableDimension, TableHeader } from '../../../modular/tables/Table'
import { NoDataVisual } from '../../visuals/NoDataVisual'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ModalAction } from '../../modals/Action'
import dayjs from 'dayjs'
import { usePdsStore } from '../../../../store/pds.store'
import { useEmployeeStore } from '../../../../store/employee.store'
import { Child } from '../../../../types/data/family.type'
import { useApplicantStore } from '../../../../store/applicant.store'
import { DeleteButton } from '../../buttons/Delete'

export const ChildrenInfo = (): JSX.Element => {
  // set children or children array, employee object from pds context
  // const { children, setChildren, employee }: OffspringState = useContext(PDSContext)

  const { children, setChildren } = usePdsStore((state) => ({ children: state.children, setChildren: state.setChildren }))

  const applicant = useApplicantStore((state) => state.applicant)

  // set add modal state
  const [addChildIsOpen, setAddChildIsOpen] = useState(false)

  // set remove modal state
  const [removeChildIsOpen, setRemoveChildIsOpen] = useState(false)

  // set child to remove state
  const [childToRemove, setChildToRemove] = useState<number>(-1)

  // set removed Child
  const [removedChild, setRemovedChild] = useState<Child>({} as Child)

  // get removed children
  const deletedChildren = usePdsStore((state) => state.deletedChildren)

  // set deletedChildren
  const setDeletedChildren = usePdsStore((state) => state.setDeletedChildren)

  // yup validation schema
  const schema = yup.object({
    childName: yup.string().trim().required('Child name is required'),
    birthDate: yup
      .string()
      .trim()
      .required('Date is required')
      .test('DOB', 'Please choose a valid date of birth', (value) => {
        return dayjs().diff(dayjs(value), 'hours') >= 0
      }),
  })

  // initialize react hook form and set default values, mode is set to on change
  const {
    reset,
    handleSubmit,
    register,
    clearErrors,
    formState: { errors },
  } = useForm<Child>({
    mode: 'onChange',
    resolver: yupResolver(schema),

    defaultValues: {
      _id: '',
      childName: '',
      birthDate: '',
    },
  })

  // fire submit button
  const onSubmit = handleSubmit((child: Child, e: any) => {
    e.preventDefault()
    const updatedOffspring = [...children]
    updatedOffspring.push(child)

    // sort
    const sortedUpdatedOffspring = [...updatedOffspring].sort((firstItem, secondItem) =>
      firstItem.birthDate > secondItem.birthDate ? 1 : secondItem.birthDate > firstItem.birthDate ? -1 : 0
    )
    setChildren(sortedUpdatedOffspring)
    reset()
    setAddChildIsOpen(false)
  })

  // open add modal
  const openModal = () => {
    reset()
    clearErrors
    setAddChildIsOpen(true)
  }

  // close add modal
  const closeModal = () => {
    reset()
    clearErrors()
    setAddChildIsOpen(false)
  }

  // open remove modal
  const openRemoveActionModal = (child: Child, childIdx: number) => {
    setRemoveChildIsOpen(true)
    setChildToRemove(childIdx)
    setRemovedChild(child)
  }

  // remove modal action
  const handleRemoveChild = async (childIdx: number) => {
    let deleted: Array<Child> = [...deletedChildren]
    const updatedOffspring = [...children]
    updatedOffspring.splice(childIdx, 1)
    deleted.push(removedChild)
    setDeletedChildren(deleted)
    setChildren(updatedOffspring)
    setRemoveChildIsOpen(false)
  }

  return (
    <>
      <Card
        title={`Children's Information`}
        subtitle={`List your children's information.`}
        remarks={
          <Button
            btnLabel="Add Children"
            variant="theme"
            onClick={openModal}
            shadow
            type="button"
            className="xs:w-full sm:w-full lg:w-56"
          />
        }
        children={
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
              actionLabel="Submit"
              cancelLabel="Cancel"
              verticalCenter
              children={
                <>
                  <div className="mb-5 gap-4 p-5 ">
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
            <ModalAction
              isOpen={removeChildIsOpen}
              setIsOpen={setRemoveChildIsOpen}
              verticalCenter={true}
              action={() => handleRemoveChild(childToRemove)}
            />
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
                        const { birthDate, childName } = child
                        return (
                          <tr key={childIdx} className="odd:bg-indigo-50 even:bg-slate-50 hover:cursor-default hover:bg-indigo-300">
                            <TableDimension
                              isText={false}
                              tableDimension={
                                <>
                                  <div className="flex items-center px-2">
                                    <div className="h-10 w-10 flex-shrink-0">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-auto w-auto pl-1"
                                        viewBox="0 0 24 24"
                                        fill="indigo"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>

                                    <div className="max-w-fit select-none break-words pl-2 text-sm font-normal text-gray-900 ">
                                      {childName}
                                    </div>
                                  </div>
                                </>
                              }
                            />

                            <TableDimension isText={true} label={birthDate} className="select-none text-left " />
                            <TableDimension
                              isText={false}
                              className="select-none px-2 text-center"
                              tableDimension={
                                <>
                                  <DeleteButton action={() => openRemoveActionModal(child, childIdx)} />
                                </>
                              }
                            />
                          </tr>
                        )
                      })}
                    </tbody>
                  }
                />
              </>
            )}
          </>
        }
      />
    </>
  )
}
