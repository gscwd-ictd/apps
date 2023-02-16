import { isEmpty } from 'lodash';
import { FunctionComponent } from 'react';

type SearchBoxProps = {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  placeholder?: string;
  fluid?: boolean;
};

export const SearchBox: FunctionComponent<SearchBoxProps> = ({
  searchValue,
  setSearchValue,
  fluid = false,
  placeholder = 'Search by name',
}) => {
  return (
    <div className="flex items-center ">
      <span className="z-50">
        {/* <MySearchIcon size={14} /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-3 h-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </span>
      <input
        className={`rounded-full min-w-[2rem] ${
          fluid ? 'w-full' : 'max-w-[24rem]'
        } h-[2rem] -mx-6 outline-none border border-gray-300 px-10 text-xs`}
        value={searchValue}
        placeholder={placeholder}
        onChange={(e: any) => setSearchValue(e.target.value)}
      />
      {!isEmpty(searchValue) ? (
        <span
          onClick={() => setSearchValue('')}
          className="hover:cursor-pointer"
        >
          {/* <MyXIcon size={14} /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-3 h-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>
      ) : null}
    </div>
  );
};
