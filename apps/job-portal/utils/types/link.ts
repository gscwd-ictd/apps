import React from 'react';

export interface MyLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  linkTo: string;
  children: React.ReactNode;
}
