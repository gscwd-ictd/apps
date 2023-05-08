import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../../modular/buttons/Button'
import { Card } from '../../../modular/cards/Card'
import { InputReactForm } from '../../../modular/inputs/InputReactForm'
import { Modal } from '../../../modular/modals/Modal'
import { Table, TableDimension, TableHeader } from '../../../modular/tables/Table'
import { NoDataVisual } from '../../visuals/NoDataVisual'
import { yupResolver } from '@hookform/resolvers/yup'
import { ModalAction } from '../../modals/Action'
import { DeleteButton } from '../../buttons/Delete'
import { usePdsStore } from '../../../../store/pds.store'
import { useEmployeeStore } from '../../../../store/employee.store'
import schema from '../../../../schema/Organizations'
import { Organization } from '../../../../types/data/other-info.type'
import { useApplicantStore } from '../../../../store/applicant.store'

export const OIOrgs = (): JSX.Element => {
  // set organization array, employee object state from pds store
  const organizations = usePdsStore((state) => state.organizations)
  const setOrganizations = usePdsStore((state) => state.setOrganizations)
  const applicant = useApplicantStore((state) => state.applicant)
  const [addOrgIsOpen, setAddOrgIsOpen] = useState<boolean>(false) // open add modal state
  const [removeOrgIsOpen, setRemoveOrgIsOpen] = useState<boolean>(false) // open remove modal state
  const [orgToRemove, setOrgToRemove] = useState<number>(-1) // organization to remove state
  const [removedOrganizations, setRemovedOrganizations] = useState<Organization>({} as Organization)
  const deletedOrganizations = usePdsStore((state) => state.deletedOrganizations)
  const setDeletedOrganizations = usePdsStore((state) => state.setDeletedOrganizations)

  // initialize react hook form and set default values, mode is set to on change
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<Organization>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { _id: '', organization: '' },
  })

  // fire submit button
  const onSubmit = handleSubmit((org: Organization, e: any) => {
    e.preventDefault()
    const updatedOrgs = [...organizations]
    updatedOrgs.push(org)
    setOrganizations(updatedOrgs)
    reset()
    setAddOrgIsOpen(false)
  })

  // open add modal
  const openModal = () => {
    reset()
    clearErrors()
    setAddOrgIsOpen(true)
  }

  // close add modal
  const closeModal = () => {
    reset()
    clearErrors()
    setAddOrgIsOpen(false)
  }

  // open remove action modal
  const openRemoveActionModal = (org: Organization, orgIdx: number) => {
    setRemoveOrgIsOpen(true)
    setOrgToRemove(orgIdx)
    setRemovedOrganizations(org)
  }

  // handle remove title action
  const handleRemoveTitle = (orgIdx: number) => {
    const updatedOrgs = [...organizations]
    const deleted = [...deletedOrganizations]
    deleted.push(removedOrganizations)
    setDeletedOrganizations(deleted)
    updatedOrgs.splice(orgIdx, 1)
    setOrganizations(updatedOrgs)
    setRemoveOrgIsOpen(false)
  }

  return (
    <>
      <Card
        title="Memberships in Organizations"
        subtitle=""
        remarks={
          <Button
            btnLabel="Add Membership"
            variant="theme"
            shadow
            type="button"
            className="sm:w-full md:w-72 lg:w-72"
            onClick={openModal}
          />
        }
        children={
          <>
            <Modal
              title="Membership in Organization"
              subtitle={
                <>
                  Please fill-out all required fields ( <span className="text-red-700">*</span> )
                </>
              }
              formId="organizations"
              isOpen={addOrgIsOpen}
              setIsOpen={setAddOrgIsOpen}
              action={onSubmit}
              onClose={closeModal}
              withCancelBtn
              isStatic={true}
              verticalCenter
              modalSize="lg"
              actionLabel="Submit"
              cancelLabel="Cancel"
              children={
                <>
                  <div className="gap-4 p-5">
                    <div className="mb-6 w-full">
                      <InputReactForm
                        id="skilltitle"
                        name="skilltitle"
                        label="Title"
                        labelIsRequired
                        placeholder="Write in Full"
                        type="text"
                        controller={{ ...register('organization', { required: true }) }}
                        withLabel={true}
                        isError={errors.organization ? true : false}
                        errorMessage={errors.organization?.message}
                      />
                    </div>
                  </div>
                </>
              }
            />
            <ModalAction isOpen={removeOrgIsOpen} setIsOpen={setRemoveOrgIsOpen} action={() => handleRemoveTitle(orgToRemove)} />
            {organizations.length === 0 ? (
              <>
                <NoDataVisual />
              </>
            ) : (
              <>
                <Table
                  tableHeader={
                    <>
                      <TableHeader label="Title" headerWidth="w-[85%]" className="px-28" textSize="sm" />
                      <TableHeader label="Actions" headerWidth="w-[15%]" textSize="sm" alignment="center" />
                    </>
                  }
                  tableBody={
                    <>
                      <tbody>
                        {organizations.map((org: Organization, orgIdx: number) => {
                          return (
                            <tr
                              key={orgIdx}
                              className="odd:bg-indigo-50 even:bg-slate-50 hover:cursor-default hover:bg-indigo-200 hover:transition-all"
                            >
                              <TableDimension isText={true} label={org.organization} className="px-28" textSize="lg" />
                              <TableDimension
                                isText={false}
                                className="select-none px-2 text-center"
                                tableDimension={
                                  <>
                                    <DeleteButton action={() => openRemoveActionModal(org, orgIdx)} />
                                  </>
                                }
                              />
                            </tr>
                          )
                        })}
                      </tbody>
                    </>
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
