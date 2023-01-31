import { Button } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { RecurringPageFooter } from 'apps/employee-monitoring/src/components/sidebar-items/leave/recurring/Footer';
import { RecurringPageHeader } from 'apps/employee-monitoring/src/components/sidebar-items/leave/recurring/Header';
import React from 'react';

type Leave = {
  title: string;
  code: string;
  actions: string;
  status: string;
  distribution: string;
  accumulated_credits: number;
};

const recurringLeaves: Array<Leave> = [
  {
    title: 'Forced Leave',
    code: '001',
    distribution: 'Yearly',
    accumulated_credits: 5,
    status: 'active',
    actions: '',
  },
  {
    title: 'Special Privilege Leave',
    code: '002',
    distribution: 'Yearly',
    accumulated_credits: 3,
    status: 'active',
    actions: '',
  },
];

export default function Index() {
  return (
    <div className="min-h-[100%] w-full">
      <BreadCrumbs
        title="Recurring Leave"
        crumbs={[
          {
            layerNo: 1,
            layerText: 'Recurring Leave Maintenance',
            path: '',
          },
        ]}
      />
      <div className="mx-5">
        <Card title={''}>
          {/** Top Card */}
          <div className="flex flex-col w-full h-full">
            <RecurringPageHeader />
            <div className="w-full px-5 mt-5">
              <table className="w-full">
                <thead>
                  <tr className="text-xs border-b-2 text-slate-700">
                    <th className="font-semibold w-[40%] text-left ">
                      Leave Name
                    </th>
                    <th className="font-semibold w-[20%] text-left">Code</th>
                    <th className="font-semibold w-[20%] text-left">Status</th>
                    <th className="font-semibold w-[20%] text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide">
                  {recurringLeaves &&
                    recurringLeaves.map((leave, index) => {
                      return (
                        <React.Fragment key={index}>
                          <tr className="h-[4rem] font-light">
                            <td className="w-[40%] text-sm ">{leave.title}</td>
                            <td className="w-[20%] text-sm">{leave.code}</td>
                            <td className="w-[20%] text-sm uppercase">
                              {leave.status}
                            </td>
                            <td className="w-[20%]">
                              <div className="flex justify-center w-full gap-2">
                                <Button>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-4 h-4"
                                  >
                                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                                    <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                                  </svg>
                                </Button>
                                <Button variant="danger">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-4 h-4"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <RecurringPageFooter />
          </div>
        </Card>
      </div>
    </div>
  );
}
