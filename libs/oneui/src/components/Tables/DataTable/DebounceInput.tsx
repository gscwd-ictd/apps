import { debounce } from 'lodash';
import React, { useEffect, useState, useMemo } from 'react';

/** Refer to this link for the changes in debounced input https://dmitripavlutin.com/react-throttle-debounce/ */

export const DebouncedInput = ({
  value: initialValue,
  onChange,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  const [value, setValue] = useState(initialValue);

  // setValue if any initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // change handler
  const changeHandler = (event: any) => {
    onChange(event.target.value);
  };

  // debounce
  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 500),
    []
  );

  return <input {...props} onChange={debouncedChangeHandler} />;
};
