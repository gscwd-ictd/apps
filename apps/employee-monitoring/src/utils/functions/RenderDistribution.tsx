/* eslint-disable @nx/enforce-module-boundaries */
import { CreditDistribution } from 'libs/utils/src/lib/types/leave-benefits.type';

function UseRenderDistribution(value: string) {
  if (value === CreditDistribution.MONTHLY) {
    return (
      <div className="bg-blue-200 text-blue-800 text-xs font-mono py-0.5 rounded w-full text-center">
        Monthly
      </div>
    );
  } else if (value === CreditDistribution.YEARLY) {
    return (
      <div className="bg-gray-200 text-gray-800 text-xs font-mono py-0.5 rounded w-full text-center">
        Yearly
      </div>
    );
  }
}

export default UseRenderDistribution;
