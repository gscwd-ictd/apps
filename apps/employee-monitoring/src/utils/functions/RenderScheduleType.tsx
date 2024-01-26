/* eslint-disable @nx/enforce-module-boundaries */
import { Categories } from 'libs/utils/src/lib/enums/category.enum';

/* This function is used for rendering schedule types */

function UseRenderScheduleType(categoryType: Categories) {
  if (categoryType === Categories.REGULAR) {
    return (
      <div className="bg-red-200 text-red-800 text-xs font-mono py-0.5 rounded  text-center">
        Regular
      </div>
    );
  } else if (categoryType === Categories.FLEXIBLE) {
    return (
      <div className="bg-blue-200 text-blue-800 text-xs font-mono py-0.5 rounded  text-center">
        Flexible
      </div>
    );
  } else {
    return (
      <div className="bg-gray-200 text-gray-800 text-xs font-mono py-0.5 rounded text-center">
        N/A
      </div>
    );
  }
}

export default UseRenderScheduleType;
