/* eslint-disable @nx/enforce-module-boundaries */
import 'react-toastify/dist/ReactToastify.css';
import { WorkExperiencePds } from '../../../../src/types/workexp.type';
import { NumericFormat } from 'react-number-format';
import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Modal, TextField } from '@gscwd-apps/oneui';
import { useWorkExpStore } from '../../../../src/store/workexperience.store';
import { HiPencil, HiPlus, HiTrash, HiX } from 'react-icons/hi';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { values } from 'lodash';

export const VacancyWorkExperience = (props: { data: WorkExperiencePds }): JSX.Element => {
  const [indexForEdit, setIndexForEdit] = useState<number>(-1);
  const [otherDetailsIndex, setOtherDetailsIndex] = useState<string[]>([]);
  const [accomplishmentInput, setAccomplishmentInput] = useState<string>('');
  const [dutyInput, setDutyInput] = useState<string>('');
  const workExperienceArray = useWorkExpStore((state) => state.workExperience);
  const withRelevantExperience = useWorkExpStore((state) => state.withRelevantExperience);
  const setWithRelevantExperience = useWorkExpStore((state) => state.setWithRelevantExperience);
  const addExperience = useWorkExpStore((state) => state.addWorkExperience);
  const addAccomplishment = useWorkExpStore((state) => state.addAccomplishment);
  const deleteAccomplishment = useWorkExpStore((state) => state.deleteAccomplishment);
  const deleteDuty = useWorkExpStore((state) => state.deleteDuty);
  const addDuty = useWorkExpStore((state) => state.addDuty);
  const removeExperience = useWorkExpStore((state) => state.removeWorkExperience);
  const editAccomplishment = useWorkExpStore((state) => state.editAccomplishment);
  const editDuty = useWorkExpStore((state) => state.editDuty);

  const inputSupervisor = useWorkExpStore((state) => state.inputSupervisor);
  const inputOffice = useWorkExpStore((state) => state.inputOffice);

  const inputImmediateSupervisor = (e: ChangeEvent<HTMLInputElement>, expId: string) => {
    inputSupervisor(e.target.value.trimStart(), expId);
  };

  const inputOfficeUnit = (e: ChangeEvent<HTMLInputElement>, expId: string) => {
    inputOffice(e.target.value.trimStart(), expId);
  };

  const handleAccomplishmentInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAccomplishmentInput(e.target.value.trim());
  };

  const handleDutyInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDutyInput(e.target.value.trim());
  };

  const handleAddAccomplishment = (expId: string, accomplishment: string) => {
    // setErrorAccomplishment(null);

    setTimeout(() => {
      if (accomplishment == '' || accomplishment.trim().length == 0) {
        // setErrorAccomplishment('Please fill out accomplishment field!');
      } else {
        addAccomplishment(expId, accomplishment);
        modalCancel();
      }
    }, 100);
  };

  const handleAddDuty = (duty: string, expId: string) => {
    // setErrorDuty(null);

    setTimeout(() => {
      if (duty == '' || duty.trim().length == 0) {
        // setErrorDuty('Please fill out duty field!');
      } else {
        addDuty(duty, expId);
        modalCancel();
      }
    }, 100);
  };

  const handleRemoveAccomplishment = (expId: string, indexForDelete: number) => {
    deleteAccomplishment(expId, indexForDelete);
  };

  const handleRemoveDuty = (expId: string, indexForDelete: number) => {
    deleteDuty(expId, indexForDelete);
  };

  const handleEditAccomplishment = (expId: string, indexForEdit: number) => {
    // setErrorAccomplishment(null);
    setTimeout(() => {
      if (accomplishmentInput === '' || accomplishmentInput.trim().length == 0) {
        // setErrorAccomplishment('Please fill out accomplishment field!');
      } else {
        editAccomplishment(expId, indexForEdit, accomplishmentInput);
        modalCancel();
      }
    }, 100);
  };

  const handleEditDuty = (expId: string, indexForEdit: number) => {
    // setErrorDuty(null);
    setTimeout(() => {
      if (dutyInput == '' || dutyInput.trim().length == 0) {
        // setErrorDuty('Please fill out duty field!');
      } else {
        editDuty(expId, indexForEdit, dutyInput);
        modalCancel();
      }
    }, 100);
  };

  // const addWorkExperience = (Idx: number, expId: string, e: unknown) => {
  //   //show additional work exp data based on Idx (.map)
  //   if (otherDetailsIndex.includes(Idx)) {
  //     const newOtherDetails = otherDetailsIndex.filter((index) => index !== Idx);
  //     setOtherDetailsIndex(newOtherDetails);
  //     removeExperience(expId);
  //   } else {
  //     setOtherDetailsIndex((otherDetailsIndex) => [...otherDetailsIndex, Idx]); //add Idx to array
  //     addExperience({
  //       basic: {
  //         workExperienceId: expId,
  //         office: '',
  //         supervisor: '',
  //       },
  //       duties: [],
  //       accomplishments: [],
  //     });
  //   }
  // };

  const addWorkExperience = (Idx: number, expId: string, e: unknown) => {
    //show additional work exp data based on expId
    if (otherDetailsIndex.includes(expId)) {
      const newOtherDetails = otherDetailsIndex.filter((value) => value !== expId);
      setOtherDetailsIndex(newOtherDetails);
      removeExperience(expId);
    } else {
      setOtherDetailsIndex((otherDetailsIndex) => [...otherDetailsIndex, expId]); //add Idx to array
      addExperience({
        basic: {
          workExperienceId: expId,
          office: '',
          supervisor: '',
        },
        duties: [],
        accomplishments: [],
      });
    }
  };

  useEffect(() => {
    if (workExperienceArray.length >= 1) {
      setWithRelevantExperience(true);
    } else {
      setWithRelevantExperience(false);
    }
  }, [withRelevantExperience, workExperienceArray, setWithRelevantExperience]);

  // set state for handling modal page
  const [modal, setModal] = useState({
    isOpen: false,
    page: 1,
    title: '',
    subtitle: '',
    id: '',
    content: '',
  });

  // cancel action for modal
  const modalCancel = async () => {
    setModal({ ...modal, isOpen: false });
  };

  const openModal = (
    title: string,
    subtitle: string,
    id: string,
    content: string,
    index: number,
    pageNumber: number
  ) => {
    // open the modal
    if (pageNumber === 1) {
      setAccomplishmentInput(content);
    } else {
      setDutyInput(content);
    }

    setIndexForEdit(index);
    setModal({
      ...modal,
      title: title,
      subtitle: subtitle,
      isOpen: true,
      id: id,
      content: content,
      page: pageNumber,
    });
  };

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal size={`${windowWidth > 768 ? 'lg' : 'full'}`} open={modal.isOpen} setOpen={() => setModal({ ...modal })}>
        <Modal.Header>
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <label className="font-semibold text-xl text-gray-700">{modal.title}</label>
              <label className="text-sm text-gray-700">{modal.subtitle}:</label>
            </div>

            <button className="hover:bg-slate-100 px-1 h-8 text-2xl rounded-full" onClick={modalCancel}>
              <HiX />
            </button>
          </div>
        </Modal.Header>

        <Modal.Body>
          {modal.page === 1 ? (
            <textarea
              onChange={(e) => handleAccomplishmentInput(e)}
              autoFocus
              className="w-full h-52 resize-none"
              defaultValue={modal.content}
            ></textarea>
          ) : (
            <textarea
              onChange={(e) => handleDutyInput(e)}
              autoFocus
              className="w-full h-52 resize-none"
              defaultValue={modal.content}
            ></textarea>
          )}
        </Modal.Body>

        <Modal.Footer>
          <div className="w-full flex items-center justify-end px-4">
            {modal.title === 'Accomplishments' ? (
              <Button
                onClick={(e) => handleAddAccomplishment(modal.id, accomplishmentInput)}
                disabled={accomplishmentInput ? false : true}
              >
                Add Accomplishment
              </Button>
            ) : modal.title === 'Edit Accomplishments' ? (
              <Button
                onClick={(e) => handleEditAccomplishment(modal.id, indexForEdit)}
                disabled={accomplishmentInput ? false : true}
              >
                Edit Accomplishment
              </Button>
            ) : modal.title === 'Duties' ? (
              <Button onClick={(e) => handleAddDuty(dutyInput, modal.id)} disabled={dutyInput ? false : true}>
                Add Duty
              </Button>
            ) : (
              <Button onClick={(e) => handleEditDuty(modal.id, indexForEdit)} disabled={dutyInput ? false : true}>
                Edit Duty
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
      <div className="mx-2 text-sm">
        Please check a work experience that is related to the position you are applying for and fill up the necessary
        fields.
      </div>
      {props.data && props.data.length > 0 ? (
        props.data.map((exp, Idx) => {
          return (
            <div key={Idx}>
              <div className="text-sm bg-slate-100 py-4 px-2 m-2 rounded-xl text-gray-800 hover:bg-slate-200 flex flex-col ">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="px-2">
                      <label className="font-semibold">Position Title: </label>
                      {exp.positionTitle}
                    </div>
                    <div className="px-2">
                      <label className="font-semibold">Company: </label>
                      {exp.companyName}
                    </div>
                  </div>

                  <input
                    className="mx-2 h-5 w-5"
                    onClick={(e) => addWorkExperience(Idx, exp._id, e)}
                    type="checkbox"
                  ></input>
                </div>

                <div className={`${otherDetailsIndex.includes(exp._id) ? 'mx-2' : 'hidden'}`}>
                  <div>
                    <label className="font-semibold">Date: </label>
                    {exp.from} - {exp.to ? exp.to : 'PRESENT'}
                  </div>
                  <div>
                    <label className="font-semibold">Monthly Salary: </label>

                    <NumericFormat
                      value={exp.monthlySalary}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={'P'}
                    />
                  </div>
                  <div>
                    <label className="font-semibold">Government Service: </label>
                    {exp.isGovernmentService ? 'Yes' : 'No'}
                  </div>
                  <table className="w-full mt-2">
                    <tbody>
                      <tr>
                        <td className="w-1/4">
                          <span className="font-semibold">Immediate Supervisor:</span>
                        </td>
                        <td>
                          <TextField
                            onChange={(e) => inputImmediateSupervisor(e, exp._id)}
                            className="w-full"
                            value={
                              otherDetailsIndex.includes(exp._id)
                                ? workExperienceArray.filter((value) => value.basic.workExperienceId === exp._id)[0]
                                    ?.basic.supervisor
                                : ''
                            }
                            // value={otherDetailsIndex.includes(exp._id) ? workExperienceArray[Idx]?.basic.supervisor : ''}
                            required={otherDetailsIndex.includes(exp._id) ? true : false}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="w-1/4">
                          <span className="font-semibold">Name of Office/Unit:</span>
                        </td>
                        <td className="pb-1">
                          <TextField
                            onChange={(e) => inputOfficeUnit(e, exp._id)}
                            className="w-full"
                            // value={otherDetailsIndex.includes(exp._id) ? workExperienceArray[Idx]?.basic.office : ''}

                            value={
                              otherDetailsIndex.includes(exp._id)
                                ? workExperienceArray.filter((value) => value.basic.workExperienceId === exp._id)[0]
                                    ?.basic.office
                                : ''
                            }
                            required={otherDetailsIndex.includes(exp._id) ? true : false}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <div className="flex gap-2 items-center py-1">
                            <span className="font-semibold">Accomplishments:</span>
                            <button
                              className="h-6 w-6 flex justify-center items-center bg-green-500 hover:bg-greenindigo-600 rounded text-white"
                              onClick={(e) =>
                                openModal(
                                  'Accomplishments',
                                  'Enter an accomplishment you attained for this position',
                                  exp._id,
                                  '',
                                  0,
                                  1
                                )
                              }
                            >
                              <HiPlus className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={2}>
                          <div className="bg-white rounded-md">
                            {exp._id &&
                              workExperienceArray.map((accomplishment, Idx) => {
                                return (
                                  <div key={Idx} className="flex flex-col gap-1">
                                    {accomplishment?.basic.workExperienceId === exp._id
                                      ? accomplishment.accomplishments.map((a, index) => {
                                          return (
                                            <div
                                              key={index}
                                              className="flex justify-between items-center gap-2 px-2 py-1"
                                            >
                                              <span>
                                                {index + 1}. {a?.accomplishment}
                                              </span>
                                              <div className="flex flex-row gap-1">
                                                {/* EDIT ACCOMPLISHMENT */}
                                                <button
                                                  onClick={(e) =>
                                                    openModal(
                                                      'Edit Accomplishments',
                                                      'Enter an accomplishment you attained for this position',
                                                      exp._id,
                                                      a.accomplishment,
                                                      index,
                                                      1
                                                    )
                                                  }
                                                  className="h-6 w-6 flex justify-center items-center bg-indigo-500 hover:bg-indigo-600 rounded text-white"
                                                >
                                                  <HiPencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                  onClick={(e) => handleRemoveAccomplishment(exp._id, index)}
                                                  className="h-6 w-6 flex justify-center items-center bg-rose-600 hover:bg-rose-700 rounded text-white"
                                                >
                                                  <HiTrash className="w-4 h-4" />
                                                </button>
                                              </div>
                                            </div>
                                          );
                                        })
                                      : ''}
                                  </div>
                                );
                              })}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <div className="flex gap-2 items-center py-1">
                            <span className="font-semibold">Duties:</span>
                            <button
                              className="h-6 w-6 flex justify-center items-center bg-green-500 hover:bg-green-600 rounded text-white"
                              onClick={(e) =>
                                openModal('Duties', 'Enter an assigned duty for this position', exp._id, '', 0, 2)
                              }
                            >
                              <HiPlus className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={2}>
                          <div className="bg-white rounded-md">
                            {exp._id &&
                              workExperienceArray.map((duty, Idx) => {
                                return (
                                  <div key={Idx} className="flex flex-col gap-1">
                                    {duty?.basic.workExperienceId === exp._id
                                      ? duty.duties.map((d, index) => {
                                          return (
                                            <div
                                              key={index}
                                              className="flex justify-between items-center gap-2 px-2 py-1"
                                            >
                                              <span key={index}>
                                                {index + 1}. {d?.duty}
                                              </span>
                                              <div className="flex flex-row gap-1">
                                                <button
                                                  onClick={(e) =>
                                                    openModal(
                                                      'Edit Duty',
                                                      'Enter an assigned duty for this position',
                                                      exp._id,
                                                      d.duty,
                                                      index,
                                                      2
                                                    )
                                                  }
                                                  className="h-6 w-6 flex justify-center items-center bg-indigo-500 hover:bg-indigo-600 rounded text-white"
                                                >
                                                  <HiPencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                  onClick={(e) => handleRemoveDuty(exp._id, index)}
                                                  className="h-6 w-6 flex justify-center items-center bg-rose-600 hover:bg-rose-700 rounded text-white"
                                                >
                                                  <HiTrash className="w-4 h-4" />
                                                </button>
                                              </div>
                                            </div>
                                          );
                                        })
                                      : ''}
                                  </div>
                                );
                              })}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <label className="text-4xl opacity-50 w-full text-center pt-40 pb-40">NO WORK EXPERIENCE FOUND</label>
        </div>
      )}
    </>
  );
};
