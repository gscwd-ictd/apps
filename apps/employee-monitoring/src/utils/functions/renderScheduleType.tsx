import { Categories } from 'libs/utils/src/lib/enums/category.enum';

// Render badge pill design
export const renderScheduleType = (categoryType: Categories) => {
  if (categoryType === Categories.REGULAR) {
    return (
      <span className="bg-red-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
        Regular
      </span>
    );
  } else if (categoryType === Categories.FLEXIBLE) {
    return (
      <span className="bg-blue-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
        Flexible
      </span>
    );
  } else if (categoryType === Categories.OPERATOR1) {
    return (
      <span className="bg-green-500 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
        OPERATOR A
      </span>
    );
  } else {
    return;
  }
};
