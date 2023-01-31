import React, { FunctionComponent } from 'react';

type Crumb = {
  layerNo: number;
  layerText: string;
  path: string;
};

type BreadCrumbsProps = {
  title: string;
  crumbs?: Array<Crumb>;
};

export const BreadCrumbs: FunctionComponent<BreadCrumbsProps> = ({
  crumbs = [],
  title,
}) => {
  return (
    <div className="flex justify-between w-full h-16 px-5 bg-inherit ">
      <div className="flex items-center w-full h-full font-semibold text-gray-700 uppercase">
        {title}
      </div>
      <div className="flex justify-end w-full gap-2">
        <>
          <a
            className="flex items-center h-full text-xs text-gray-900 select-none"
            href="/"
          >
            {crumbs.length === 0 ? 'Dashboards' : 'Dashboard'}
          </a>
        </>

        {crumbs.length > 0
          ? crumbs.map((crumb, index) => {
              return (
                <React.Fragment key={index}>
                  <span className="flex items-center h-full text-xs text-gray-400">
                    /
                  </span>
                  {crumb.path === '' ? (
                    <div className="flex items-center h-full text-xs text-gray-600 select-none">
                      {crumb.layerText}
                    </div>
                  ) : (
                    <a
                      className={`flex items-center h-full text-xs text-gray-600 select-none`}
                      href={crumb.path}
                    >
                      {crumb.layerText}
                    </a>
                  )}
                </React.Fragment>
              );
            })
          : null}
      </div>
    </div>
  );
};
