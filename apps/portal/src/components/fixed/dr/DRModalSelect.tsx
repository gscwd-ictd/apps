import {
  FormEvent,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { HiOutlineSearch, HiXCircle } from 'react-icons/hi';
import { useDrStore } from '../../../store/dr.store';
import { DutyResponsibility } from '../../../types/dr.type';
import { UndrawSelecting } from '../undraw/Selecting';
import { AllDRsList } from './AllDRsList';
import { SelectedDRCard } from './SelectedDRCard';

type SelectDRProps = {
  // allDRCPool: Array<DutyResponsibility>;
  type: string;
};

export const DRModalSelect = ({ type }: SelectDRProps): JSX.Element => {
  // get related state from dr context
  // const { allDRCPool, searchDRCValue, checkedDRCs, setCheckedDRCs, filteredDRCs, setAllDRCPool, setSearchDRCValue, setFilteredDRCs } = useContext(DRContext);

  const allDRCPool = useDrStore((state) => state.allDRCPool);

  const searchDRCValue = useDrStore((state) => state.searchDRCValue);

  const checkedDRCs = useDrStore((state) => state.checkedDRCs);

  const setCheckedDRCs = useDrStore((state) => state.setCheckedDRCs);

  const filteredDRCs = useDrStore((state) => state.filteredDRCs);

  const setAllDRCPool = useDrStore((state) => state.setAllDRCPool);

  const setSearchDRCValue = useDrStore((state) => state.setSearchDRCValue);

  const setFilteredDRCs = useDrStore((state) => state.setFilteredDRCs);

  // initialize ref for search input
  const searchValueRef = useRef(
    null
  ) as unknown as MutableRefObject<HTMLInputElement>;

  // set focus whenever filtered drs change
  useEffect(() => {
    searchValueRef.current.focus();
  }, [filteredDRCs]);

  // search
  const onSearch = (event: FormEvent<HTMLInputElement>) => {
    // get the current value of the search input
    const value = event.currentTarget.value;

    // create an array that will contain the search results
    const filteredResult: Array<DutyResponsibility> = [];

    // loop through dr array and filter according to dr description
    allDRCPool.filter((dr: DutyResponsibility) => {
      // check if there is a match
      if (dr.description.match(new RegExp(value, 'i'))) {
        // insert the matching description inside the filtered result
        filteredResult.push(dr);
      }
    });
    // set search value to current value of the search input
    setSearchDRCValue(value);

    // update the state of the filtered DRs
    setFilteredDRCs(filteredResult);
  };

  const onClearSearch = () => {
    // set focus on the search input
    searchValueRef.current.focus();

    // set the search value back to default
    setSearchDRCValue('');

    // set filtered positions back to default
    // setFilteredDRCs(allDRCPool);

    // set filtered dr back to the current core pool
    setFilteredDRCs(allDRCPool);
  };

  useEffect(() => {
    setSearchDRCValue('');
    // setCheckedDRCs({ core: [], support: [] });

    // setFilteredDRCs(allDRCPool);
  }, []);

  return (
    <>
      <div className="grid grid-cols-5 mb-5">
        <section className="col-span-2">
          <div className="flex justify-between px-3 mb-1 text-sm">
            <p className="font-medium text-gray-500 uppercase">{type}</p>
            {type === 'core' && (
              <p className="text-gray-600">
                {checkedDRCs.core.length} out of {allDRCPool.length} items
                selected
              </p>
            )}
            {type === 'support' && (
              <p className="text-gray-600">
                {checkedDRCs.support.length} out of {allDRCPool.length} items
                selected
              </p>
            )}
          </div>
          <div className="relative px-3 mt-2 mb-5">
            <HiOutlineSearch className="absolute mt-[0.9rem] ml-3 h-[1.25rem] w-[1.25rem] text-gray-500" />
            <input
              ref={searchValueRef}
              value={searchDRCValue}
              onChange={(event) => onSearch(event)}
              type="text"
              className="w-full py-3 pl-10 pr-12 border-gray-200 rounded"
              placeholder="Search for a position"
            ></input>
            {searchDRCValue !== '' ? (
              <>
                <button
                  className="absolute -right-0 mr-7 focus:outline-none"
                  onClick={onClearSearch}
                >
                  <HiXCircle className="w-6 h-6 mt-3 transition-colors ease-in-out text-slate-300 hover:text-slate-400" />
                </button>
              </>
            ) : null}
          </div>

          <div className="h-[28rem] overflow-y-scroll">
            {filteredDRCs.length === 0 ? (
              <div className="flex justify-center h-full pt-5 text-center">
                <h5 className="text-2xl font-medium text-gray-300">{`No results found for '${searchDRCValue}'`}</h5>
              </div>
            ) : (
              // <AllPositionsList />
              <AllDRsList type={type} />
            )}
          </div>
        </section>
        <section className="col-span-3 max-h-[34rem] bg-slate-50 bg-opacity-50 px-5 pt-5">
          {(type === 'core' && checkedDRCs.core.length === 0) ||
          (type === 'support' && checkedDRCs.support.length === 0) ? (
            <>
              <div className="flex flex-col items-center justify-center w-full h-full gap-5">
                <UndrawSelecting width={250} height={250} />
                <h1 className="text-2xl text-gray-300">
                  Select at least 1 duty & responsibility to proceed.
                </h1>
              </div>
            </>
          ) : (type === 'core' && checkedDRCs.core.length > 0) ||
            (type === 'support' && checkedDRCs.support.length > 0) ? (
            <>
              <div className="h-[28rem] w-full overflow-y-scroll px-2 pt-1">
                <SelectedDRCard />
              </div>
            </>
          ) : null}
        </section>
      </div>
    </>
  );
};
