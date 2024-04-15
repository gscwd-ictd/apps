/* eslint-disable @nx/enforce-module-boundaries */
/* This function is used for rendering pass slip valuees */

import { OvertimeAccomplishmentStatus, OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import BadgePill from '../../components/modular/badges/BadgePill';
import { EmployeeOvertimeDetail } from 'libs/utils/src/lib/types/overtime.type';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';

function RenderOvertimePendingAccomplishmentStatus(employees: Array<EmployeeOvertimeDetail>, textSize: TextSize) {
  let pendingAccomplishmentApproval = [];
  pendingAccomplishmentApproval = employees.filter(
    (e) => e.isAccomplishmentSubmitted == true && e.accomplishmentStatus === OvertimeAccomplishmentStatus.PENDING
  );

  return (
    <BadgePill
      textSize={textSize}
      variant={pendingAccomplishmentApproval.length >= 1 ? 'warning' : 'default'}
      label={pendingAccomplishmentApproval.length >= 1 ? 'Pending Approvals' : 'No Pending Approvals'}
    />
  );
}

export default RenderOvertimePendingAccomplishmentStatus;
