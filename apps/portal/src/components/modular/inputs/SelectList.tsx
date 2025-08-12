/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';

type SelectOption = {
  label: string;
  value: string | number;
};

type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};

type SelectProps = {
  withSearchBar?: boolean;
  selectOpen?: boolean | null;
  options: SelectOption[];
  label: string;
  id: string;
  disabled?: boolean;
  isSelectedHidden?: boolean; //hide currently selected options from drop down list
} & (SingleSelectProps | MultipleSelectProps);

export function MySelectList({
  withSearchBar = false,
  selectOpen = false,
  multiple,
  value,
  onChange,
  id,
  label,
  disabled = false,
  options,
  isSelectedHidden = false,
}: SelectProps) {
  const [customIsOpen, setCustomIsOpen] = useState<boolean>(selectOpen);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchedItem, setSearchedItem] = useState<Array<SelectOption>>([]); //filtered list based on searchInput
  const [searchedInput, setSearchedInput] = useState<string>('');
  const [listToSearch, setListToSearch] = useState<Array<SelectOption>>(options);

  const handleSearchItem = (name: string) => {
    setSearchedInput(name);
    const searchedItem = options.filter((search) => search.label.toLowerCase().includes(name.toLowerCase()));
    setSearchedItem(searchedItem);
  };

  useEffect(() => {
    if (searchedItem.length > 0) {
      //if searchedItem is not empty, set the listToSearch to searchedItem
      setListToSearch(searchedItem);
    } else if (searchedItem.length == 0 && searchedInput.length > 0) {
      //if searchedItem is empty and searchedInput is not empty, set the listToSearch to blank / nothing found on search
      setListToSearch([]);
    } else {
      //all options are available
      setListToSearch(options);
    }
  }, [searchedItem]);

  useEffect(() => {
    setListToSearch(options);
  }, [options]);

  // clear all values inside the input
  const clearOptions = () => {
    multiple ? onChange([]) : onChange(undefined);
  };

  // add the value to the array
  const selectOption = (option: SelectOption) => {
    if (multiple) {
      if (value.some((v) => v.value === option.value)) {
        onChange(value.filter((o) => o.value !== option.value)); //! check this code
      } else {
        onChange([...value, option]);
      }
    } else if (multiple === false) {
      if (option !== value) onChange(option);
    }
  };

  //
  const isOptionSelected = (option: SelectOption) => {
    return multiple ? value.some((v) => v.value === option.value) : option === value;
  };

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    setCustomIsOpen(selectOpen);
  }, [selectOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case 'Enter':
        case 'Space':
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case 'ArrowUp':
        case 'ArrowDown': {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case 'Escape':
          setIsOpen(false);

          break;
      }
    };
    containerRef.current?.addEventListener('keydown', handler);

    return () => {
      containerRef.current?.addEventListener('keydown', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, highlightedIndex, options, containerRef]);

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="block mb-1 text-xs font-medium text-gray-500 dark:text-gray-500">
        {label}
      </label>

      <Popover.Root>
        <Popover.Trigger>
          <div
            id={id}
            ref={containerRef}
            tabIndex={0}
            className="flex w-full bg-white border border-gray-300/90 rounded min-h-[2.25rem] h-18 justify-between items-center gap-2 p-2 outline-none focus:border focus:border-blue-600"
          >
            <span className="grid grid-cols-3 text-md text-left text-gray-500">
              {multiple
                ? value
                    .sort((a, b) => (a.value > b.value ? 1 : -1))
                    .map((v) => (
                      <span
                        className="flex"
                        key={v.value}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          selectOption(v);
                        }}
                      >
                        <div className="flex w-full items-center gap-1 py-0.5 px-2 text-md text-white bg-blue-400 border rounded hover:cursor-grab hover:bg-red-500 border-gray-300/90">
                          {v.label}
                          <span className="flex text-sm text-white">&times;</span>
                        </div>
                      </span>
                    ))
                : multiple === false
                ? value.label
                : null}
            </span>
            <div className="flex items-center gap-2">
              <div
                className="flex px-2 text-xl text-gray-500 rounded hover:text-white hover:bg-red-500"
                // type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearOptions();
                }}
              >
                &times;
              </div>
              <span className="px-2 font-light text-gray-500">|</span>
              <span
                className={`text-gray-600 hover:cursor-pointer px-2 hover:text-gray-800 ${
                  customIsOpen ? 'rotate-180 transition-all' : 'transition-all'
                }`}
              >
                <ChevronDownIcon size={20} type={undefined} />
              </span>
            </div>
          </div>
        </Popover.Trigger>

        <Popover.Content sideOffset={5} avoidCollisions={true} style={{ width: 'var(--radix-popover-trigger-width)' }}>
          {/* <ul
            className={`${
              isOpen ? 'block' : 'hidden'
            } border absolute  rounded  max-h-[12em] bg-white z-50 overflow-y-auto w-full left-0 top-[calc(100%+.25em)] `}
          > */}
          {withSearchBar ? (
            <input
              type="text"
              className="border-slate-300 text-slate-500 h-8 text-md w-full rounded mt-1"
              placeholder="Search"
              onChange={(e) => handleSearchItem(e.target.value)}
              value={searchedInput}
            />
          ) : null}

          <ul className="border rounded  max-h-[12em] bg-white z-50 overflow-y-auto w-full">
            {listToSearch.map((option, index) => (
              <div key={option.value}>
                {isSelectedHidden ? (
                  //hides selected options from list pool
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      selectOption(option);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-2  text-md  cursor-pointer select-none   ${
                      isOptionSelected(option) && index === highlightedIndex
                        ? 'bg-blue-100 hover:text-white text-gray-500  hover:bg-red-500 hover hover:cursor-grab'
                        : !isOptionSelected(option) && index === highlightedIndex
                        ? 'py-1 hover:bg-blue-600 hover:text-white'
                        : isOptionSelected(option) && index !== highlightedIndex
                        ? 'bg-blue-100 text-gray-500'
                        : 'py-1 text-gray-500'
                    }
          
              `}
                  >
                    {isSelectedHidden && isOptionSelected(option) ? null : option.label}
                  </li>
                ) : (
                  //original list view
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      selectOption(option);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-2 py-1 text-md cursor-pointer select-none text-gray-500  ${
                      isOptionSelected(option) && index === highlightedIndex
                        ? 'bg-blue-100 hover:text-white text-gray-500  hover:bg-red-500 hover hover:cursor-grab '
                        : !isOptionSelected(option) && index === highlightedIndex
                        ? 'hover:bg-blue-600 hover:text-white'
                        : isOptionSelected(option) && index !== highlightedIndex
                        ? 'bg-blue-100 text-gray-500'
                        : 'text-gray-500'
                    }
          
              `}
                  >
                    {option.label}
                  </li>
                )}
              </div>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
