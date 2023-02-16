import React, { ReactNode } from 'react';

type ContentBodyProps = {
  children?: ReactNode;
};

export const ContentBody: React.FC<ContentBodyProps> = ({ children }) => {
  return (
    <>
      <main className="w-full h-full mt-14">{children}</main>
    </>
  );
};
