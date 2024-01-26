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
  options: SelectOption[];
  label: string;
  id: string;
  disabled?: boolean;
} & (SingleSelectProps | MultipleSelectProps);

export function MySelectList({
  multiple,
  value,
  onChange,
  id,
  label,
  disabled = false,
  options,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
    return multiple
      ? value.some((v) => v.value === option.value)
      : option === value;
  };

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

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
  }, [isOpen, highlightedIndex, options]);

  return (
    <div className="flex flex-col w-full">
      <label
        htmlFor={id}
        className="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-800"
      >
        {label}
      </label>

      <Popover.Root>
        <Popover.Trigger>
          <div
            id={id}
            ref={containerRef}
            tabIndex={0}
            className="flex relative w-full bg-gray-50 border border-gray-300/90 rounded-lg h-[2.5rem] justify-between items-center gap-2 p-2 outline-none focus:border focus:border-blue-600"
          >
            <span className="flex text-xs text-left text-gray-700 ">
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
                        <div className="flex items-center gap-1 py-0.5 px-2 text-xs text-white bg-blue-400 border rounded hover:cursor-grab hover:bg-red-400 border-gray-300/90">
                          {v.label}
                          <span className="flex text-sm text-white">
                            &times;
                          </span>
                        </div>
                      </span>
                    ))
                : multiple === false
                ? value.label
                : null}
            </span>
            <div className="flex items-center gap-2">
              <div
                className="flex px-2 text-xl text-gray-500 rounded hover:text-white hover:bg-red-400"
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
                  isOpen ? 'rotate-180 transition-all' : ''
                }`}
              >
                <ChevronDownIcon size={20} type={undefined} />
              </span>
            </div>
          </div>
        </Popover.Trigger>

        <Popover.Content
          sideOffset={5}
          avoidCollisions={true}
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          {/* <ul
            className={`${
              isOpen ? 'block' : 'hidden'
            } border absolute  rounded  max-h-[12em] bg-white z-50 overflow-y-auto w-full left-0 top-[calc(100%+.25em)] `}
          > */}
          <ul className="border  rounded  max-h-[10em] bg-white z-50 overflow-y-auto w-full">
            {options.map((option, index) => (
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(option);
                }}
                key={option.value}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-2 py-1 text-xs  cursor-pointer select-none   ${
                  isOptionSelected(option) && index === highlightedIndex
                    ? 'bg-blue-100 hover:text-white text-gray-500  hover:bg-red-400 hover hover:cursor-grab '
                    : !isOptionSelected(option) && index === highlightedIndex
                    ? 'hover:bg-blue-600 hover:text-white'
                    : isOptionSelected(option) && index !== highlightedIndex
                    ? 'bg-blue-100 text-gray-500'
                    : 'text-gray-700'
                }

              `}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
