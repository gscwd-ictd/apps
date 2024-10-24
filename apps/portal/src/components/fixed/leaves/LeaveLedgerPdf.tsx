/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, View, Image } from '@react-pdf/renderer';
import GscwdLogo from 'apps/employee-monitoring/public/gscwd-logo.png';
import React, { FunctionComponent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { LeaveLedgerEntry } from 'libs/utils/src/lib/types/leave-ledger-entry.type';
import { EmployeeDetails } from 'apps/portal/src/types/employee.type';

type LeaveLedgerPdfProps = {
  leaveLedger: Array<LeaveLedgerEntry>;
  employeeData: EmployeeDetails;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingLeft: 25,
    paddingRight: 25,
    fontFamily: 'Helvetica',
  },
  logo: {
    width: 60,
    height: 60,
    margin: 'auto',
  },
  employeeProfile: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontSize: 7.5,
    paddingTop: 15,
    width: '100%',
  },
  ledgerContainer: {
    alignItems: 'center',
    // border: '1px solid #000000',
    marginTop: 10,
  },
  aggregateContainer: {
    alignItems: 'center',
    border: '1px solid #000000',
    marginTop: 10,
  },
  tableHeader: {
    borderRight: '1px solid #000000',
    fontSize: 7,
    paddingHorizontal: 1,
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  tableHeader2: {
    borderRight: '1px solid #000000',
    fontSize: 6,
    paddingHorizontal: 1,
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  tableHeaderText: {
    paddingVertical: 3,
    textTransform: 'uppercase',
    margin: 'auto 0',
  },
  tableData: {
    borderRight: '1px solid #000000',
    fontSize: 7.5,
    textAlign: 'center',
  },
  tableDataText: {
    paddingVertical: 3,
    paddingHorizontal: 3,
    textTransform: 'capitalize',
  },
  certifyContainer: {
    paddingVertical: 10,
  },
  certifyText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  notesContainer: {
    paddingTop: 15,
  },
  notesText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  signatoryContainer: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  borderTop: {
    borderTop: '1px solid #000000',
  },
  rowBorder: {
    borderTop: '1px solid #000000',
    borderLeft: '1px solid #000000',
    borderRight: '1px solid #000000',
    borderBottom: '1px solid #000000',
  },

  verticalCenter: { margin: 'auto 0' },
  horizontalCenter: { textAlign: 'center' },

  // Width Styles
  w100: { width: '100%' },
  w80: { width: '80%' },
  w75: { width: '75%' },
  w50: { width: '50%' },
  w45: { width: '45%' },
  w40: { width: '40%' },
  w37_5: { width: 'w37.5%' },
  w30: { width: '30%' },
  w25: { width: '25%' },
  w20: { width: '20%' },
  w17: { width: '17%' },
  w15: { width: '15%' },
  w12: { width: '12%' },
  w11: { width: '11%' },
  w10: { width: '10%' },
  w9: { width: '9%' },
  w8: { width: '8%' },
  w7: { width: '7%' },
  w5: { width: '5%' },
});

export const chunkSubstr = (str: string, size: number) => {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }

  return chunks;
};

export const remarksHyphenationCallback = (word: string) => {
  if (word.length > 16) {
    return chunkSubstr(word, 14);
  } else {
    return [word];
  }
};

export const LeaveLedgerPdf: FunctionComponent<LeaveLedgerPdfProps> = ({ employeeData, leaveLedger }) => {
  // const [isClient, setIsClient] = useState<boolean>(false);

  // forced leave balance
  const [forcedLeaveBalance, setForcedLeaveBalance] = useState<number>(0);

  // vacation leave balance
  const [vacationLeaveBalance, setVacationLeaveBalance] = useState<number>(0);

  // sick leave balance
  const [sickLeaveBalance, setSickLeaveBalance] = useState<number>(0);

  // special privilege leave balance
  const [specialPrivilegeLeaveBalance, setSpecialPrivilegeLeaveBalance] = useState<number>(0);

  // Array to string of dates
  const leaveDatesToString = (leaveDates: Array<string>) => {
    if (!isEmpty(leaveDates)) return '| ' + leaveDates.toString();

    return '';
  };

  // get the latest balance by last index value
  const getLatestBalance = (leaveLedger: Array<LeaveLedgerEntry>) => {
    const lastIndexValue = leaveLedger[leaveLedger.length - 1];
    setForcedLeaveBalance(lastIndexValue.forcedLeaveBalance);
    setVacationLeaveBalance(lastIndexValue.vacationLeaveBalance ?? 0);
    setSickLeaveBalance(lastIndexValue.sickLeaveBalance ?? 0);
    setSpecialPrivilegeLeaveBalance(lastIndexValue.specialPrivilegeLeaveBalance ?? 0);
  };

  // row background color
  const leaveBgColor = (entry: LeaveLedgerEntry) => {
    if (!isEmpty(entry.leaveApplicationId)) {
      if (entry.forcedLeave < 0) {
        // forced leave
        return '#fecaca';
      } else if (entry.vacationLeave < 0) {
        // vacation leave
        return '#bbf7d0';
      } else if (entry.sickLeave < 0) {
        // sick leave
        return '#fed7aa';
      } else if (entry.specialPrivilegeLeave < 0) {
        // special privilege leave
        return '#a5f3fc';
      } else if (entry.specialLeaveBenefit < 0) {
        // special leave benefit
        return '#bfdbfe';
      } else {
        return '#ffffff';
      }
    } else {
      return '#ffffff';
    }
  };

  useEffect(() => {
    getLatestBalance(leaveLedger);

    // setIsClient(true);
  }, []);

  return (
    <>
      <Document title="Leave Ledger">
        {/* FOLIO */}
        <Page size={'A4'} orientation={'landscape'} style={styles.page}>
          <View>
            {/* HEADER */}
            <View style={styles.rowContainer}>
              {/* LEFT */}
              <View style={[styles.w30, { padding: '0 0 0 15' }]}>
                <Image src={GscwdLogo.src} style={[styles.logo]} />
              </View>

              {/* CENTER */}
              <View style={[styles.w40, styles.horizontalCenter]}>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold' }}>GENERAL SANTOS WATER DISTRICT</Text>
                <Text style={{ fontSize: 9, paddingTop: 3 }}>E. Ferdnandez St., Lagao General Santos City</Text>
                <Text
                  style={{
                    fontSize: 11,
                    paddingTop: 3,
                    fontFamily: 'Helvetica-Bold',
                  }}
                >
                  LEAVE LEDGER
                </Text>
              </View>

              {/* RIGHT */}
              <View style={[styles.w30]}></View>
            </View>

            {/* EMPLOYEE PROFILE */}
            <View style={styles.employeeProfile}>
              <View>
                {/* NAME */}
                <View style={[styles.rowContainer]}>
                  <Text style={[styles.w20]}>NAME</Text>
                  <Text
                    style={[
                      styles.w80,
                      {
                        fontFamily: 'Helvetica-Bold',
                        textTransform: 'uppercase',
                        fontSize: 8.3,
                      },
                    ]}
                  >
                    {employeeData.employmentDetails.employeeFullName}
                  </Text>
                </View>

                {/* DESIGNATION */}
                <View style={[styles.rowContainer, { paddingTop: 2 }]}>
                  <Text style={[styles.w20]}>DESIGNATION</Text>
                  <Text style={[styles.w80, { textTransform: 'uppercase', fontSize: 8 }]}>
                    {employeeData.employmentDetails.assignment.positionTitle}
                  </Text>
                </View>

                {/* OFFICE */}
                <View style={[styles.rowContainer, { paddingTop: 4 }]}>
                  <Text style={[styles.w20]}>OFFICE</Text>
                  <Text style={[styles.w80]}>{employeeData.employmentDetails.orgStruct.officeName}</Text>
                </View>

                {/* DEPARTMENT */}
                <View style={[styles.rowContainer]}>
                  <Text style={[styles.w20]}>DEPARTMENT</Text>
                  <Text style={[styles.w80]}>{employeeData.employmentDetails.orgStruct.departmentName}</Text>
                </View>

                {/* DIVISION */}
                <View style={[styles.rowContainer]}>
                  <Text style={[styles.w20]}>DIVISION</Text>
                  <Text style={[styles.w80]}>{employeeData.employmentDetails.orgStruct.divisionName}</Text>
                </View>
              </View>
            </View>

            {/* DAILY TIME LOGS */}
            <View style={[styles.ledgerContainer]}>
              {/* COLUMN HEADERS  */}
              <View>
                <View style={[styles.rowContainer, styles.rowBorder]}>
                  <View style={[styles.tableHeader, styles.w8]}>
                    <Text style={[styles.tableHeaderText]}>PERIOD</Text>
                  </View>
                  <View style={[styles.tableHeader, styles.w17]}>
                    <Text style={[styles.tableHeaderText]}>PARTICULARS</Text>
                  </View>
                  <View style={[styles.tableHeader2, styles.w5]}>
                    <Text style={[styles.tableHeaderText]}>FORCED LEAVE</Text>
                  </View>
                  <View style={[styles.tableHeader2, styles.w5]}>
                    <Text style={[styles.tableHeaderText]}>FORCED LEAVE BAL.</Text>
                  </View>
                  <View style={[styles.tableHeader2, styles.w5]}>
                    <Text style={[styles.tableHeaderText]}>VACATION LEAVE</Text>
                  </View>
                  <View style={[styles.tableHeader2, styles.w5]}>
                    <Text style={[styles.tableHeaderText]}>VACATION LEAVE BAL</Text>
                  </View>
                  <View style={[styles.tableHeader2, styles.w5]}>
                    <Text style={[styles.tableHeaderText]}>SICK LEAVE</Text>
                  </View>
                  <View style={[styles.tableHeader2, styles.w5]}>
                    <Text style={[styles.tableHeaderText]}>SICK LEAVE BAL</Text>
                  </View>
                  <View style={[styles.tableHeader2, styles.w5]}>
                    <Text style={[styles.tableHeaderText]}>SPECIAL PRIVILEGE LEAVE</Text>
                  </View>
                  <View style={[styles.tableHeader2, styles.w5]}>
                    <Text style={[styles.tableHeaderText]}>SPECIAL PRIVILEGE LEAVE BAL</Text>
                  </View>
                  <View style={[styles.tableHeader2, styles.w5]}>
                    <Text style={[styles.tableHeaderText]}>SPECIAL LEAVE BENEFIT</Text>
                  </View>
                  <View style={[styles.tableHeader2, styles.w5]}>
                    <Text style={[styles.tableHeaderText]}>SPECIAL LEAVE BENEFIT BAL</Text>
                  </View>
                  <View style={[styles.tableHeader, styles.w25, { borderRight: 'none' }]}>
                    <Text style={[styles.tableHeaderText]}>REMARKS</Text>
                  </View>
                </View>
              </View>

              {/* TABLE ROWS */}
              <View>
                {!isEmpty(leaveLedger) ? (
                  leaveLedger.map((entry, index) => {
                    return (
                      <View
                        style={[styles.rowContainer, styles.rowBorder, { backgroundColor: `${leaveBgColor(entry)}` }]}
                        key={index}
                        wrap={false}
                      >
                        <View style={[styles.tableData, styles.w8]}>
                          <Text style={[styles.tableDataText]}>{dayjs(entry.period).format('MM/DD/YYYY')}</Text>
                        </View>
                        <View style={[styles.tableData, styles.w17, { textAlign: 'left' }]}>
                          <Text style={[styles.tableDataText]}>{entry.particulars}</Text>
                        </View>
                        <View style={[styles.tableData, styles.w5]}>
                          <Text style={[styles.tableDataText]}>
                            {!isEmpty(entry.forcedLeave) && parseFloat(entry.forcedLeave.toString()) !== 0
                              ? entry.forcedLeave
                              : ''}
                          </Text>
                        </View>
                        <View style={[styles.tableData, styles.w5]}>
                          <Text style={[styles.tableDataText]}>{entry.forcedLeaveBalance}</Text>
                        </View>
                        <View style={[styles.tableData, styles.w5]}>
                          <Text style={[styles.tableDataText]}>
                            {!isEmpty(entry.vacationLeave) && parseFloat(entry.vacationLeave.toString()) !== 0
                              ? entry.vacationLeave
                              : ''}
                          </Text>
                        </View>
                        <View style={[styles.tableData, styles.w5]}>
                          <Text style={[styles.tableDataText]}>{entry.vacationLeaveBalance}</Text>
                        </View>
                        <View style={[styles.tableData, styles.w5]}>
                          <Text style={[styles.tableDataText]}>
                            {!isEmpty(entry.sickLeave) && parseFloat(entry.sickLeave.toString()) !== 0
                              ? entry.sickLeave
                              : null}
                          </Text>
                        </View>
                        <View style={[styles.tableData, styles.w5]}>
                          <Text style={[styles.tableDataText]}>{entry.sickLeaveBalance}</Text>
                        </View>
                        <View style={[styles.tableData, styles.w5]}>
                          <Text style={[styles.tableDataText]}>
                            {!isEmpty(entry.specialPrivilegeLeave) &&
                            parseFloat(entry.specialPrivilegeLeave.toString()) !== 0
                              ? entry.specialPrivilegeLeave
                              : null}
                          </Text>
                        </View>
                        <View style={[styles.tableData, styles.w5]}>
                          <Text style={[styles.tableDataText]}>{entry.specialPrivilegeLeaveBalance}</Text>
                        </View>
                        <View style={[styles.tableData, styles.w5]}>
                          <Text style={[styles.tableDataText]}>
                            {!isEmpty(entry.specialLeaveBenefit) &&
                            parseFloat(entry.specialLeaveBenefit.toString()) !== 0
                              ? entry.specialLeaveBenefit
                              : null}
                          </Text>
                        </View>
                        <View style={[styles.tableData, styles.w5]}>
                          <Text style={[styles.tableDataText]}>{entry.specialLeaveBenefitBalance}</Text>
                        </View>
                        <View style={[styles.tableData, styles.w25, { borderRight: 'none' }]}>
                          <Text
                            style={[styles.tableDataText, styles.verticalCenter]}
                            hyphenationCallback={remarksHyphenationCallback}
                          >
                            {entry.remarks} {leaveDatesToString(entry.leaveDates)}
                          </Text>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <View style={[styles.rowContainer, styles.rowBorder]}>
                    <View style={[styles.tableData, styles.w100]}>
                      <Text style={[styles.tableDataText]}>NO DATA FOUND</Text>
                    </View>
                  </View>
                )}

                {/* TOTAL */}
                <View style={[styles.rowContainer, styles.rowBorder]}>
                  <View style={[styles.tableData, styles.w25]}>
                    <Text style={[styles.tableDataText, { fontFamily: 'Helvetica-Bold' }]}>TOTAL</Text>
                  </View>
                  <View style={[styles.tableData, styles.w5]}>
                    <Text style={[styles.tableDataText]}></Text>
                  </View>
                  <View style={[styles.tableData, styles.w5]}>
                    <Text style={[styles.tableDataText, { fontFamily: 'Helvetica-Bold', backgroundColor: '#fecaca' }]}>
                      {forcedLeaveBalance}
                    </Text>
                  </View>
                  <View style={[styles.tableData, styles.w5]}>
                    <Text style={[styles.tableDataText]}></Text>
                  </View>
                  <View style={[styles.tableData, styles.w5]}>
                    <Text style={[styles.tableDataText, { fontFamily: 'Helvetica-Bold', backgroundColor: '#bbf7d0' }]}>
                      {vacationLeaveBalance}
                    </Text>
                  </View>
                  <View style={[styles.tableData, styles.w5]}>
                    <Text style={[styles.tableDataText]}></Text>
                  </View>
                  <View style={[styles.tableData, styles.w5]}>
                    <Text style={[styles.tableDataText, { fontFamily: 'Helvetica-Bold', backgroundColor: '#fed7aa' }]}>
                      {sickLeaveBalance}
                    </Text>
                  </View>
                  <View style={[styles.tableData, styles.w5]}>
                    <Text style={[styles.tableDataText]}></Text>
                  </View>
                  <View style={[styles.tableData, styles.w5]}>
                    <Text style={[styles.tableDataText, { fontFamily: 'Helvetica-Bold', backgroundColor: '#a5f3fc' }]}>
                      {specialPrivilegeLeaveBalance}
                    </Text>
                  </View>
                  <View style={[styles.tableData, styles.w5]}>
                    <Text style={[styles.tableDataText]}></Text>
                  </View>
                  <View style={[styles.tableData, styles.w5]}>
                    <Text style={[styles.tableDataText]}></Text>
                  </View>
                  <View style={[styles.tableData, styles.w25, { borderRight: 'none' }]}>
                    <Text style={[styles.tableDataText]}></Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
};

export default LeaveLedgerPdf;
