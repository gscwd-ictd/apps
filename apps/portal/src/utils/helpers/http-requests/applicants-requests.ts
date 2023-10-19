import { WorkExperience } from '../../../../src/types/workexp.type';
import axios from 'axios';

//for fetching job posting details
export const getJobOpeningDetails = async (vppId: string) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/job-description/${vppId}`
    );
    return data;
  } catch (error) {
    return { error };
  }
};

//for applying a job post based on vppId and employee Id
// export const applyJobPost = async (
//   vppId: string,
//   employeeId: string,
//   withRelevantExperience: boolean,
//   workExperienceArray: Array<WorkExperience>
// ) => {
//   try {
//     const { data } = await axios.post(
//       `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant/${vppId}/internal/${employeeId}`,
//       {
//         withRelevantExperience: withRelevantExperience,
//         workExperienceSheet: workExperienceArray,
//       }
//     );
//     return data;
//   } catch (error) {
//     return { error };
//   }
// };

//for initially checking if employeeId has already applied for a specific job post (vppId)
export const checkIfApplied = async (vppId: string, employeeId: string) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HRIS_URL}/applicant/${vppId}/internal/${employeeId}`);
    return data;
  } catch (error) {
    return {};
  }
};

//get work experience from pds of employee
export const getWorkExp = async (employeeId: string) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_PORTAL_URL}/pds/work-experience/${employeeId}`);
    return data;
  } catch (error) {
    return { error };
  }
};
