import { Categories } from 'libs/utils/src/lib/enums/category.enum';

/* This function is used for rendering schedule types */

function UseRenderScheduleType(categoryType: Categories) {
  if (categoryType === Categories.REGULAR) {
    return (
      <div className="bg-red-400 text-white text-xs font-medium py-0.5 rounded w-[10rem] text-center">
        Regular
      </div>
    );
  } else if (categoryType === Categories.FLEXIBLE) {
    return (
      <div className="bg-blue-400 text-white text-xs font-medium py-0.5 rounded w-[10rem] text-center">
        Flexible
      </div>
    );
  } else {
    return (
      <div className="bg-gray-400 text-white text-xs font-medium py-0.5 rounded w-[10rem] text-center">
        N/A
      </div>
    );
  }
}

export default UseRenderScheduleType;
