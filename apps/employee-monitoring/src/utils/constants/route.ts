type Path = {
  name: string;
  path: string;
};

export const Paths = [
  '/dashboard', //0
  '/employees', //1
  '/monitoring/leave-applications', //2
  '/monitoring/travel-orders', // 3
  '/monitoring/trainings-and-seminars', // 4
  '/monitoring/overtime', // 5
  '/monitoring/pass-slips', //6
  '/maintenance/daily-time-record', // 7
  '/maintenance/leave-benefits/recurring', // 8
  '/maintenance/leave-benefits/cumulative', // 9
  '/maintenance/leave-benefits/special', //10
  '/maintenance/events/holidays', // 11
  '/maintenance/events/work-suspensions', // 12
  '/maintenance/overtime', // 13
  '/maintenance/pass-slip', // 14
  '/maintenance/schedules/office', // 15
  '/maintenance/schedules/field', // 16
  '/maintenance/schedules/pumping-station', // 17
  '/monitoring/scheduling-sheet/office', // 18
  '/monitoring/scheduling-sheet/field', // 19
  '/monitoring/scheduling-sheet/station', // 20
  '/settings/custom-groups', //21
  '/monitoring/leave/leave-cancellations', //22
  '/settings/modules', // 23
  '/settings/users', // 24
  '/settings/officer-of-the-day', // 25
  '/settings/system-logs', // 26
];

export const UpdatedPaths: Array<Path> = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Employees', path: '/employees' },
  { name: 'Leave Applications', path: '/monitoring/leave-applications' },
  { name: 'Travel Orders', path: '/monitoring/travel-orders' },
  {
    name: 'Trainings and Seminars',
    path: '/monitoring/trainings-and-seminars',
  },
  { name: 'Overtime Monitoring', path: '/monitoring/overtime' },
  { name: 'Pass Slips Monitoring', path: '/monitoring/pass-slips' },
  { name: 'Daily Time Record', path: '/maintenance/daily-time-record' },
  {
    name: 'Recurring Leave Benefit',
    path: 'maintenance/leave-benefits/recurring',
  },
  {
    name: 'Cumulative Leave Benefit',
    path: 'maintenance/leave-benefits/cumulative',
  },
  {
    name: 'Special Leave Benefit',
    path: 'maintenance/leave-benefits/special',
  },
  {
    name: 'Holidays',
    path: 'maintenance/events/holidays',
  },
  {
    name: 'Work Suspensions',
    path: 'maintenance/events/work-suspensions',
  },
  {
    name: 'Overtime Maintenance',
    path: 'maintenance/overtime',
  },
  {
    name: 'Pass Slips Maintenance',
    path: 'maintenance/pass-slips',
  },
  {
    name: 'Office Schedules Maintenance',
    path: 'maintenance/schedules/office',
  },
  {
    name: 'Field Schedules Maintenance',
    path: 'maintenance/schedules/field',
  },
  {
    name: 'Pumping Station Schedules Maintenance',
    path: 'maintenance/schedules/pumping-station',
  },
];
