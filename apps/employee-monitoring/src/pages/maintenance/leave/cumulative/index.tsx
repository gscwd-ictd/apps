import { Button, Modal } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { CumulativePageFooter } from 'apps/employee-monitoring/src/components/sidebar-items/maintenance/leave/cumulative/Footer';
import { CumulativePageHeader } from 'apps/employee-monitoring/src/components/sidebar-items/maintenance/leave/cumulative/Header';
import { Leave } from '../../../../../../../libs/utils/src/lib/types/leave.type';
import React, { useEffect, useState } from 'react';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';

type Distribution = {
  label: string;
  value: string;
};

const cumulativeLeaves: Array<Leave> = [
  {
    leaveName: 'Vacation Leave',
    creditDistribution: 'Monthly',
    accumulatedCredits: 1.25,
    isMonetizable: true,
    canBeCarriedOver: true,
    status: 'active',
    actions: '',
  },
  {
    leaveName: 'Sick Leave',
    creditDistribution: 'Monthly',
    accumulatedCredits: 1.25,
    isMonetizable: true,
    canBeCarriedOver: true,
    status: 'active',
    actions: '',
  },
];

// mock
const distributionSelection: Array<Distribution> = [
  { label: '--None selected--', value: '' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
];

export default function Index() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [action, setAction] = useState<string>('');
  const [leaves, setLeaves] = useState<Array<Partial<Leave>>>([]);
  const [leaveForEdit, setLeaveForEdit] = useState<Partial<Leave>>(
    {} as Partial<Leave>
  );
  const [leaveModalIsOpen, setLeaveModalIsOpen] = useState<boolean>(false);

  const editAction = (leave: Partial<Leave>) => {
    setAction('update');
    setLeaveForEdit(leave);
    setLeaveModalIsOpen(true);
  };

  const closeAction = () => {
    setLeaveModalIsOpen(false);
  };

  useEffect(() => {
    setLeaves(cumulativeLeaves);
  }, []);

  return (
    <div className="min-h-[100%] min-w-full">
      <BreadCrumbs
        title="Cumulative Leave"
        crumbs={[
          {
            layerNo: 1,
            layerText: 'Cumulative Leave Maintenance',
            path: '',
          },
        ]}
      />
      <Modal
        open={leaveModalIsOpen}
        setOpen={setLeaveModalIsOpen}
        steady
        size="lg"
      >
        <Modal.Header>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600">Edit</span>
            <button
              className="w-[1.5rem] h-[1.5rem] items-center text-center text-white bg-gray-400 rounded-full"
              type="button"
              onClick={closeAction}
            >
              x
            </button>
          </div>
        </Modal.Header>
        <hr />
        <Modal.Body>
          <div className="w-full mt-5">
            <div className="flex flex-col w-full gap-5">
              <LabelInput
                id={'cumulativeName'}
                label={'Leave Name'}
                value={leaveForEdit.leaveName}
                onChange={(e) =>
                  setLeaveForEdit({
                    ...leaveForEdit,
                    leaveName: e.target.value,
                  })
                }
              />

              <div className="flex flex-col">
                <label htmlFor="cumulativeDistribution">
                  <span className="text-xs text-gray-700">Distribution</span>
                </label>
                <select
                  id="cumulativeDistribution"
                  className="rounded border active:border-none border-gray-300 w-full outline-none text-xs text-gray-600 h-[2.25rem] px-4"
                  value={leaveForEdit.creditDistribution}
                >
                  {distributionSelection &&
                    distributionSelection.map((dist) => {
                      return <option key={dist.value}>{dist.label}</option>;
                    })}
                </select>
              </div>

              <LabelInput
                id="cumulativeAccCredits"
                label="Credits"
                type="number"
                value={leaveForEdit.accumulatedCredits}
                onWheel={(e) => e.currentTarget.blur()}
                onChange={(e) =>
                  setLeaveForEdit({
                    ...leaveForEdit,
                    accumulatedCredits: e.target.valueAsNumber,
                  })
                }
              />

              {/**Monetizable */}
              <div className="flex flex-col">
                <label htmlFor="cumulativeIsMonetizable">
                  <span className="text-xs text-gray-700">Monetizable?</span>
                </label>
                <select
                  id="cumulativeIsMonetizable"
                  className="rounded border active:border-none border-gray-300 w-full outline-none text-xs text-gray-600 h-[2.25rem] px-4"
                  value={leaveForEdit.isMonetizable ? 'yes' : 'no'}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/**Carried Over */}
              <div className="flex flex-col">
                <label htmlFor="cumulativeCanBeCarriedOver">
                  <span className="text-xs text-gray-700">
                    Can be carried over?
                  </span>
                </label>
                <select
                  id="cumulativeCanBeCarriedOver"
                  className="rounded border active:border-none border-gray-300 w-full outline-none text-xs text-gray-600 h-[2.25rem] px-4"
                  value={leaveForEdit.canBeCarriedOver ? 'yes' : 'no'}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/**Active */}
              <div className="flex flex-col">
                <label htmlFor="cumulativeStatus">
                  <span className="text-xs text-gray-700">Status</span>
                </label>
                <select
                  id="cumulativeStatus"
                  className="rounded border active:border-none border-gray-300 w-full outline-none text-xs text-gray-600 h-[2.25rem] px-4"
                  value={leaveForEdit.status}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button variant="info">
              <span className="text-xs font-normal">Update</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <div className="mx-5">
        <Card title={''}>
          {/** Top Card */}
          <div className="flex flex-col w-full h-full">
            <CumulativePageHeader />
            <div className="w-full px-5 mt-5">
              <table className="w-full">
                <thead>
                  <tr className="text-xs border-b-2 text-slate-700">
                    <th className="font-semibold w-[1/7] text-left ">
                      Leave Name
                    </th>

                    <th className="font-semibold w-[1/7] text-left">
                      Distribution
                    </th>
                    <th className="font-semibold w-[1/7] text-left">
                      Accumulated Credits
                    </th>
                    <th className="font-semibold w-[1/7] text-left">
                      Monetizable
                    </th>
                    <th className="font-semibold w-[1/7] text-left">
                      Carried Over
                    </th>
                    <th className="font-semibold w-[1/7] text-left">Status</th>
                    <th className="font-semibold w-[1/7] text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide">
                  {leaves &&
                    leaves.map((leave, index) => {
                      return (
                        <React.Fragment key={index}>
                          <tr className="h-[4rem] text-gray-700">
                            <td className="w-[1/7] text-xs ">
                              {leave.leaveName}
                            </td>

                            <td className="w-[1/7] text-xs">
                              {leave.creditDistribution}
                            </td>

                            <td className="w-[1/7] text-xs">
                              {leave.accumulatedCredits}
                            </td>
                            <td className="w-[1/7] text-xs">
                              {leave.isMonetizable === true ? 'Yes' : 'No'}
                            </td>
                            <td className="w-[1/7] text-xs">
                              {leave.canBeCarriedOver === true ? 'Yes' : 'No'}
                            </td>
                            <td className="w-[1/7] text-xs uppercase">
                              {leave.status}
                            </td>
                            <td className="w-[1/7]">
                              <div className="flex justify-center w-full gap-2">
                                <Button
                                  variant="info"
                                  onClick={() => editAction(leave)}
                                >
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
            <CumulativePageFooter />
          </div>
        </Card>
      </div>
    </div>
  );
}
