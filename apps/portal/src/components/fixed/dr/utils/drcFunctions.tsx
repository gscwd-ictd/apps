/* eslint-disable @nx/enforce-module-boundaries */
import {
  DutiesResponsibilitiesList,
  DutyResponsibilityList,
} from 'apps/portal/src/store/dnr.store';
import {
  DutiesResponsibilities,
  DutyResponsibility,
  UpdatedDRC,
  UpdatedDRCD,
} from 'apps/portal/src/types/dr.type';
import { isEmpty } from 'lodash';

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

// assign the updated drcs for the update
export async function AssignUpdatedDrcs(
  core: Array<DutyResponsibility>,
  support: Array<DutyResponsibility>,
  deleted: any
) {
  const deletedList: Array<string> = [];
  const coreList: Array<UpdatedDRC> = [];
  const supportList: Array<UpdatedDRC> = [];
  const corePostList: Array<DutyResponsibilityList> = [];
  const supportPostList: Array<DutyResponsibilityList> = [];

  deleted.length > 0 &&
    deleted.map((deletedDRC: DutyResponsibility) => {
      if (deletedDRC.ogdrId) deletedList.push(deletedDRC.ogdrId);
      // deletedList.push((({ description, drId, odrId, onEdit, sequenceNo, state, competency, ...rest }) => rest)(deletedDRC));
    });

  core.length > 0 &&
    core.map((coreDRC: DutyResponsibility) => {
      if (!isEmpty(coreDRC.ogdrId))
        coreList.push({
          ogdrId: coreDRC.ogdrId!,
          pcplId: coreDRC.competency.pcplId,
          percentage: coreDRC.percentage!,
        });
      else if (isEmpty(coreDRC.ogdrId))
        corePostList.push({
          odrId: coreDRC.odrId,
          pcplId: coreDRC.competency.pcplId,
          percentage: coreDRC.percentage,
        });
    });

  support.length > 0 &&
    support.map((supportDRC: DutyResponsibility) => {
      if (!isEmpty(supportDRC.ogdrId))
        supportList.push({
          ogdrId: supportDRC.ogdrId,
          pcplId: supportDRC.competency.pcplId,
          percentage: supportDRC.percentage,
        });
      else if (isEmpty(supportDRC.ogdrId))
        supportPostList.push({
          odrId: supportDRC.odrId,
          pcplId: supportDRC.competency.pcplId,
          percentage: supportDRC.percentage,
        });
    });

  const forPosting: DutiesResponsibilitiesList = {
    core: corePostList,
    support: supportPostList,
  };

  const forUpdating: UpdatedDRCD = {
    core: coreList,
    support: supportList,
    deleted: deletedList,
  };

  return { forUpdating, forPosting };
}
