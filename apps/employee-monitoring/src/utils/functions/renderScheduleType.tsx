import { Categories } from 'libs/utils/src/lib/enums/category.enum';

// Render badge pill design
function UseRenderScheduleType(categoryType: Categories) {
  if (categoryType === Categories.REGULAR) {
    return (
      <div className="bg-red-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded w-[10rem] text-center">
        Regular
      </div>
    );
  } else if (categoryType === Categories.FLEXIBLE) {
    return (
      <div className="bg-blue-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded w-[10rem] text-center">
        Flexible
      </div>
    );
  } else {
    return (
      <div className="bg-gray-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded w-[10rem] text-center">
        N/A
      </div>
    );
  }
}

export default UseRenderScheduleType;
