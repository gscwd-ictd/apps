/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { DutyResponsibilityList } from 'apps/portal/src/store/dnr.store';
import {
  DutiesResponsibilities,
  DutyResponsibility,
} from 'apps/portal/src/types/dr.type';

export async function UpdateAvailableDrcs(
  availableDnrs: Array<DutyResponsibility>,
  selectedDnrs: DutiesResponsibilities,
  checkedDnrs: DutiesResponsibilities
) {
  let availableDnrsCount = 0;
  const newAvailableDnrs: Array<DutyResponsibility> = [];

  // map all available dnrs
  availableDnrs.length > 0 &&
    availableDnrs.map((dr: DutyResponsibility) => {
      if (dr.state === false) {
        dr.onEdit = false;
        dr.sequenceNo = availableDnrsCount;
        newAvailableDnrs.push(dr);
        availableDnrsCount++;
      }
    });

  const tempCoreCheckedDnrs: Array<DutyResponsibility> = checkedDnrs.core;

  // push
  tempCoreCheckedDnrs.push(...selectedDnrs.core);

  // sort
  tempCoreCheckedDnrs.sort((a: DutyResponsibility, b: DutyResponsibility) =>
    a.description.localeCompare(b.description)
  );

  // map and assign new sequence
  tempCoreCheckedDnrs.map((dr: DutyResponsibility, index: number) => {
    dr.sequenceNo = index;
  });

  const tempSupportCheckedDnrs: Array<DutyResponsibility> = checkedDnrs.support;

  // push
  tempSupportCheckedDnrs.push(...selectedDnrs.support);

  // sort
  tempSupportCheckedDnrs.sort((a: DutyResponsibility, b: DutyResponsibility) =>
    a.description.localeCompare(b.description)
  );

  // re-index
  tempSupportCheckedDnrs.map((dr: DutyResponsibility, index: number) => {
    dr.sequenceNo = index;
  });

  return {
    core: tempCoreCheckedDnrs,
    support: tempSupportCheckedDnrs,
    availableDnrs: newAvailableDnrs,
  };
}

export async function UpdateFinalDrcs(selected: DutiesResponsibilities) {
  const tempCoreDnrList = selected.core;
  const tempSupportDnrList = selected.support;
  const finalCoreDnrList: Array<DutyResponsibilityList> = [];
  const finalSupportDnrList: Array<DutyResponsibilityList> = [];

  tempCoreDnrList.map((dr: DutyResponsibility) => {
    finalCoreDnrList.push({
      odrId: dr.odrId,
      pcplId: dr.competency.pcplId,
      percentage: dr.percentage!,
    });
  });

  tempSupportDnrList.map((dr: DutyResponsibility) => {
    finalSupportDnrList.push({
      odrId: dr.odrId,
      pcplId: dr.competency.pcplId,
      percentage: dr.percentage!,
    });
  });

  return { core: finalCoreDnrList, support: finalSupportDnrList };
}
