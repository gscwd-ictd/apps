import { ArrowCircleUpSVG } from '../../src/components/fixed/svg/ArrowCircleUp';

export type Tabs = {
  id: string;
  title: string;
  tabIndex: number;
  nodeText: string | JSX.Element;
};

// tab array
export const tabs: Array<Tabs> = [
  { id: 'basicInfo', title: 'Basic Information', tabIndex: 1, nodeText: '1' },
  { id: 'familyInfo', title: 'Family Information', tabIndex: 2, nodeText: '2' },
  { id: 'educInfo', title: 'Education', tabIndex: 3, nodeText: '3' },
  { id: 'eligInfo', title: 'Eligibility', tabIndex: 4, nodeText: '4' },
  { id: 'workExpInfo', title: 'Work Experience', tabIndex: 5, nodeText: '5' },
  { id: 'volWorkExpInfo', title: 'Voluntary Work Experience', tabIndex: 6, nodeText: '6' },
  { id: 'lndInfo', title: 'Learning & Development', tabIndex: 7, nodeText: '7' },
  { id: 'otherInfo', title: 'Other Information', tabIndex: 8, nodeText: '8' },
  { id: 'supportInfo', title: 'Supporting Information', tabIndex: 9, nodeText: '9' },
  { id: 'summaryInfo', title: 'Summary', tabIndex: 10, nodeText: '10' },
  {
    id: 'submitInfo',
    title: 'Submit',
    tabIndex: 11,
    nodeText: <ArrowCircleUpSVG height="full" width="full" className="rounded-full bg-inherit" />,
  },
];

export const tabsHasPds: Array<Tabs> = [
  { id: 'basic', title: 'Basic Information', tabIndex: 1, nodeText: '1' },
  { id: 'familyInfo', title: 'Family Information', tabIndex: 2, nodeText: '2' },
  { id: 'educInfo', title: 'Education', tabIndex: 3, nodeText: '3' },
  { id: 'eligInfo', title: 'Eligibility', tabIndex: 4, nodeText: '4' },
  { id: 'workExpInfo', title: 'Work Experience', tabIndex: 5, nodeText: '5' },
  { id: 'volWorkExpInfo', title: 'Voluntary Work Experience', tabIndex: 6, nodeText: '6' },
  { id: 'lndInfo', title: 'Learning & Development', tabIndex: 7, nodeText: '7' },
  { id: 'otherInfo', title: 'Other Information', tabIndex: 8, nodeText: '8' },
  { id: 'supportInfo', title: 'Supporting Information', tabIndex: 9, nodeText: '9' },
  { id: 'summaryInfo', title: 'Summary', tabIndex: 10, nodeText: '10' },
];
