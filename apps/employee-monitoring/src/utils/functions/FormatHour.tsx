function UseFormatHour(value: number | string) {
  if (value !== null) return parseFloat(`${value}`).toFixed(2);
  else return '-';
}

export default UseFormatHour;
