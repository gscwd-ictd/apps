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
import schema from '../../../../schema/Skills';
import { Skill } from '../../../../types/data/other-info.type';
import { SkillsAlert } from './SkillsAlert';
import { Alert } from '../../../../../../../libs/oneui/src/components/Alert';
import { useUpdatePdsStore } from 'store/update-pds.store';
import { isEmpty } from 'lodash';
import { EditButton } from 'components/fixed/buttons/Edit';

export const OISkills = (): JSX.Element => {
  // set skill array, employee object state from pds context
  const skills = usePdsStore((state) => state.skills);
  const skillsOnEdit = usePdsStore((state) => state.skillsOnEdit);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setSkills = usePdsStore((state) => state.setSkills);
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const [addSkillIsOpen, setAddSkillIsOpen] = useState<boolean>(false); // add modal state
  const [removeSkillIsOpen, setRemoveSkillIsOpen] = useState<boolean>(false); // remove skill state
  const [skillToRemove, setSkillToRemove] = useState<number>(-1); // skill to remove state
  const [removedSkill, setRemovedSkill] = useState<Skill>({} as Skill);
  const deletedSkills = useUpdatePdsStore((state) => state.deletedSkills);
  const [action, setAction] = useState<string>('');
  const [skillForEdit, setSkillForEdit] = useState<Skill>({} as Skill);
  const [indexForEdit, setIndexForEdit] = useState<number>(-1);
  const allowAddSkill = useUpdatePdsStore((state) => state.allowAddSkill);
  const allowEditSkill = useUpdatePdsStore((state) => state.allowEditSkill);
  const allowDeleteSkill = useUpdatePdsStore((state) => state.allowDeleteSkill);

  // initialize react hook form and set default values, mode is set to on change
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Skill>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { _id: '', employeeId: employee.employmentDetails.userId, skill: '', isEdited: false },
  });

  const setInitialValues = () => {
    setSkills(initialPdsState.skills);
  };

  // fire submit button
  const onSubmit = handleSubmit((skill: Skill, e: any) => {
    e.preventDefault();
    // create action
    if (action === 'create') {
      const createdSkills = [...skills];
      createdSkills.push(skill);
      setSkills(createdSkills);
      reset();
      setAddSkillIsOpen(false);
    }
    // update action
    else if (action === 'update') {
      const updatedSkills: Array<Skill> = [...skills];
      const newUpdatedSkills = updatedSkills.map((previousSkill: Skill, skillIdx: number) => {
        if (skillIdx === indexForEdit) {
          return { ...previousSkill, _id: skill._id, employeeId: skill.employeeId, skill: skill.skill, isEdited: true };
        }
        return previousSkill;
      });
      setSkills(newUpdatedSkills);
      setSkillForEdit({} as Skill);
      setIndexForEdit(-1);
      reset();
      setAddSkillIsOpen(false);
      setAction('');
      // updatedSkills.push(skill);
    }
  });

  // open add modal
  const openModal = () => {
    setAction('create');
    reset();
    clearErrors();
    setAddSkillIsOpen(true);
  };

  // close add modal
  const closeModal = () => {
    reset();
    setAction('');
    setSkillForEdit({} as Skill);
    clearErrors();
    setAddSkillIsOpen(false);
  };

  // open remove action modal
  const openRemoveActionModal = (skillIdx: number, skill: Skill) => {
    setRemoveSkillIsOpen(true);
    setSkillToRemove(skillIdx);
    setRemovedSkill(skill);
  };

  // when edit button is clicked
  const onEdit = (skill: Skill, index: number) => {
    setAction('update');
    setSkillForEdit(skill);
    loadNewDefaultValues(skill);
    setAddSkillIsOpen(true);
    setIndexForEdit(index);
  };

  // load data on edit
  const loadNewDefaultValues = (skill: Skill) => {
    setValue('_id', skill._id);
    setValue('employeeId', skill.employeeId);
    setValue('skill', skill.skill);
  };

  // handle remove title
  const handleRemoveTitle = (skillIdx: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(skillIdx, 1);
    if (!isEmpty(removedSkill._id)) deletedSkills.push(removedSkill);
    setSkills(updatedSkills);
    setRemoveSkillIsOpen(false);
  };

  return (
    <>
      <Card title="Skills and Hobbies" subtitle="">
        <>
          <div className="flex flex-col items-end justify-end w-full pb-4 -mt-10">
            {allowAddSkill || allowEditSkill || allowDeleteSkill ? <SkillsAlert setInitialValues={setInitialValues} /> : null}
          </div>

          <div
            className={`flex flex-col items-end justify-end pt-6 ${skillsOnEdit ? 'visible  mt-6' : !hasPds ? 'visible -mt-6 pb-6 pr-6' : 'hidden'}`}
          >
            {allowAddSkill ? (
              <Button btnLabel="Add Skill or Hobby" variant="theme" type="button" onClick={openModal} shadow className="sm:w-full md:w-72 lg:w-72" />
            ) : null}
          </div>

          <Modal
            title="Skill and Hobby"
            subtitle={
              <>
                Please fill-out all required fields ( <span className="text-red-700">*</span> )
              </>
            }
            formId="skills"
            isOpen={addSkillIsOpen}
            setIsOpen={setAddSkillIsOpen}
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
                      controller={{ ...register('skill', { required: true }) }}
                      withLabel={true}
                      isError={errors.skill ? true : false}
                      errorMessage={errors.skill?.message}
                    />
                  </div>
                </div>
              </>
            }
          />
          <Alert open={removeSkillIsOpen} setOpen={setRemoveSkillIsOpen}>
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
                <Button variant="light" onClick={() => setRemoveSkillIsOpen(false)} className="hover:bg-gray-200 active:bg-gray-200">
                  No
                </Button>
                <Button variant="theme" onClick={() => handleRemoveTitle(skillToRemove)}>
                  Yes
                </Button>
              </div>
            </Alert.Footer>
          </Alert>

          {skills.length === 0 ? (
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
                    <tbody className="">
                      {skills.map((skill: Skill, skillIdx: number) => {
                        return (
                          <tr
                            key={skillIdx}
                            className="odd:bg-indigo-50 even:bg-slate-50 hover:cursor-default hover:bg-indigo-200 hover:transition-all"
                          >
                            <TableDimension isText={true} label={skill.skill} className="px-28" textSize="lg" />
                            <TableDimension
                              isText={false}
                              className="px-2 text-center select-none"
                              tableDimension={
                                <>
                                  {!isEmpty(skill._id) ? (
                                    <div className="flex justify-center gap-4">
                                      {allowEditSkill ? (
                                        <div className="w-8">
                                          <EditButton
                                            disabled={hasPds && skillsOnEdit ? false : hasPds && !skillsOnEdit ? true : !hasPds && false}
                                            action={() => onEdit(skill, skillIdx)}
                                          />
                                        </div>
                                      ) : null}
                                      {allowDeleteSkill ? (
                                        <div className="w-8">
                                          <DeleteButton
                                            muted={hasPds && skillsOnEdit ? false : hasPds && !skillsOnEdit ? true : !hasPds && false}
                                            action={() => openRemoveActionModal(skillIdx, skill)}
                                          />
                                        </div>
                                      ) : null}
                                      {!allowEditSkill && !allowDeleteSkill ? <div className="flex justify-center w-full">-</div> : null}
                                    </div>
                                  ) : isEmpty(skill._id) ? (
                                    <div className="flex justify-center gap-4">
                                      <div className="w-8">
                                        <EditButton
                                          disabled={hasPds && skillsOnEdit ? false : hasPds && !skillsOnEdit ? true : !hasPds && false}
                                          action={() => onEdit(skill, skillIdx)}
                                        />
                                      </div>
                                      <div className="w-8">
                                        <DeleteButton
                                          muted={hasPds && skillsOnEdit ? false : hasPds && !skillsOnEdit ? true : !hasPds && false}
                                          action={() => openRemoveActionModal(skillIdx, skill)}
                                        />
                                      </div>
                                    </div>
                                  ) : null}
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
