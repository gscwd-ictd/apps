import { Dispatch, FunctionComponent, SetStateAction, useContext } from 'react';
import { HiCheck, HiStop } from 'react-icons/hi';

export type TabType = {
  title: string;
  nodeText: any;
  tabIndex: number;
};

type FormWizardProps = {
  selectedTab: number;
  setSelectedTab: any;
  tabsLength: number;
  tabs: Array<TabType>;
  onClick?: any;
};

type FormNodeProps = {
  title: string;
  nodeText: string;
  width?: number;
  index: number;
  selected: boolean;
  onClick?: any;
  // setSelected: Dispatch<SetStateAction<boolean>>
  isDone?: boolean;
  startingIndex?: boolean;
  endingIndex?: boolean;
};

export const FormWizard: FunctionComponent<FormWizardProps> = ({
  selectedTab,
  setSelectedTab,
  onClick,
  tabsLength,
  tabs,
}) => {
  return (
    <>
      <div className="flex">
        {tabs.map((tab: TabType) => {
          const { nodeText, title, tabIndex } = tab;
          return (
            <div key={tabIndex}>
              <FormNode
                title={title}
                nodeText={nodeText}
                index={tabIndex}
                isDone={tabIndex < selectedTab ? true : false}
                selected={selectedTab === tabIndex ? true : false}
                startingIndex={tabIndex - 1 === 0 ? true : false}
                endingIndex={tabIndex === tabsLength ? true : false}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};
export const FormNode: FunctionComponent<FormNodeProps> = ({
  title = 'something',
  nodeText,
  index,
  width = 28,
  onClick,
  selected = false,
  startingIndex = false,
  endingIndex = false,
  isDone = false,
}) => {
  return (
    <>
      <div>
        <main className={`flex flex-col `}>
          <div
            className={`flex items-center sm:w-[5rem] md:w-[5rem] lg:w-[8rem]`}
          >
            <section
              className={`z-0 h-[0.25rem] w-[80%]  ${
                isDone || selected ? `bg-indigo-700` : `bg-gray-300`
              }   border-indigo-400 ${
                startingIndex ? `invisible` : `visible`
              } `}
            />
            <button
              tabIndex={-1}
              onClick={onClick}
              className={`z-20 -mx-2 h-[1rem] w-[1rem] select-none  hover:cursor-default sm:h-[1rem] sm:w-[1rem] lg:h-[2rem] lg:w-[2rem]  ${
                selected
                  ? `border-indigo-300 bg-indigo-400  `
                  : isDone
                  ? `border border-indigo-700 bg-indigo-700`
                  : `border border-gray-300 bg-gray-100`
              } shrink-0 rounded-full`}
            >
              <span
                className={`flex select-none flex-row justify-center justify-items-center text-xs  font-semibold ${
                  isDone || selected ? 'text-white' : 'text-gray-400'
                }`}
              >
                {isDone ? <HiCheck /> : nodeText}
              </span>
            </button>

            <section
              className={`z-10 h-[0.25rem] w-[80%]  ${
                isDone ? `bg-indigo-700` : `bg-gray-300`
              } ${endingIndex ? `invisible` : `visible`}  `}
            />
          </div>
          <div
            className={`flex justify-center pb-1 sm:w-[5rem] md:w-[5rem] lg:w-[8rem]`}
          >
            <p className="w-[80%] select-none truncate px-1 text-center text-xs font-light text-black sm:w-full sm:whitespace-nowrap  lg:w-[80%] lg:whitespace-normal">
              {title}
            </p>
          </div>
        </main>
      </div>
    </>
  );
};
