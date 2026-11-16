/** Dates for schedules must be in an actual year: last year, this year or next year (typo years like 0026 are refused). */
export const actualYearMinDate = () => `${new Date().getFullYear() - 1}-01-01`;
export const actualYearMaxDate = () => `${new Date().getFullYear() + 1}-12-31`;
