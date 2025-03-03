/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @nx/enforce-module-boundaries */
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { PrintButton } from 'apps/employee-monitoring/src/components/buttons/PrintButton';
import { Select, ToastNotification, ListDef } from '@gscwd-apps/oneui';
import { LeaveLedgerTable } from 'apps/employee-monitoring/src/components/tables/LeaveLedgerTable';
import LeaveLedgerAdjModal from 'apps/employee-monitoring/src/components/modal/employees/leave-ledger/LeaveLedgerAdjModal';
import { useLeaveBenefitStore } from 'apps/employee-monitoring/src/store/leave-benefits.store';
import { useLeaveLedgerStore } from 'apps/employee-monitoring/src/store/leave-ledger.store';
import LeaveLedgerPdfModal from 'apps/employee-monitoring/src/components/modal/employees/leave-ledger/LeaveLedgerPdfModal';
import dayjs from 'dayjs';
import { ExcelButton } from 'apps/employee-monitoring/src/components/buttons/ExcelButton';

type Year = { year: string };

export default function Index({ employeeData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // Print modal function
  const [printModalIsOpen, setPrintModalIsOpen] = useState<boolean>(false);

  // adjustment modal function
  const [adjustmentModalIsOpen, setAdjustmentModalIsOpen] = useState<boolean>(false);

  // selected year
  const yearNow = dayjs().format('YYYY');
  const [selectedYear, setSelectedYear] = useState<string>(yearNow);

  const years = [{ year: `${yearNow}` }, { year: `${Number(yearNow) - 1}` }] as Year[];

  //year select
  const yearList: ListDef<Year> = {
    key: 'year',
    render: (info, state) => (
      <div className={`${state.active ? 'bg-indigo-200' : state.selected ? 'bg-slate-200 ' : ''} pl-4 cursor-pointer`}>
        {info.year}
      </div>
    ),
  };

  // set value for year
  const onChangeYear = (year: string) => {
    setSelectedYear(year);
  };

  // zustand store
  const { ErrorLeaveBenefits } = useLeaveBenefitStore((state) => ({
    ErrorLeaveBenefits: state.error.errorLeaveBenefits,
  }));

  // zustand store
  const { ErrorLeaveAdjustment, LeaveLedger } = useLeaveLedgerStore((state) => ({
    LeaveLedger: state.leaveLedger,
    ErrorLeaveAdjustment: state.errorLeaveAdjustment,
  }));

  const toggle = () => setPrintModalIsOpen(!printModalIsOpen);

  // open
  const openAdjustmentModalAction = () => {
    setAdjustmentModalIsOpen(true);
  };

  // close
  const closeAdjustmentModalAction = () => {
    setAdjustmentModalIsOpen(false);
  };

  // Generate excel document for leave ledger
  const exportToExcel = () => {
    const XLSX = require('sheetjs-style');

    const filteredLeaveLedger = LeaveLedger.map(
      ({
        period,
        particulars,
        forcedLeave,
        forcedLeaveBalance,
        vacationLeave,
        vacationLeaveBalance,
        sickLeave,
        sickLeaveBalance,
        specialPrivilegeLeave,
        specialPrivilegeLeaveBalance,
        specialLeaveBenefit,
        specialLeaveBenefitBalance,
        remarks,
      }) => ({
        Period: dayjs(period).format('MM/DD/YYYY'),
        Particulars: particulars,
        ForcedLeave: forcedLeave,
        ForcedLeaveBalance: forcedLeaveBalance,
        VacationLeave: vacationLeave,
        VacationLeaveBalance: vacationLeaveBalance,
        SickLeave: sickLeave,
        SickLeaveBalance: sickLeaveBalance,
        SpecialPrivilegeLeave: specialPrivilegeLeave,
        SpecialPrivilegeLeaveBalance: specialPrivilegeLeaveBalance,
        SpecialLeaveBenefit: specialLeaveBenefit,
        SpecialLeaveBenefitBalance: specialLeaveBenefitBalance,
        Remarks: remarks,
      })
    );

    const wb = XLSX.utils.book_new(); // create new book
    const ws = XLSX.utils.json_to_sheet([]); // create empty sheet

    // add header
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [],
        // [, , , , , , , , , , , ,],
        ['GENERAL SANTOS CITY WATER DISTRICT', , , , , , , , , , , ,],
        ['E. Ferdnandez St., Lagao General Santos City', , , , , , , , , , , ,],
        ['LEAVE LEDGER', , , , , , , , , , , ,],
      ],
      { origin: 'A1' }
    );

    // add employee details
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        ['NAME', `${employeeData.fullName.toUpperCase() || ''}`, , , , , , , , , , ,],
        ['DESIGNATION', `${employeeData.assignment.positionTitle.toUpperCase() || ''}`, , , , , , , , , , ,],
        ['OFFICE', `${employeeData.assignment.officeName || ''}`, , , , , , , , , , ,],
        ['DEPARTMENT', `${employeeData.assignment.departmentName || ''}`, , , , , , , , , , ,],
        ['DIVISION', `${employeeData.assignment.divisionName || ''}`, , , , , , , , , , ,],
      ],
      { origin: 'A7' }
    );

    // add ledger data to empty sheet
    XLSX.utils.sheet_add_json(ws, filteredLeaveLedger, { origin: 'A13' });
    // replace key name to proper header name
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          'PERIOD',
          'PARTICULARS',
          'FORCED LEAVE',
          'FORCED LEAVE BALANCE',
          'VACATION LEAVE',
          'VACATION LEAVE BALANCE',
          'SICK LEAVE',
          'SICK LEAVE BALANCE',
          'SPECIAL PRIVILEGE LEAVE',
          'SPECIAL PRIVILEGE LEAVE BALANCE',
          'SPECIAL LEAVE BENEFIT',
          'SPECIAL LEAVE BENEFIT BALANCE',
          'REMARKS',
        ],
      ],
      { origin: 'A13' }
    );

    // column width
    var wscols = [
      { wch: 13.2 }, // A
      { wch: 23.5 }, // B wrapped text
      { wch: 9 }, // C
      { wch: 9 }, // D
      { wch: 9 }, // E
      { wch: 9 }, // F
      { wch: 9 }, // G
      { wch: 9 }, // H
      { wch: 9 }, // I
      { wch: 9 }, // J
      { wch: 9 }, // K
      { wch: 9 }, // L
      { wch: 25 }, // M wrapped text
    ];
    ws['!cols'] = wscols;

    // STYLING
    const columnLetterArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];

    // document header
    ws['A2'].s = {
      font: {
        sz: 13,
        bold: true,
      },
      alignment: { horizontal: 'center', vertical: 'center' },
    };
    ws['A3'].s = {
      font: {
        sz: 12,
      },
      alignment: { horizontal: 'center', vertical: 'center' },
    };
    ws['A4'].s = {
      font: {
        sz: 13,
        bold: true,
      },
      alignment: { horizontal: 'center', vertical: 'center' },
    };

    // employee details
    ws['B7'].s = {
      font: {
        bold: true,
      },
    };
    ws['B8'].s = {
      font: {
        upperCase: true,
      },
    };

    // table border styling
    const positionCount = filteredLeaveLedger.length + 13; // 13th row is the start of table generation
    for (let x = 13; x <= positionCount; x++) {
      columnLetterArray.map((letter) => {
        if (x === 13) {
          // table header styling
          ws[`${letter + x}`].s = {
            font: {
              sz: 11,
              bold: true,
            },
            alignment: {
              horizontal: 'center',
              vertical: 'center',
              wrapText: true,
            },
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } },
            },
          };
        } else {
          ws[`${letter + x}`].s = {
            font: {
              sz: 11,
            },
            alignment: {
              horizontal: 'center',
              vertical: 'center',
              wrapText: true,
            },
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } },
            },
          };
        }
      });
    }

    // LAST ROW OF TABLE - TOTAL AGGREGATES
    //number of ledger entries + 13 as start of table + 1 as last row
    const lastRowIndex = filteredLeaveLedger.length + 13 + 1;

    // last value of ledger entries
    const lastIndexValue = LeaveLedger[LeaveLedger.length - 1];

    // add to sheet
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          'TOTAL',
          '',
          '',
          `${lastIndexValue.forcedLeaveBalance}`,
          '',
          `${lastIndexValue.vacationLeaveBalance ?? 0}`,
          '',
          `${lastIndexValue.sickLeaveBalance ?? 0}`,
          '',
          `${lastIndexValue.specialPrivilegeLeaveBalance ?? 0}`,
          '',
          `${lastIndexValue.specialLeaveBenefit ?? 0}`,
          '',
        ],
      ],
      {
        origin: `A${lastRowIndex}`,
      }
    );

    // table border
    columnLetterArray.map((letter) => {
      if (letter === 'A') {
        ws[`${letter + lastRowIndex}`].s = {
          font: {
            sz: 11,
            bold: true,
          },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
        };
      } else if (letter === 'D') {
        // forced leave balance
        ws[`${letter + lastRowIndex}`].s = {
          font: {
            sz: 11,
            bold: true,
          },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
          fill: {
            patternType: 'solid',
            fgColor: { rgb: 'FFFECACA' },
          },
        };
      } else if (letter === 'F') {
        // vacantion leave balance
        ws[`${letter + lastRowIndex}`].s = {
          font: {
            sz: 11,
            bold: true,
          },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
          fill: {
            patternType: 'solid',
            fgColor: { rgb: 'FFBBF7D0' },
          },
        };
      } else if (letter === 'H') {
        // sick leave balance
        ws[`${letter + lastRowIndex}`].s = {
          font: {
            sz: 11,
            bold: true,
          },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
          fill: {
            patternType: 'solid',
            fgColor: { rgb: 'FFFED7AA' },
          },
        };
      } else if (letter === 'J') {
        // special privilage leave balance
        ws[`${letter + lastRowIndex}`].s = {
          font: {
            sz: 11,
            bold: true,
          },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
          fill: {
            patternType: 'solid',
            fgColor: { rgb: 'FFA5F3FC' },
          },
        };
      } else if (letter === 'L') {
        // special benefit leave balance
        ws[`${letter + lastRowIndex}`].s = {
          font: {
            sz: 11,
            bold: true,
          },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
          fill: {
            patternType: 'solid',
            fgColor: { rgb: 'FFBFDBFE' },
          },
        };
      } else {
        ws[`${letter + lastRowIndex}`].s = {
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
        };
      }
    });

    // merged columns
    const merge = [
      // Center document header
      { s: { c: 0, r: 1 }, e: { c: 12, r: 1 } },
      { s: { c: 0, r: 2 }, e: { c: 12, r: 2 } },
      { s: { c: 0, r: 3 }, e: { c: 12, r: 3 } },

      // Employee details
      { s: { c: 1, r: 6 }, e: { c: 4, r: 6 } }, // Name
      { s: { c: 1, r: 7 }, e: { c: 4, r: 7 } }, // Designation
      { s: { c: 1, r: 8 }, e: { c: 4, r: 8 } }, // Office
      { s: { c: 1, r: 9 }, e: { c: 4, r: 9 } }, // Department
      { s: { c: 1, r: 10 }, e: { c: 4, r: 10 } }, // Division

      { s: { c: 0, r: positionCount }, e: { c: 1, r: positionCount } }, // TOTAL
    ];
    ws['!merges'] = merge;

    XLSX.utils.book_append_sheet(wb, ws, 'Leave Ledger');
    XLSX.writeFile(wb, `leave_ledger_${employeeData.fullName}_${selectedYear}.xlsx`);
  };

  return (
    <>
      <div className="w-full">
        <BreadCrumbs
          title="Leave Ledger"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Employees',
              path: '/employees',
            },
            { layerNo: 2, layerText: 'Leave Ledger', path: '' },
          ]}
        />

        {/* Error Notifications */}
        {!isEmpty(ErrorLeaveBenefits) ? (
          <ToastNotification toastType="error" notifMessage={ErrorLeaveBenefits} />
        ) : null}

        {!isEmpty(ErrorLeaveAdjustment) ? (
          <ToastNotification toastType="error" notifMessage={ErrorLeaveAdjustment} />
        ) : null}

        <LeaveLedgerAdjModal
          modalState={adjustmentModalIsOpen}
          setModalState={setAdjustmentModalIsOpen}
          employeeId={employeeData.userId}
          closeModalAction={closeAdjustmentModalAction}
        />

        {/* Modal is available if DTR is pulled */}
        {!isEmpty(employeeData) ? (
          <LeaveLedgerPdfModal printModalIsOpen={printModalIsOpen} toggle={toggle} employeeData={employeeData} />
        ) : null}

        {/* LEAVE LEDGER */}
        <div className="px-5">
          {/** Top Card */}
          <Card>
            <div className="flex flex-col gap-2">
              {/* HEADER */}
              <div className="flex mb-10 ">
                <section className="flex items-center gap-4 px-2 w-full">
                  {employeeData.photoUrl ? (
                    <div className="flex flex-wrap justify-center">
                      <div className="w-[6rem]">
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}${employeeData.photoUrl}`}
                          alt="user-circle"
                          className="h-auto max-w-full align-middle border-none rounded-full shadow"
                        />
                      </div>
                    </div>
                  ) : (
                    <i className="text-gray-400 text-7xl bx bxs-user-circle"></i>
                  )}

                  <div className="flex flex-col">
                    <div className="text-2xl font-semibold text-gray-600">
                      {employeeData ? employeeData.fullName : null}
                    </div>
                    <div className="text-xl text-gray-500">{employeeData ? employeeData.companyId : null}</div>
                    <div className="text-xl text-gray-500">
                      {employeeData ? employeeData.assignment.positionTitle : null}
                    </div>
                  </div>
                </section>

                <section className="inline-grid grid-cols-1 gap-4 justify-items-end w-full">
                  <div className="px-5 py-2 bg-gray-200 rounded w-2/5">
                    <span className="text-sm font-medium">Legend</span>
                    <div className="grid grid-rows-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-light w-5/6">Forced Leave - </span>
                        <i className="text-2xl text-red-200 bx bxs-checkbox w-1/5"></i>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-light w-5/6">Vacation Leave -</span>
                        <i className="text-2xl text-green-200 bx bxs-checkbox w-1/5"></i>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-light w-5/6">Sick Leave -</span>
                        <i className="text-2xl text-orange-200 bx bxs-checkbox w-1/5"></i>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-light w-5/6">Special Privilege Leave -</span>
                        <i className="text-2xl text-cyan-200 bx bxs-checkbox w-1/5"></i>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-light w-5/6">Special Leave Benefit-</span>
                        <i className="text-2xl text-blue-200 bx bxs-checkbox w-1/5"></i>
                      </div>
                    </div>
                  </div>

                  <div className="w-fit flex gap-2">
                    <Select
                      className="w-28"
                      data={years}
                      textSize="sm"
                      initial={{ year: yearNow }}
                      listDef={yearList}
                      onSelect={(selectedItem) => onChangeYear(selectedItem.year)}
                    />

                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center  dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                      onClick={openAdjustmentModalAction}
                    >
                      <i className="bx bxs-plus-square"></i>&nbsp; Adjustment
                    </button>

                    <PrintButton onClick={toggle} />

                    <ExcelButton onClick={exportToExcel} />
                  </div>
                </section>
              </div>

              {/* LEAVE LEDGER TABLE */}
              <LeaveLedgerTable employeeData={employeeData} selectedYear={selectedYear} />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HRMS_DOMAIN_BE}/employees/${context.query.id}`);

    return { props: { employeeData: data } };
  } catch (error) {
    return {
      props: { employeeData: {} },
      redirect: { destination: '/404', permanent: false },
    };
  }
};
