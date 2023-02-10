/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
} & (SingleSelectProps | MultipleSelectProps);

export function MySelectList({
  multiple,
  value,
  onChange,
  id,
  label,
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
      <label htmlFor={id} className="text-xs text-gray-700">
        {label}
      </label>

      <div
        id={id}
        ref={containerRef}
        onBlur={() => setIsOpen(false)}
        onClick={() => setIsOpen((prev) => !prev)}
        tabIndex={0}
        className="flex hover:cursor-pointer relative w-full border rounded min-h-[2.25rem] justify-between items-center gap-2 p-2 outline-none focus:border-blue-500"
      >
        <span className="pl-2 text-xs text-gray-700 ">
          {multiple
            ? value.map((v) => (
                <button
                  className="px-2 "
                  key={v.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectOption(v);
                  }}
                >
                  <div className="flex gap-1 p-1 px-2 text-xs border rounded hover:bg-gray-200 border-gray-300/90">
                    {v.label}
                    <span className="flex text-gray-500">&times;</span>
                  </div>
                </button>
              ))
            : multiple === false
            ? value.label
            : null}
        </span>
        <div className="flex items-center gap-2">
          <button
            className="flex px-2 text-gray-500 rounded text-md hover:bg-gray-200"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearOptions();
            }}
          >
            &times;
          </button>
          <span className="px-2 font-light text-gray-500">|</span>
          <span
            className={`text-gray-600 hover:cursor-pointer px-2 hover:bg-gray-200 hover:rounded ${
              isOpen ? 'rotate-180 transition-all' : ''
            }`}
          >
            <ChevronDownIcon size={20} />
          </span>
        </div>
        <ul
          className={`${
            isOpen ? 'block' : 'hidden'
          } border absolute  rounded  max-h-[12em] bg-white z-50 p-2 overflow-y-auto w-full left-0 top-[calc(100%+.25em)] `}
        >
          {options.map((option, index) => (
            <li
              onClick={(e) => {
                e.stopPropagation();
                selectOption(option);
              }}
              key={option.value}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`px-2 py-1 text-xs  cursor-pointer   ${
                isOptionSelected(option)
                  ? 'bg-blue-300 text-white'
                  : 'text-gray-700'
              } ${
                index === highlightedIndex
                  ? 'hover:bg-blue-500 hover:text-white'
                  : ''
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
