import { useState } from 'react';
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
import { ModalAction } from '../../modals/Action';
import { DeleteButton } from '../../buttons/Delete';
import { usePdsStore } from '../../../../store/pds.store';
import schema from '../../../../schema/Skills';
import { useApplicantStore } from '../../../../store/applicant.store';
import { Skill } from 'apps/job-portal/utils/types/data/other-info.type';

export const OISkills = (): JSX.Element => {
  // set skill array, employee object state from pds context
  const skills = usePdsStore((state) => state.skills);
  const setSkills = usePdsStore((state) => state.setSkills);
  const applicant = useApplicantStore((state) => state.applicant);
  const [addSkillIsOpen, setAddSkillIsOpen] = useState<boolean>(false); // add modal state
  const [removeSkillIsOpen, setRemoveSkillIsOpen] = useState<boolean>(false); // remove skill state
  const [skillToRemove, setSkillToRemove] = useState<number>(-1); // skill to remove state
  const [removedSkill, setRemovedSkill] = useState<Skill>({} as Skill);
  const deletedSkills = usePdsStore((state) => state.deletedSkills);
  const setDeletedSkills = usePdsStore((state) => state.setDeletedSkills);

  // initialize react hook form and set default values, mode is set to on change
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<Skill>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { _id: '', skill: '' },
  });

  // fire submit button
  const onSubmit = handleSubmit((skill: Skill, e: any) => {
    e.preventDefault();
    const updatedSkills = [...skills];
    updatedSkills.push(skill);
    setSkills(updatedSkills);
    reset();
    setAddSkillIsOpen(false);
  });

  // open add modal
  const openModal = () => {
    reset();
    clearErrors();
    setAddSkillIsOpen(true);
  };

  // close add modal
  const closeModal = () => {
    reset();
    clearErrors();
    setAddSkillIsOpen(false);
  };

  // open remove action modal
  const openRemoveActionModal = (skill: Skill, skillIdx: number) => {
    setRemoveSkillIsOpen(true);
    setSkillToRemove(skillIdx);
    setRemovedSkill(skill);
  };

  // handle remove title
  const handleRemoveTitle = (skillIdx: number) => {
    const updatedSkills = [...skills];
    const deleted = [...deletedSkills];
    deleted.push(removedSkill);
    setDeletedSkills(deleted);
    updatedSkills.splice(skillIdx, 1);
    setSkills(updatedSkills);
    setRemoveSkillIsOpen(false);
  };

  return (
    <>
      <Card
        title="Skills and Hobbies"
        subtitle=""
        remarks={
          <Button
            btnLabel="Add Skill or Hobby"
            variant="theme"
            type="button"
            onClick={openModal}
            shadow
            className="sm:w-full md:w-72 lg:w-72"
          />
        }
      >
        <>
          <Modal
            title="Skill and Hobby"
            subtitle={
              <>
                Please fill-out all required fields ({' '}
                <span className="text-red-700">*</span> )
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
            actionLabel="Submit"
            cancelLabel="Cancel"
          >
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
          </Modal>
          <ModalAction
            isOpen={removeSkillIsOpen}
            setIsOpen={setRemoveSkillIsOpen}
            action={() => handleRemoveTitle(skillToRemove)}
          />
          {skills.length === 0 ? (
            <>
              <NoDataVisual />
            </>
          ) : (
            <>
              <Table
                tableHeader={
                  <>
                    <TableHeader
                      label="Title"
                      headerWidth="w-[85%]"
                      className="px-28"
                      textSize="sm"
                    />
                    <TableHeader
                      label="Actions"
                      headerWidth="w-[15%]"
                      textSize="sm"
                      alignment="center"
                    />
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
                            <TableDimension
                              isText={true}
                              label={skill.skill}
                              className="px-28"
                              textSize="lg"
                            />
                            <TableDimension
                              isText={false}
                              className="px-2 text-center select-none"
                              tableDimension={
                                <>
                                  <DeleteButton
                                    action={() =>
                                      openRemoveActionModal(skill, skillIdx)
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
