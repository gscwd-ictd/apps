import { FunctionComponent } from 'react';

type AlertDescProps = {
  children: React.ReactNode | React.ReactNode[];
};

export const AlertDesc: FunctionComponent<AlertDescProps> = ({ children }): JSX.Element => {
  return (
    <div>
      <p className="text-lg font-medium">Confirm the action</p>
      <hr className="mb-4" />
      <p className="font-light text-gray-700">{children}</p>
      {/* <hr className="mt-4" /> */}
    </div>
  );
};
