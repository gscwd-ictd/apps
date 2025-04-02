/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip valuees */

import { OvertimeAccomplishmentStatus, OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import BadgePill from '../../components/modular/badges/BadgePill';
import { OvertimeDetails } from 'libs/utils/src/lib/types/overtime.type';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';

function RenderOvertimePendingAccomplishmentStatus(employees: OvertimeDetails, textSize: TextSize) {
  let pendingAccomplishmentApproval = [];
  pendingAccomplishmentApproval = employees?.employees.filter(
    (e) => e.isAccomplishmentSubmitted == true && e.accomplishmentStatus === OvertimeAccomplishmentStatus.PENDING
  );

  return (
    <BadgePill
      textSize={textSize}
      variant={
        employees?.status === OvertimeStatus.CANCELLED
          ? 'error'
          : pendingAccomplishmentApproval.length >= 1
          ? 'warning'
          : 'default'
      }
      label={
        employees?.status === OvertimeStatus.CANCELLED
          ? 'Cancelled'
          : pendingAccomplishmentApproval.length >= 1
          ? 'Pending Approvals'
          : 'No Pending Approvals'
      }
    />
  );
}

export default RenderOvertimePendingAccomplishmentStatus;
