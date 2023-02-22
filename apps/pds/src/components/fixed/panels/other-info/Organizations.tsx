import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../modular/buttons/Button';
import { Card } from '../../../modular/cards/Card';
import { InputReactForm } from '../../../modular/inputs/InputReactForm';
import { Modal } from '../../../modular/modals/Modal';
import { Table, TableDimension, TableHeader } from '../../../modular/tables/Table';
import { NoDataVisual } from '../../visuals/NoDataVisual';
import { yupResolver } from '@hookform/resolvers/yup';
import { DeleteButton } from '../../buttons/Delete';
import { usePdsStore } from '../../../../store/pds.store';
import { useEmployeeStore } from '../../../../store/employee.store';
import schema from '../../../../schema/Organizations';
import { Organization } from '../../../../types/data/other-info.type';
import { OrganizationsAlert } from './OrganizationsAlert';
import { Alert } from '../../../../../../../libs/oneui/src/components/Alert';
import { isEmpty } from 'lodash';
import { useUpdatePdsStore } from 'apps/pds/src/store/update-pds.store';
import { EditButton } from '../../buttons/Edit';

export const OIOrgs = (): JSX.Element => {
  // set organization array, employee object state from pds store
  const organizations = usePdsStore((state) => state.organizations);
  const organizationsOnEdit = usePdsStore((state) => state.organizationsOnEdit);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const setOrganizations = usePdsStore((state) => state.setOrganizations);
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const [addOrgIsOpen, setAddOrgIsOpen] = useState<boolean>(false); // open add modal state
  const [removeOrgIsOpen, setRemoveOrgIsOpen] = useState<boolean>(false); // open remove modal state
  const [orgToRemove, setOrgToRemove] = useState<number>(-1); // organization to remove state
  const [removedOrganization, setRemovedOrganization] = useState<Organization>({} as Organization);
  const deletedOrganizations = useUpdatePdsStore((state) => state.deletedOrganizations);
  const [orgForEdit, setOrgForEdit] = useState<Organization>({} as Organization);
  const [action, setAction] = useState<string>('');
  const [indexForEdit, setIndexForEdit] = useState<number>(-1);
  const allowAddOrganization = useUpdatePdsStore((state) => state.allowAddOrganization);
  const allowEditOrganization = useUpdatePdsStore((state) => state.allowEditOrganization);
  const allowDeleteOrganization = useUpdatePdsStore((state) => state.allowDeleteOrganization);

  // initialize react hook form and set default values, mode is set to on change
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<Organization>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { _id: '', employeeId: employee.employmentDetails.userId, organization: '', isEdited: false },
  });

  // set initial values
  const setInitialValues = () => {
    setOrganizations(initialPdsState.organizations);
  };

  // fire submit button
  const onSubmit = handleSubmit((org: Organization, e: any) => {
    e.preventDefault();
    // create action
    if (action === 'create') {
      const createdOrgs = [...organizations];
      createdOrgs.push(org);
      setOrganizations(createdOrgs);
      reset();
      setAddOrgIsOpen(false);
      setAction('');
    }
    // update action
    else if (action === 'update') {
      const updatedOrgs: Array<Organization> = [...organizations];
      const newUpdatedOrgs = updatedOrgs.map((previousOrg: Organization, orgIdx: number) => {
        if (orgIdx === indexForEdit) {
          return { ...previousOrg, _id: org._id, employeeId: org.employeeId, organization: org.organization, isEdited: true };
        }
        return previousOrg;
      });

      setOrganizations(newUpdatedOrgs);
      setOrgForEdit({} as Organization);
      setIndexForEdit(-1);
      reset();
      setAddOrgIsOpen(false);
      setAction('');
    }
  });

  // open add modal
  const openModal = () => {
    reset();
    setAction('create');
    clearErrors();
    setAddOrgIsOpen(true);
  };

  // close add modal
  const closeModal = () => {
    setAction('');
    setOrgForEdit({} as Organization);
    reset();
    clearErrors();
    setAddOrgIsOpen(false);
  };

  // when edit button is clicked
  const onEdit = (org: Organization, index: number) => {
    setAction('update');
    setOrgForEdit(org);
    loadNewDefaultValues(org); //!
    setAddOrgIsOpen(true);
    setIndexForEdit(index);
  };

  // load state
  const loadNewDefaultValues = (org: Organization) => {
    setValue('_id', org._id);
    setValue('employeeId', org.employeeId);
    setValue('organization', org.organization);
    setValue('isEdited', org.isEdited);
  };

  // open remove action modal
  const openRemoveActionModal = (orgIdx: number, organization: Organization) => {
    setRemoveOrgIsOpen(true);
    setOrgToRemove(orgIdx);
    setRemovedOrganization(organization);
  };

  // handle remove title action
  const handleRemoveTitle = (orgIdx: number) => {
    const updatedOrgs = [...organizations];
    updatedOrgs.splice(orgIdx, 1);
    if (!isEmpty(removedOrganization._id)) deletedOrganizations.push(removedOrganization);
    setOrganizations(updatedOrgs);
    setRemoveOrgIsOpen(false);
  };

  return (
    <>
      <Card title="Memberships in Organizations" subtitle="">
        <>
          <div className="flex flex-col items-end justify-end w-full pb-4 -mt-10">
            {allowEditOrganization || allowDeleteOrganization ? <OrganizationsAlert setInitialValues={setInitialValues} /> : null}
          </div>
          <div
            className={`flex flex-col items-end justify-end pt-6 ${
              organizationsOnEdit ? 'visible  mt-6' : !hasPds ? 'visible -mt-6 pb-6 pr-6' : 'hidden'
            }`}
          >
            {allowAddOrganization ? (
              <Button btnLabel="Add Membership" variant="theme" shadow type="button" className="sm:w-full md:w-72 lg:w-72" onClick={openModal} />
            ) : null}
          </div>

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
            actionLabel={action === 'create' ? 'Submit' : action === 'update' ? 'Update' : ''}
            cancelLabel="Cancel"
            modalChildren={
              <>
                <div className="gap-4 p-5">
                  <div className="w-full mb-6">
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
          <Alert open={removeOrgIsOpen} setOpen={setRemoveOrgIsOpen}>
            <Alert.Description>
              <div className="flex gap-2">
                <div className="w-[25%] text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-20 h-20">
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
                {' '}
                <Button variant="light" onClick={() => setRemoveOrgIsOpen(false)} className="hover:bg-gray-200 active:bg-gray-200">
                  No
                </Button>
                <Button variant="theme" onClick={() => handleRemoveTitle(orgToRemove)}>
                  Yes
                </Button>
              </div>
            </Alert.Footer>
          </Alert>

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
                              className="px-2 text-center select-none"
                              tableDimension={
                                <>
                                  <div className="flex justify-center gap-4">
                                    <div className="w-8">
                                      <EditButton
                                        disabled={hasPds && organizationsOnEdit ? false : hasPds && !organizationsOnEdit ? true : !hasPds && false}
                                        action={() => onEdit(org, orgIdx)}
                                      />
                                    </div>

                                    <div className="w-8">
                                      <DeleteButton
                                        muted={hasPds && organizationsOnEdit ? false : hasPds && !organizationsOnEdit ? true : !hasPds && false}
                                        action={() => openRemoveActionModal(orgIdx, org)}
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
