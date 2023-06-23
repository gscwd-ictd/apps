import { isEmpty } from 'lodash';

type QuestionCardProps = {
  cols?: number;
  children: React.ReactNode | React.ReactNode[];
  mainQuestion?: string;
};

type LabelAnswerProps = {
  question: string;
  answer: any;
  details1: any;
  details2?: any;
  cols?: number;
  children?: React.ReactNode | React.ReactNode[];
};

export const CardQuestion = ({
  cols = 4,
  children,
  mainQuestion,
}: QuestionCardProps): JSX.Element => {
  return (
    <>
      <div
        className={`grid grid-cols-${cols} mb-0 rounded bg-white hover:bg-indigo-100  shadow-sm border shadow-slate-200`}
      >
        <div className="p-5 rounded peer col-span-full bg-inherit">
          {mainQuestion ? (
            <div className={`col-span-2 text-slate-600 `}>{mainQuestion}</div>
          ) : null}
          {children}
        </div>
      </div>
    </>
  );
};

export const LabelQNA = ({
  question = 'Question Here',
  answer = 'Answer Here',
  details1 = 'Details 1 Here',
  details2,
  cols = 1,
  children,
}: LabelAnswerProps): JSX.Element => {
  return (
    <>
      <div className={`flex grid-cols-${cols} mt-5 min-w-fit  `}>
        <p className={`col-span-1 mt-0 w-[50%] pr-10 text-slate-600`}>
          {question}
        </p>
        <p className={`col-span-1 mt-0 w-[16%]`}>{answer}</p>
        <p
          className={`col-span-1 mt-0 w-[${
            !isEmpty(details2) ? '16%' : '25%'
          }]`}
        >
          {details1}
        </p>
        {!isEmpty(details2) ? (
          <p className={`col-span-1 mt-10 w-[16%]`}>{details2}</p>
        ) : null}

        {children}
      </div>
    </>
  );
};
