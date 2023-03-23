/* eslint-disable no-empty */
import { isEmpty } from 'lodash';
import {
  DutiesResponsibilities,
  DutiesResponsibilitiesList,
  DutyResponsibility,
  DutyResponsibilityList,
  UpdatedDRC,
  UpdatedDRCD,
} from '../../../../types/dr.type';

export async function UpdateDrcPool(
  pool: Array<DutyResponsibility>,
  selected: DutiesResponsibilities,
  checked: DutiesResponsibilities
) {
  let poolCount = 0;
  const newDRPool: Array<DutyResponsibility> = [];

  // map all pool
  pool.length > 0 &&
    pool.map((dr: DutyResponsibility) => {
      if (dr.state === false) {
        dr.onEdit = false;
        dr.sequenceNo = poolCount;
        newDRPool.push(dr);
        poolCount++;
      }
    });

  const tempCoreCheckedDRs: Array<DutyResponsibility> = checked.core;

  // push
  tempCoreCheckedDRs.push(...selected.core);

  // sort
  tempCoreCheckedDRs.sort((a: DutyResponsibility, b: DutyResponsibility) =>
    a.description!.localeCompare(b.description!)
  );

  // map and assign new sequence
  tempCoreCheckedDRs.map((dr: DutyResponsibility, index: number) => {
    dr.sequenceNo = index;
  });

  const tempSupportCheckedDRs: Array<DutyResponsibility> = checked.support;

  // push
  tempSupportCheckedDRs.push(...selected.support);

  // sort
  tempSupportCheckedDRs.sort((a: DutyResponsibility, b: DutyResponsibility) =>
    a.description!.localeCompare(b.description!)
  );

  // re-index
  tempSupportCheckedDRs.map((dr: DutyResponsibility, index: number) => {
    dr.sequenceNo = index;
  });

  return { tempCoreCheckedDRs, tempSupportCheckedDRs, newDRPool };
}

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
          percentage: coreDRC.percentage!,
        });
      else if (isEmpty(coreDRC.ogdrId))
        corePostList.push({
          odrId: coreDRC.odrId,
          pcplId: coreDRC.competency.pcplId,
          percentage: coreDRC.percentage!,
        });
    });

  support.length > 0 &&
    support.map((supportDRC: DutyResponsibility) => {
      if (!isEmpty(supportDRC.ogdrId))
        supportList.push({
          ogdrId: supportDRC.ogdrId!,
          percentage: supportDRC.percentage!,
        });
      else if (isEmpty(supportDRC.ogdrId))
        supportPostList.push({
          odrId: supportDRC.odrId,
          pcplId: supportDRC.competency.pcplId,
          percentage: supportDRC.percentage!,
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

export async function UpdateFinalDrcs(selected: DutiesResponsibilities) {
  const tempCoreDRList = selected.core;
  const tempSupportDRList = selected.support;
  const finalCoreDRList: Array<DutyResponsibilityList> = [];
  const finalSupportDRList: Array<DutyResponsibilityList> = [];

  tempCoreDRList.map((dr: DutyResponsibility) => {
    finalCoreDRList.push({
      odrId: dr.odrId,
      pcplId: dr.competency.pcplId,
      percentage: dr.percentage!,
    });
  });

  tempSupportDRList.map((dr: DutyResponsibility) => {
    finalSupportDRList.push({
      odrId: dr.odrId,
      pcplId: dr.competency.pcplId,
      percentage: dr.percentage!,
    });
  });

  return { finalCoreDRList, finalSupportDRList };
}

export const DrcChecker = (selectedDrcs: DutiesResponsibilities) => {
  let noPercentageCounter = 0;
  let noCompetencyCounter = 0;
  let onEditCounter = 0;
  let coreTotal = 0;
  let supportTotal = 0;

  selectedDrcs.core &&
    selectedDrcs.core.map((dr: DutyResponsibility) => {
      if (dr.percentage > 0) {
      } else noPercentageCounter++;
      if (dr.onEdit === true) onEditCounter++;
      if (
        dr.competency.code === null ||
        dr.competency.code === '' ||
        dr.competency === undefined ||
        JSON.stringify(dr.competency) === '{}'
      )
        noCompetencyCounter++;
      coreTotal = coreTotal + dr.percentage!;
    });

  selectedDrcs.support &&
    selectedDrcs.support.map((dr: DutyResponsibility) => {
      if (dr.percentage > 0) {
      } else noPercentageCounter++;
      if (dr.onEdit === true) onEditCounter++;
      if (
        dr.competency.code === null ||
        dr.competency.code === '' ||
        dr.competency === undefined ||
        JSON.stringify(dr.competency) === '{}'
      )
        noCompetencyCounter++;
      supportTotal = supportTotal + dr.percentage!;
    });

  return {
    noPercentageCounter,
    coreTotal,
    supportTotal,
    onEditCounter,
    noCompetencyCounter,
  };
};

export function CompetencyChecker(drcs: DutiesResponsibilities, type: string) {
  let noCoreCompetencyCounter = 0;
  let noSupportCompetencyCounter = 0;
  if (type === 'core') {
    drcs.core.map((dr: DutyResponsibility) => {
      if (
        dr.competency.pcplId === null ||
        dr.competency.pcplId === undefined ||
        dr.competency.pcplId === ''
      )
        noCoreCompetencyCounter++;
    });
  }
  if (type === 'support') {
    drcs.support.map((dr: DutyResponsibility) => {
      if (
        dr.competency.pcplId === null ||
        dr.competency.pcplId === undefined ||
        dr.competency.pcplId === ''
      )
        noSupportCompetencyCounter++;
    });
  }

  return { noCoreCompetencyCounter, noSupportCompetencyCounter };
}
