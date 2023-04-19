/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Publication } from 'apps/portal/src/types/publication.type';
import { FormEvent, MutableRefObject, useEffect, useRef } from 'react';
import { HiOutlineSearch, HiXCircle } from 'react-icons/hi';
import { useAppEndStore } from '../../../store/endorsement.store';
import { AllPublicationList } from './AllPublicationList';

export const AppEndSelectPublication = () => {
  const {
    publicationList,
    filteredPublicationList,
    searchValue,
    modal,
    setSearchValue,
    setFilteredPublicationList,
  } = useAppEndStore((state) => ({
    publicationList: state.publicationList,
    filteredPublicationList: state.filteredPublicationList,
    searchValue: state.searchValue,
    setSearchValue: state.setSearchValue,
    setFilteredPublicationList: state.setFilteredPublicationList,
    modal: state.modal,
  }));

  // initialize ref for search input
  const searchRef = useRef(
    null
  ) as unknown as MutableRefObject<HTMLInputElement>;

  // on search function used for filtering positions
  const onSearch = (event: FormEvent<HTMLInputElement>) => {
    // get the current value of the search input
    const value = event.currentTarget.value;

    // create an array that will contain the search results
    const filteredResult: Array<Publication> = [];

    // loop through publications array and filter according to ...
    publicationList.filter((publication: Publication) => {
      // check if there is a match
      if (
        publication.positionTitle.match(new RegExp(value, 'i')) ||
        publication.itemNumber.match(new RegExp(value, 'i')) ||
        publication.placeOfAssignment.match(new RegExp(value, 'i'))
      ) {
        // insert the matching position inside the filtered result
        filteredResult.push(publication);
      }
    });

    // set search value to current value of the search input
    setSearchValue(value);

    // update the state of the filtered positions
    setFilteredPublicationList(filteredResult);
  };

  // clear search
  const onClearSearch = () => {
    // set focus on the search input
    searchRef.current.focus();

    // set the search value back to default
    setSearchValue('');

    // set the filtered publications back to default
    setFilteredPublicationList(publicationList);
  };

  // set the default values
  useEffect(() => {
    if (modal.page === 1) {
      // set the search value to default
      setSearchValue('');

      // set the filtered publication list from publication list
      setFilteredPublicationList(publicationList);
    }
  }, [modal.page]);

  return (
    <>
      <div className="flex flex-col w-full mb-5">
        <section>
          <div className="flex justify-end px-3 mb-1 text-sm">
            <p className="text-gray-600">
              {filteredPublicationList.length > 0 &&
                `${filteredPublicationList.length} ${
                  filteredPublicationList.length === 1
                    ? 'endorsement'
                    : filteredPublicationList.length > 1
                    ? 'endorsements'
                    : ''
                } found`}{' '}
            </p>
          </div>
          <div className="relative mt-2 mb-5">
            <div className="relative px-3 mt-2 mb-5">
              <HiOutlineSearch className="absolute mt-[0.9rem] ml-3 h-[1.25rem] w-[1.25rem] text-gray-500" />
              <input
                ref={searchRef}
                value={searchValue}
                onChange={(event) => onSearch(event)}
                type="text"
                className="w-full py-3 pl-10 pr-12 border-gray-200 rounded"
                placeholder="Search for a position"
              />
              {searchValue !== '' ? (
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
            {/* <HiOutlineSearch className="absolute mt-[0.9rem] ml-3 h-[1.25rem] w-[1.25rem] text-gray-500" />
                        <input className="w-full py-3 pl-10 pr-12 border-gray-200 rounded" placeholder="Seach for a publication by position title" type="text" /> */}
            <div className="min-h-[9.5rem] max-h-[36rem]  overflow-y-auto">
              {filteredPublicationList.length > 0 ? (
                <AllPublicationList />
              ) : (
                <>
                  <div className="flex justify-center w-full h-full text-3xl font-medium text-gray-600 place-items-center justify-items-center">
                    NO ENDORSEMENTS FOUND
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
