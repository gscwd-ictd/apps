import { Modal } from '@gscwd-apps/oneui';
import { PDFViewer } from '@react-pdf/renderer';
import { usePrfStore } from 'apps/portal/src/store/prf.store';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { FunctionComponent, useEffect } from 'react';
import { SpinnerCircular } from 'spinners-react';
import useSWR from 'swr';
import PdDocument from './PdDocument';

type ViewPositionModalProps = {
  closeModalAction?: () => void;
};

export const ViewPositionModal: FunctionComponent<ViewPositionModalProps> = ({ closeModalAction }) => {
  const viewPositionModalIsOpen = usePrfStore((state) => state.viewPositionModalIsOpen);
  const selectedPosition = usePrfStore((state) => state.selectedPosition);
  const setViewPositionModalIsOpen = usePrfStore((state) => state.setViewPositionModalIsOpen);
  const getPositionJobDescription = usePrfStore((state) => state.getPositionJobDescription);
  const getPositionJobDescriptionSuccess = usePrfStore((state) => state.getPositionJobDescriptionSuccess);
  const getPositionJobDescriptionFail = usePrfStore((state) => state.getPositionJobDescriptionFail);
  const getPositionDuties = usePrfStore((state) => state.getPositionDuties);
  const getPositionDutiesSuccess = usePrfStore((state) => state.getPositionDutiesSuccess);
  const getPositionDutiesFail = usePrfStore((state) => state.getPositionDutiesFail);
  const getPositionQualificationStandards = usePrfStore((state) => state.getPositionQualificationStandards);
  const getPositionQualificationStandardsSuccess = usePrfStore(
    (state) => state.getPositionQualificationStandardsSuccess
  );
  const getPositionQualificationStandardsFail = usePrfStore((state) => state.getPositionQualificationStandardsFail);
  const getPositionCompetencies = usePrfStore((state) => state.getPositionCompetencies);
  const getPositionCompetenciesSuccess = usePrfStore((state) => state.getPositionCompetenciesSuccess);
  const getPositionCompetenciesFail = usePrfStore((state) => state.getPositionCompetenciesFail);

  const prfUrl = process.env.NEXT_PUBLIC_HRIS_URL;

  // fetch job description
  const {
    data: swrJd,
    isLoading: swrJdIsLoading,
    error: swrJdError,
    mutate: swrJdMutate,
  } = useSWR(
    viewPositionModalIsOpen && !isEmpty(selectedPosition.positionId)
      ? `${prfUrl}/plantilla/job-description/single/${selectedPosition.positionId}`
      : null,
    fetchWithToken,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: true,
    }
  );

  // fetch drcs
  const {
    data: swrDuties,
    isLoading: swrDutiesIsLoading,
    error: swrDutiesError,
    mutate: swrDutiesMutate,
  } = useSWR(
    viewPositionModalIsOpen && !isEmpty(selectedPosition.positionId)
      ? `${prfUrl}/plantilla/duties/single/${selectedPosition.positionId}`
      : null,
    fetchWithToken,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: true,
    }
  );

  // fetch qs
  const {
    data: swrQs,
    isLoading: swrQsIsLoading,
    error: swrQsError,
    mutate: swrQsMutate,
  } = useSWR(
    viewPositionModalIsOpen && !isEmpty(selectedPosition.positionId)
      ? `${prfUrl}/qualification-standards/single/${selectedPosition.positionId}`
      : null,
    fetchWithToken,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: true,
    }
  );

  // fetch proficiency level
  const {
    data: swrPl,
    isLoading: swrPlIsLoading,
    error: swrPlError,
    mutate: swrPlMutate,
  } = useSWR(
    viewPositionModalIsOpen && !isEmpty(selectedPosition.positionId)
      ? `${prfUrl}/competency-proficiency-level/single/${selectedPosition.positionId}`
      : null,
    fetchWithToken,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: true,
    }
  );

  // initial zustand state update
  useEffect(() => {
    if (swrJdIsLoading) {
      getPositionJobDescription(swrJdIsLoading);
    }
  }, [swrJdIsLoading]);

  // upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrJd)) {
      getPositionJobDescriptionSuccess(swrJdIsLoading, swrJd);
    }

    if (!isEmpty(swrJdError)) {
      getPositionJobDescriptionFail(swrJdIsLoading, swrJdError);
    }
  }, [swrJd, swrJdError]);

  // initial zustand state update
  useEffect(() => {
    if (swrDutiesIsLoading) {
      getPositionDuties(swrDutiesIsLoading);
    }
  }, [swrDutiesIsLoading]);

  // upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrDuties)) {
      getPositionDutiesSuccess(swrDutiesIsLoading, swrDuties);
    }

    if (!isEmpty(swrDutiesError)) {
      getPositionDutiesFail(swrDutiesIsLoading, swrDutiesError);
    }
  }, [swrDuties, swrDutiesError]);

  // initial zustand state update
  useEffect(() => {
    if (swrQsIsLoading) {
      getPositionQualificationStandards(swrQsIsLoading);
    }
  }, [swrQsIsLoading]);

  // upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrQs)) {
      getPositionQualificationStandardsSuccess(swrQsIsLoading, swrQs);
    }

    if (!isEmpty(swrDutiesError)) {
      getPositionQualificationStandardsFail(swrQsIsLoading, swrQsError);
    }
  }, [swrQs, swrQsError]);

  // initial zustand state update
  useEffect(() => {
    if (swrPlIsLoading) {
      getPositionCompetencies(swrPlIsLoading);
    }
  }, [swrPlIsLoading]);

  // upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrPl)) {
      getPositionQualificationStandardsSuccess(swrPlIsLoading, swrPl);
    }

    if (!isEmpty(swrPlError)) {
      getPositionQualificationStandardsFail(swrPlIsLoading, swrPlError);
    }
  }, [swrPl, swrPlError]);

  return (
    <Modal open={viewPositionModalIsOpen} setOpen={setViewPositionModalIsOpen} size="lg">
      <Modal.Header>Position Description Document</Modal.Header>
      <Modal.Body>
        {swrJdIsLoading ? (
          <SpinnerCircular />
        ) : (
          <PDFViewer width={'100%'} height={700} showToolbar={false}>
            {/* <PdDocument
              jobDescription={swrJd}
              positionDutyResponsibilities={swrDuties}
              positionQualificationStandards={swrQs}
              proficiencyLevel={swrPl}
            /> */}
          </PDFViewer>
        )}
      </Modal.Body>
      <Modal.Footer>
        <></>
      </Modal.Footer>
    </Modal>
  );
};
