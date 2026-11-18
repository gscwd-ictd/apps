export type OrgLevel = 'office' | 'department' | 'division';
export type ChartType = 'tardiness' | 'undertime' | 'leave' | 'lwop' | 'pass-slip' | 'tlc' | 'overtime';

/** GET /stats/charts/:type */
export type OrgCount = { orgId: string; orgCode: string; orgName: string; category: string | null; count: number };
/** GET /stats/charts/:type/employees */
export type EmployeeCount = {
  employeeId: string;
  companyId: string;
  fullName: string;
  orgName: string;
  category: string | null;
  count: number;
};

export type ChartTabConfig = {
  type: ChartType;
  tab: string;
  /** what is counted, e.g. "Tardiness" -> "No. of Tardiness" */
  unit: string;
  /** clicking a bar opens the per-employee tally of that org */
  clickModal?: boolean;
  /** table of the employees with the highest count, below the chart */
  topTable?: boolean;
  /** stacked bars per category (leave type / pass slip type) */
  stacked?: boolean;
  /** categories with short labels; the top table can be sorted per category */
  categories?: { value: string; label: string }[];
  note?: string;
};

export const PASS_SLIP_CATEGORIES = [
  { value: 'Personal Business', label: 'PB' },
  { value: 'Official Business', label: 'OB' },
  { value: 'Half Day', label: 'Half Day' },
  { value: 'Undertime', label: 'Undertime' },
  { value: 'Wellness Pass', label: 'Wellness Pass' },
];

export const CHART_TABS: ChartTabConfig[] = [
  { type: 'tardiness', tab: 'Tardiness', unit: 'Tardiness', clickModal: true, note: 'Days with a tardiness deduction.' },
  { type: 'undertime', tab: 'Undertimes', unit: 'Undertime', clickModal: true, note: 'Days with an undertime deduction.' },
  {
    type: 'leave',
    tab: 'Leave Type Distribution',
    unit: 'Leave Applications',
    stacked: true,
    note: 'Approved leave applications per leave type (Leave Without Pay excluded).',
  },
  {
    type: 'lwop',
    tab: 'LWOP Applications',
    unit: 'LWOP Applications',
    topTable: true,
    note: 'Approved Leave Without Pay applications.',
  },
  {
    type: 'pass-slip',
    tab: 'Pass Slip Type Distribution',
    unit: 'Pass Slips',
    stacked: true,
    clickModal: true,
    topTable: true,
    categories: PASS_SLIP_CATEGORIES,
    note: 'Approved pass slips per type. Click a bar to see the employees for that pass slip type.',
  },
  {
    type: 'tlc',
    tab: 'Time Log Corrections',
    unit: 'Time Log Corrections',
    topTable: true,
    note: 'Time log correction requests.',
  },
  {
    type: 'overtime',
    tab: 'Overtime',
    unit: 'Overtime Accomplishments',
    clickModal: true,
    topTable: true,
    note: 'Overtime accomplishments approved by the manager.',
  },
];

export const ORG_LEVELS: { value: OrgLevel; label: string }[] = [
  { value: 'office', label: 'Office' },
  { value: 'department', label: 'Department' },
  { value: 'division', label: 'Division' },
];

/** first color = the dashboard tardiness chart color */
export const CHART_COLORS = [
  '77, 164, 218',
  '245, 158, 11',
  '16, 185, 129',
  '239, 68, 68',
  '139, 92, 246',
  '236, 72, 153',
  '20, 184, 166',
  '249, 115, 22',
  '99, 102, 241',
  '132, 204, 22',
  '100, 116, 139',
  '234, 179, 8',
  '6, 182, 212',
  '168, 85, 247',
  '244, 63, 94',
  '34, 197, 94',
  '59, 130, 246',
  '217, 119, 6',
  '107, 114, 128',
  '190, 24, 93',
];

export const selectClass =
  'rounded-lg bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:cursor-pointer outline-none text-xs text-gray-900 h-[2.5rem] p-2.5';

export const excelButtonClass =
  'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed';
