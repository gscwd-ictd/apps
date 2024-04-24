/* This function is used to convert SG(string ex. 10-1) to number (ex. 10)  */
import { isEmpty } from 'lodash';

export const SalaryGradeConverter = (sgString: string) => {
  if (isEmpty(sgString) || sgString === null) {
    sgString = '0-1';
  }
  const sg = sgString;
  const tempSg = sg.split('');
  const arraySg: string[] = [];
  tempSg.every(function (element, index) {
    arraySg.push(element);
    if (element === '-') {
      return false;
    } else return true;
  });
  const convertedArraySg = arraySg.join();
  const finalSg = convertedArraySg.replace(/-/g, '');
  const salaryGrade = finalSg.replace(/,/g, '');
  const finalSalaryGrade = Number(salaryGrade); //final result
  return finalSalaryGrade;
};
