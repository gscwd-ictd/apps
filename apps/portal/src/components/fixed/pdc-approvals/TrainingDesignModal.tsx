/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { JSONContent } from '@tiptap/react';
import Image from 'next/image';
import GscwdLogo from 'apps/employee-monitoring/public/gscwd-logo.png';
import iso_logo from 'apps/employee-monitoring/public/socotec-logo.jpg';
import { StyleSheet } from '@react-pdf/renderer';
import { Button, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { Tiptap } from '../tiptap/view/Tiptap';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { HiX } from 'react-icons/hi';
import useSWR from 'swr';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';

type ModalProps = {
  modalState: boolean;
  id: string; // training design id
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    paddingTop: 10,
    paddingBottom: 25,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 5,
  },
  bodyBorder: {
    marginHorizontal: 50,
  },

  // line
  line: {
    borderBottom: '2px solid #0000',
  },

  // Table Styles
  rowContainerTable: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  tHeadFirstLevel: {
    padding: '4 0 0 4',
  },
  tHeadSecondLevel: {
    // fontFamily: 'CalibriRegularBold',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    padding: '4 0 0 4',
    textAlign: 'center',
  },
  tData: {
    padding: '4 0 0 4',
  },

  // Border Styles
  borderAll: {
    border: '1px solid #000000',
  },
  borderTop: {
    borderTop: '1px solid #000000',
  },
  borderRight: {
    borderRight: '1px solid #000000',
  },
  borderLeft: {
    borderLeft: '1px solid #000000',
  },
  borderBottom: {
    borderBottom: '1px solid #000000',
  },

  // Field Styles
  documentTitle: {
    // fontFamily: 'CalibriRegularBold',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    marginBottom: 10,
    textAlign: 'center',
  },

  content: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    textAlign: 'left',
    marginBottom: 10,
  },

  contentTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    textAlign: 'left',
    marginBottom: 5,
  },

  headerText: {
    // fontFamily: 'CalibriRegularBold',
    fontFamily: 'Helvetica-Bold',
    textDecoration: 'underline',
    fontSize: 12,
    marginTop: 15,
    marginBottom: 4,
  },
  bodyText: {
    // fontFamily: 'CalibriRegular',
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  bodyTextBold: {
    // fontFamily: 'CalibriRegularBold',
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
  },
  upperCase: {
    textTransform: 'uppercase',
  },
  signatoryName: {
    // fontFamily: 'CalibriRegularBold',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    paddingTop: 3,
  },

  verticalCenter: { margin: 'auto 0' },
  horizontalCenter: { textAlign: 'center' },
  signature: {
    width: 100,
    marginHorizontal: 'auto',
  },

  // Width Styles
  w100: { width: '100%' },
  w75: { width: '75%' },
  w70: { width: '70%' },
  w60: { width: '60%' },
  w50: { width: '50%' },
  w40: { width: '40%' },
  w33_33: { width: '33.33%' },
  w30: { width: '30%' },
  w26: { width: '26%' },
  w20: { width: '20%' },
  w16: { width: '16%' },
  w15: { width: '15%' },
  w14: { width: '14%' },
  w10: { width: '10%' },
  w5: { width: '5%' },
});

export const TrainingDesignModal: FunctionComponent<ModalProps> = ({
  modalState,
  id,
  setModalState,
  closeModalAction,
}: ModalProps) => {
  const trainingDesignToPrintRef = useRef(null);

  const [trainingDesignId, setTrainingDesignId] = useState<string>('');
  const [courseTitle, setCourseTitle] = useState<string>('');
  const [rationale, setRationale] = useState<string | JSONContent | null>('');
  const [courseDescription, setCourseDescription] = useState<string | JSONContent | null>('');
  const [courseObjective, setCourseObjective] = useState<string | JSONContent | null>('');
  const [targetParticipants, setTargetParticipants] = useState<string | JSONContent | null>('');
  const [methodologies, setMethodologies] = useState<string | JSONContent | null>('');
  const [expectedOutput, setExpectedOutput] = useState<string | JSONContent | null>('');
  const [recognition, setRecognition] = useState<string | JSONContent | null>('');

  const trainingDesignUrl = `${process.env.NEXT_PUBLIC_LMS}/api/lms/v1/training/designs/${id}`;

  const {
    data: swrTrainingDesign,
    isLoading: swrTrainingDesignIsLoading,
    error: swrTrainingDesignError,
    mutate: mutateTrainingDesign,
  } = useSWR(id ? trainingDesignUrl : null, fetchWithToken, {});

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrTrainingDesign)) {
      setTrainingDesignId(swrTrainingDesign.id);
      setCourseTitle(swrTrainingDesign.courseTitle);
      setRationale(swrTrainingDesign.rationale);
      setCourseDescription(swrTrainingDesign.courseDescription);
      setCourseObjective(swrTrainingDesign.courseObjective);
      setTargetParticipants(swrTrainingDesign.targetParticipants);
      setMethodologies(swrTrainingDesign.methodologies);
      setExpectedOutput(swrTrainingDesign.expectedOutput);
      setRecognition(swrTrainingDesign.recognition);
    }
  }, [swrTrainingDesign]);

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      {!isEmpty(swrTrainingDesignError) && modalState ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${swrTrainingDesignError.message}: Failed to load Training Design.`}
        />
      ) : null}

      <Modal size={windowWidth > 1024 ? 'md' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Training Design</span>
              <button
                className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full h-full flex flex-col gap-2">
            <div className="flex justify-center w-full rounded">
              <div className="w-[8.5in] px-8 py-10 bg-white text-sm">
                {!swrTrainingDesign ? (
                  <div className="flex justify-center w-full h-full">
                    <LoadingSpinner size={'lg'} />
                    {/* <SpinnerDotted
                      speed={70}
                      thickness={70}
                      className="flex w-full h-full transition-all "
                      color="slateblue"
                      size={100}
                    /> */}
                  </div>
                ) : (
                  <div ref={trainingDesignToPrintRef}>
                    <header className="flex items-center w-full h-full grid-cols-3 font-serif">
                      <div className="w-[15%]">
                        <Image src={GscwdLogo} alt="gscwd logo" height={105} />
                      </div>
                      <section className="w-[70%] leading-tight -tracking-normal text-center">
                        <h3 className="font-openSans">Republic of the Philippines</h3>
                        <p className="font-semibold uppercase text-sky-600">General Santos City Water District</p>
                        <h3>E. Fernandez St., Brgy. Lagao, General Santos City</h3>
                        <h3>Telephone No. (083) 552-3824 / Telefax No. (083) 553-4960</h3>
                        <h3>E-mail Address: gscwaterdistrict@yahoo.com</h3>
                        <p className="font-medium text-blue-500 underline underline-offset-2">www.gensanwater.gov.ph</p>
                      </section>
                      <div className="w-[15%]">
                        <Image src={iso_logo} alt="iso logo" />
                      </div>
                    </header>
                    <hr className="my-4" />
                    <div className="flex justify-center w-full font-semibold uppercase">Training Design</div>
                    <div className="flex items-center font-semibold">Course Title: {courseTitle}</div>
                    <div className="mt-4 font-semibold">I.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rationale</div>
                    {trainingDesignId ? (
                      <Tiptap
                        id="rationale"
                        className="bg-white "
                        content={rationale}
                        setContent={setRationale}
                        type="JSON"
                        viewOnly
                        editable={false}
                      />
                    ) : null}
                    <div className="mt-4 font-semibold">II.&nbsp;&nbsp;&nbsp;&nbsp;Course Description</div>
                    {trainingDesignId ? (
                      <Tiptap
                        id="course-desc"
                        className="bg-white "
                        content={courseDescription}
                        setContent={setCourseDescription}
                        type="JSON"
                        viewOnly
                        editable={false}
                      />
                    ) : null}
                    <div className="mt-4 font-semibold">III.&nbsp;&nbsp;&nbsp;Course Objectives</div>
                    {trainingDesignId && (
                      <Tiptap
                        id="course-obj"
                        className="bg-white "
                        content={courseObjective}
                        setContent={setCourseObjective}
                        type="JSON"
                        viewOnly
                        editable={false}
                      />
                    )}
                    <div className="mt-4 font-semibold">IV.&nbsp;&nbsp;Target Participants</div>
                    {trainingDesignId && (
                      <Tiptap
                        id="target-participants"
                        className="bg-white "
                        content={targetParticipants}
                        setContent={setTargetParticipants}
                        type="JSON"
                        viewOnly
                        editable={false}
                      />
                    )}
                    <div className="mt-4 font-semibold">V.&nbsp;&nbsp;&nbsp;Methodologies</div>
                    {trainingDesignId && (
                      <Tiptap
                        id="methodologies"
                        className="bg-white "
                        content={methodologies}
                        setContent={setMethodologies}
                        type="JSON"
                        viewOnly
                        editable={false}
                      />
                    )}
                    <div className="mt-4 font-semibold">Expected Outputs</div>
                    {trainingDesignId && (
                      <Tiptap
                        id="expected-outputs"
                        className="bg-white "
                        content={expectedOutput}
                        setContent={setExpectedOutput}
                        type="JSON"
                        viewOnly
                        editable={false}
                      />
                    )}
                    <div className="mt-4 font-semibold">Recognition</div>
                    {trainingDesignId && (
                      <Tiptap
                        id="expected-outputs"
                        className="bg-white "
                        content={recognition}
                        setContent={setRecognition}
                        type="JSON"
                        viewOnly
                        editable={false}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="max-w-auto">
              <Button variant={'default'} size={'md'} loading={false} type="submit" onClick={closeModalAction}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
