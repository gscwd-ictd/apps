import { Button } from '@gscwd-apps/oneui';
import { useTrainingTypesStore } from 'apps/employee-monitoring/src/store/training-type.store';
import { ModalActions } from 'libs/utils/src/lib/enums/modal-actions.enum';
import { useState } from 'react';
import { SearchBox } from '../../../../inputs/SearchBox';

export const TrainingCategoriesPageHeader = (): JSX.Element => {
  const [searchValue, setSearchValue] = useState<string>('');
  // const setAction = useTrainingTypesStore((state) => state.setAction);
  // const setModalIsOpen = useTrainingTypesStore((state) => state.setModalIsOpen);

  // open modal
  const createModalIsOpen = () => {
    // setModalIsOpen(true);
    // setAction(ModalActions.CREATE);
  };

  return (
    <div className="flex justify-between w-full pl-3 ">
      <SearchBox
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        placeholder="Search by category"
      />
      <Button type="button" variant="info" onClick={createModalIsOpen}>
        <div className="flex items-center w-full gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-normal"> Add Training/Seminar Type</span>
        </div>
      </Button>
    </div>
  );
};
