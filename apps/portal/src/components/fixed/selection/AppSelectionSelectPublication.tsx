import { Publication } from 'apps/portal/src/types/publication.type';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { FormEvent, MutableRefObject, useEffect, useRef } from 'react';
import { HiOutlineSearch, HiXCircle } from 'react-icons/hi';
import { useAppSelectionStore } from '../../../store/selection.store';
import { AllSelectionPublicationList } from './AllSelectionPublicationList';
import useSWR from 'swr';

export const AppSelectionSelectPublication = () => {
  // initialize ref for search input
  const searchRef = useRef(
    null
  ) as unknown as MutableRefObject<HTMLInputElement>;

  const {
    filteredValue,
    publicationList,
    filteredPublicationList,
    setFilteredValue,
    setFilteredPublicationList,
    getPublicationList,
    getPublicationListSuccess,
    getPublicationListFail,
  } = useAppSelectionStore((state) => ({
    filteredValue: state.filteredValue,
    loadingPublicationList: state.loading.loadingPublicationList,
    errorPublicationList: state.errors.errorPublicationList,
    publicationList: state.publicationList,
    filteredPublicationList: state.filteredPublicationList,
    setFilteredValue: state.setFilteredValue,
    setFilteredPublicationList: state.setFilteredPublicationList,
    getPublicationList: state.getPublicationList,
    getPublicationListSuccess: state.getPublicationListSuccess,
    getPublicationListFail: state.getPublicationListFail,
  }));

  // get api for the list of publications
  const publicationUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/appointing-authority-selection/publications`;

  const {
    data: swrPublications,
    isLoading: swrPublicationIsLoading,
    error: swrPublicationError,
    mutate: mutatePublications,
  } = useSWR(publicationUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrPublicationIsLoading) {
      getPublicationList(swrPublicationIsLoading);
    }
  }, [swrPublicationIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrPublications)) {
      getPublicationListSuccess(swrPublicationIsLoading, swrPublications);
    }

    if (!isEmpty(swrPublicationError)) {
      getPublicationListFail(swrPublicationIsLoading, swrPublicationError);
    }
  }, [swrPublications, swrPublicationError]);

  // on search function used for filtering positions
  const onSearch = (event: FormEvent<HTMLInputElement>) => {
    // get the current value of the search input
    const value = event.currentTarget.value;

    // create an array that will contain the search results
    const filteredResult: Array<Publication> = [];

    // loop through positions array and filter according to position title
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
    setFilteredValue(value);

    // update the state of the filtered publication list
    setFilteredPublicationList(filteredResult);
  };

  // clear search
  const onClearSearch = () => {
    // set focus on the search input
    searchRef.current.focus();

    // set the search value back to default
    setFilteredValue('');

    // set the filtered positions back to default
    setFilteredPublicationList(publicationList);
  };

  // set focus whenever filtered positions change
  useEffect(() => {
    if (!swrPublicationIsLoading) {
      searchRef.current.focus();
    }
  }, [filteredPublicationList, swrPublicationIsLoading]);

  return (
    <>
      <div className="flex flex-col w-full mb-5">
        <section>
          <div className="flex justify-end px-3 mb-1 text-sm">
            <p className="text-gray-600">
              {`${filteredPublicationList.length} ${
                filteredPublicationList.length > 1
                  ? 'publications'
                  : 'publication'
              }`}{' '}
              found
            </p>
          </div>
          <div className="relative mt-2 mb-5">
            <div className="relative px-3 mt-2 mb-5">
              <HiOutlineSearch className="absolute mt-[0.9rem] ml-3 h-[1.25rem] w-[1.25rem] text-gray-500" />
              <input
                ref={searchRef}
                value={filteredValue}
                onChange={(event) => onSearch(event)}
                type="text"
                className="w-full py-3 pl-10 pr-12 border-gray-200 rounded"
                placeholder="Search for a publication"
              />
              {filteredValue !== '' ? (
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
                <AllSelectionPublicationList />
              ) : (
                <>
                  <div className="flex justify-center w-full h-full text-3xl font-medium text-gray-600 place-items-center text-center justify-items-center">
                    NO PUBLICATIONS FOUND
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
