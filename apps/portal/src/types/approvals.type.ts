/* eslint-disable @nx/enforce-module-boundaries */
import { PassSlipStatus } from "libs/utils/src/lib/enums/pass-slip.enum";

export type passSlipAction = {
  passSlipId: string;
  status: PassSlipStatus;
};
