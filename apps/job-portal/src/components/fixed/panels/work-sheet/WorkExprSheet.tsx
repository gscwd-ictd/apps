import { Alert, Modal } from '@gscwd-apps/oneui';
import { WorkExperience } from 'apps/job-portal/utils/types/data/work.type';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { HiInformationCircle } from 'react-icons/hi';
import { useWorkExpSheetStore, WorkExperienceSheet } from '../../../../store/work-experience-sheet.store';
import { Button } from '../../../modular/buttons/Button';
import { CardContainer } from '../../../modular/cards/CardContainer';
import { ModalController } from '../../../modular/modals/ModalController';
import { LabelBox } from '../../visuals/LabelBox';

type WorkExprSheetProps = {
  workExperiences: Array<WorkExperience>;
};

export const WorkExprSheet = (): JSX.Element => {
  // set state for handling modal page
  const [tab, setTab] = useState<number>(0);
  const [modal, setModal] = useState({ isOpen: false, page: 1 });
  const selectedWorkExperience = useWorkExpSheetStore((state) => state.selectedWorkExperience);
  const workExperiencesSheet = useWorkExpSheetStore((state) => state.workExperiencesSheet);
  const workExperiences = useWorkExpSheetStore((state) => state.workExperiences);
  const setWorkExperiences = useWorkExpSheetStore((state) => state.setWorkExperiences);
  const setSelectedWorkExperience = useWorkExpSheetStore((state) => state.setSelectedWorkExperience);
  const setWorkExperiencesSheet = useWorkExpSheetStore((state) => state.setWorkExperiencesSheet);
  const setDuties = useWorkExpSheetStore((state) => state.setDuties);
  const setAccomplishments = useWorkExpSheetStore((state) => state.setAccomplishments);
  const [alertIsOpen, setAlertIsOpen] = useState<boolean>(false);
  const [alertFailIsOpen, setAlertFailIsOpen] = useState<boolean>(false);
  const noWorkExperience = useWorkExpSheetStore((state) => state.noWorkExperience);

  const methods = useForm<WorkExperienceSheet>();

  // set function for action
  const modalAction: SubmitHandler<any> = (data: any, e: any) => {
    e.preventDefault();
    if (modal.page === 1 && !isEmpty(selectedWorkExperience)) setModal({ ...modal, page: 2 });
    else if (
      modal.page === 2 &&
      !isEmpty(selectedWorkExperience.supervisor) &&
      !isEmpty(selectedWorkExperience.office) &&
      !isEmpty(selectedWorkExperience.accomplishments)
    ) {
      setAlertIsOpen(true);
    } else if (
      (modal.page === 2 && isEmpty(selectedWorkExperience.supervisor)) ||
      isEmpty(selectedWorkExperience.office) ||
      isEmpty(selectedWorkExperience.accomplishments)
    ) {
      setAlertFailIsOpen(true);
    }
  };

  const alertAction = () => {
    const addedWorkExperiences: Array<WorkExperienceSheet> = [...workExperiencesSheet];
    const tempWorkExperiences = [...workExperiences];
    setSelectedWorkExperience({
      ...selectedWorkExperience,
      isSelected: true,
    });

    tempWorkExperiences.map((workExp: WorkExperienceSheet) => {
      if (workExp._id === selectedWorkExperience._id) {
        workExp.duties = selectedWorkExperience.duties;
        workExp.accomplishments = selectedWorkExperience.accomplishments;
        workExp.supervisor = selectedWorkExperience.supervisor;
        workExp.office = selectedWorkExperience.office;
        workExp.isSelected = true;
        addedWorkExperiences.push(workExp);
      }
    });
    setWorkExperiences(tempWorkExperiences);
    setWorkExperiencesSheet(addedWorkExperiences);
    setDuties([]);
    setAccomplishments([]);
    setDefaultModal();

    setAlertIsOpen(false);
  };

  const setDefaultModal = () => {
    setModal({ ...modal, page: 1 });
  };

  // set function for close/cancel
  const cancelAction = () => {
    if (modal.page === 1) {
      setModal({ ...modal, isOpen: false, page: 1 });
      setSelectedWorkExperience({} as WorkExperienceSheet);
      setTab(0);
    } else if (modal.page === 2) {
      setDuties([]);
      setAccomplishments([]);
      setSelectedWorkExperience({} as WorkExperienceSheet);
      setTab(0);
      setModal({ ...modal, page: 1 });
    }
  };

  // open modal
  const openModal = () => {
    setModal({ ...modal, page: 1, isOpen: true });
  };

  // open no experience alert

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(modalAction)} id="workExpSheet">
        <CardContainer
          className="w-[44rem] rounded-xl border p-5"
          bgColor={'bg-yellow-100'}
          title={''}
          remarks={''}
          subtitle={''}
        >
          <div className="flex items-center gap-4">
            <section>
              <HiInformationCircle size={40} className="text-slate-600" />
            </section>
            <section>
              The work experience sheet varies on what position you are applying for.
              <br />
              Only include the relevant ones.
            </section>
          </div>
        </CardContainer>
        <CardContainer
          className="w-[44rem] rounded-xl border p-5"
          bgColor={'bg-sky-100'}
          title={''}
          remarks={''}
          subtitle={''}
        >
          <div className="flex items-center gap-4">
            <section>
              <HiInformationCircle size={40} className="text-slate-600" />
            </section>
            <section>Work experiences are sorted by date upon final submission of application.</section>
          </div>
        </CardContainer>
        {!noWorkExperience ? (
          <>
            <div className="flex flex-col w-full grid-cols-2 gap-4 py-7">
              <div className="w-full col-span-1">
                <Button onClick={openModal} btnLabel="Select a work experience" variant="theme" type="button" />
              </div>
              {/**  */}
            </div>
            <Modal open={modal.isOpen} setOpen={openModal} size="lg" steady>
              <Modal.Header>
                {/* {modal.page === 1 ? 'Pick a relevant work experience' : modal.page === 2 ? 'Completely fill-out your work experience' : ''} */}
                <h1 className="px-2 text-2xl font-medium tracking-tight text-gray-900">
                  {modal.page === 1
                    ? 'Pick a relevant work experience'
                    : modal.page === 2
                    ? 'Complete your work experience sheet                                              '
                    : ''}
                </h1>
              </Modal.Header>
              <Modal.Body>
                <ModalController page={modal.page} tab={tab} setTab={setTab} />
              </Modal.Body>
              <Modal.Footer>
                <div className="flex justify-between w-full gap-4">
                  <Button
                    btnLabel={modal.page === 1 ? 'Close' : 'Previous'}
                    fluid
                    variant="light"
                    onClick={cancelAction}
                    tabIndex={-1}
                  />

                  <Button
                    btnLabel={
                      modal.page === 1 && selectedWorkExperience.isSelected === true
                        ? 'View'
                        : modal.page === 1 && !selectedWorkExperience.isSelected
                        ? 'Next'
                        : modal.page === 2
                        ? 'Submit'
                        : ''
                    }
                    fluid
                    form="workExpSheet"
                    className={
                      (selectedWorkExperience.isSelected && modal.page === 2) || isEmpty(selectedWorkExperience)
                        ? 'invisible'
                        : 'visible'
                    }
                  />
                </div>
              </Modal.Footer>
            </Modal>
            {/** Alert Success */}
            <Alert open={alertIsOpen} setOpen={setAlertIsOpen}>
              <Alert.Description>This action cannot be undone. Do you want to proceed?</Alert.Description>
              <Alert.Footer alignEnd>
                <div className="flex w-full gap-4">
                  <Button btnLabel="No" onClick={() => setAlertIsOpen(false)} variant="light"></Button>
                  <Button btnLabel="Yes" onClick={alertAction}></Button>
                </div>
              </Alert.Footer>
            </Alert>

            {/** Alert Unfulfilled */}
            <Alert open={alertFailIsOpen} setOpen={setAlertFailIsOpen}>
              <Alert.Description>
                <div className="flex flex-col w-full">
                  <span className="text-xl">Incomplete work experience sheet</span>
                  <span className="text-lg text-gray-900">Complete the following:</span>
                  <span className="text-gray-600">• Immediate Supervisor</span>
                  <span className="text-gray-600">• Name of Office or Unit</span>
                  <span className="text-gray-600">• Accomplishment/s (at least 1)</span>
                  <span className="text-gray-600">• Duty/Duties (not required)</span>
                </div>
              </Alert.Description>
              <Alert.Footer alignEnd>
                <div className="flex w-full gap-4">
                  <Button btnLabel="OK" onClick={() => setAlertFailIsOpen(false)} type="button"></Button>
                </div>
              </Alert.Footer>
            </Alert>
          </>
        ) : (
          <CardContainer bgColor={''} title={''} remarks={''} subtitle={''} className="rounded-xl py-7">
            <LabelBox title="No relevant work experience" titleClassName="uppercase text-2xl font-medium" />
          </CardContainer>
        )}
      </form>
    </FormProvider>
  );
};
