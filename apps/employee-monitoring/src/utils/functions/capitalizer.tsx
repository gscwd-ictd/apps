// capitalizer
export const useCapitalizer = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};
