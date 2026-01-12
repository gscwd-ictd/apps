/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, PDFViewer, View, Image } from '@react-pdf/renderer';
import GscwdLogo from 'apps/employee-monitoring/public/gscwd-logo.png';
import React, { FunctionComponent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { EmployeeWithDetails } from 'libs/utils/src/lib/types/employee.type';
import { LeaveLedgerEntry } from 'libs/utils/src/lib/types/leave-ledger-entry.type';

type LeaveLedgerPdfProps = {
  leaveLedger: Array<LeaveLedgerEntry>;
  employeeData: EmployeeWithDetails;
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
  w40: { width: '40%' },
  w30: { width: '30%' },
  w22: { width: '22%' },
  w20: { width: '20%' },
  w18: { width: '18%' },
  w16: { width: '16%' },
  w10: { width: '10%' },
  w8: { width: '8%' },
  w7: { width: '7%' },
  w6: { width: '6%' },
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
  const [isClient, setIsClient] = useState<boolean>(false);

  // forced leave balance
  const [forcedLeaveBalance, setForcedLeaveBalance] = useState<number>(0);

  // vacation leave balance
  const [vacationLeaveBalance, setVacationLeaveBalance] = useState<number>(0);

  // sick leave balance
  const [sickLeaveBalance, setSickLeaveBalance] = useState<number>(0);

  // special privilege leave balance
  const [specialPrivilegeLeaveBalance, setSpecialPrivilegeLeaveBalance] = useState<number>(0);

  // wellness leave balance
  const [wellnessLeaveBalance, setWellnessLeaveBalance] = useState<number>(0);

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
    setWellnessLeaveBalance(lastIndexValue.wellnessLeaveBalance ?? 0);
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
      } else if (entry.wellnessLeave < 0) {
        // wellness leave
        return '#387eff';
      } else {
        return '#ffffff';
      }
    } else {
      return '#ffffff';
    }
  };

  useEffect(() => {
    getLatestBalance(leaveLedger);

    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <PDFViewer width={'100%'} height={1400}>
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
                        {employeeData.fullName}
                      </Text>
                    </View>

                    {/* DESIGNATION */}
                    <View style={[styles.rowContainer, { paddingTop: 2 }]}>
                      <Text style={[styles.w20]}>DESIGNATION</Text>
                      <Text style={[styles.w80, { textTransform: 'uppercase', fontSize: 8 }]}>
                        {employeeData.assignment.positionTitle}
                      </Text>
                    </View>

                    {/* OFFICE */}
                    <View style={[styles.rowContainer, { paddingTop: 4 }]}>
                      <Text style={[styles.w20]}>OFFICE</Text>
                      <Text style={[styles.w80]}>{employeeData.assignment.officeName}</Text>
                    </View>

                    {/* DEPARTMENT */}
                    <View style={[styles.rowContainer]}>
                      <Text style={[styles.w20]}>DEPARTMENT</Text>
                      <Text style={[styles.w80]}>{employeeData.assignment.departmentName}</Text>
                    </View>

                    {/* DIVISION */}
                    <View style={[styles.rowContainer]}>
                      <Text style={[styles.w20]}>DIVISION</Text>
                      <Text style={[styles.w80]}>{employeeData.assignment.divisionName}</Text>
                    </View>
                  </View>
                </View>

                {/* DAILY TIME LOGS */}
                <View style={[styles.ledgerContainer]}>
                  {/* COLUMN HEADERS  */}
                  <View>
                    <View style={[styles.rowContainer, styles.rowBorder]}>
                      <View style={[styles.tableHeader, styles.w6]}>
                        <Text style={[styles.tableHeaderText]}>PERIOD</Text>
                      </View>
                      <View style={[styles.tableHeader, styles.w16]}>
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
                        <Text style={[styles.tableHeaderText]}>WELLNESS LEAVE</Text>
                      </View>
                      <View style={[styles.tableHeader2, styles.w5]}>
                        <Text style={[styles.tableHeaderText]}>WELLNESS LEAVE BAL</Text>
                      </View>

                      <View style={[styles.tableHeader2, styles.w5]}>
                        <Text style={[styles.tableHeaderText]}>SPECIAL LEAVE BENEFIT</Text>
                      </View>
                      <View style={[styles.tableHeader2, styles.w5]}>
                        <Text style={[styles.tableHeaderText]}>SPECIAL LEAVE BENEFIT BAL</Text>
                      </View>
                      <View style={[styles.tableHeader, styles.w18, { borderRight: 'none' }]}>
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
                            style={[
                              styles.rowContainer,
                              styles.rowBorder,
                              { backgroundColor: `${leaveBgColor(entry)}` },
                            ]}
                            key={index}
                            wrap={false}
                          >
                            {/* PERIOD */}
                            <View style={[styles.tableData, styles.w6]}>
                              <Text style={[styles.tableDataText, styles.verticalCenter]}>
                                {dayjs(entry.period).format('MM/DD/YYYY')}
                              </Text>
                            </View>

                            {/* PARTICULARS */}
                            <View style={[styles.tableData, styles.w16, { textAlign: 'left' }]}>
                              <Text style={[styles.tableDataText, styles.verticalCenter]}>{entry.particulars}</Text>
                            </View>

                            {/* FL */}
                            <View style={[styles.tableData, styles.w5]}>
                              <Text style={[styles.tableDataText, styles.verticalCenter]}>
                                {!isEmpty(entry.forcedLeave) && parseFloat(entry.forcedLeave.toString()) !== 0
                                  ? entry.forcedLeave
                                  : ''}
                              </Text>
                            </View>

                            {/* FL BALANCE */}
                            <View style={[styles.tableData, styles.w5]}>
                              <Text style={[styles.tableDataText, styles.verticalCenter]}>
                                {entry.forcedLeaveBalance}
                              </Text>
                            </View>

                            {/* VL */}
                            <View style={[styles.tableData, styles.w5]}>
                              <Text style={[styles.tableDataText, styles.verticalCenter]}>
                                {!isEmpty(entry.vacationLeave) && parseFloat(entry.vacationLeave.toString()) !== 0
                                  ? entry.vacationLeave
                                  : ''}
                              </Text>
                            </View>

                            {/* VL BALANCE */}
                            <View style={[styles.tableData, styles.w5]}>
                              <Text style={[styles.tableDataText, styles.verticalCenter]}>
                                {entry.vacationLeaveBalance}
                              </Text>
                            </View>

                            {/* SL */}
                            <View style={[styles.tableData, styles.w5]}>
                              <Text style={[styles.tableDataText, styles.verticalCenter]}>
                                {!isEmpty(entry.sickLeave) && parseFloat(entry.sickLeave.toString()) !== 0
                                  ? entry.sickLeave
                                  : null}
                              </Text>
                            </View>

                            {/* SL BALANCE */}
                            <View style={[styles.tableData, styles.w5]}>
                              <Text style={[styles.tableDataText, styles.verticalCenter]}>
                                {entry.sickLeaveBalance}
                              </Text>
                            </View>

                            {/* SPL */}
                            <View style={[styles.tableData, styles.w5]}>
                              <Text style={[styles.tableDataText, styles.verticalCenter]}>
                                {!isEmpty(entry.specialPrivilegeLeave) &&
                                parseFloat(entry.specialPrivilegeLeave.toString()) !== 0
                                  ? entry.specialPrivilegeLeave
                                  : null}
                              </Text>
                            </View>

                            {/* SPL BALANCE */}
                            <View style={[styles.tableData, styles.w5]}>
                              <Text style={[styles.tableDataText, styles.verticalCenter]}>
                                {entry.specialPrivilegeLeaveBalance}
                              </Text>
                            </View>

                            {/* WL */}
                            <View style={[styles.tableData, styles.w5]}>
                              <Text style={[styles.tableDataText, styles.verticalCenter]}>
                                {!isEmpty(entry.wellnessLeave) && parseFloat(entry.wellnessLeave.toString()) !== 0
                                  ? entry.wellnessLeave
                                  : null}
                              </Text>
                            </View>

                            {/* WL BALANCE */}
                            <View style={[styles.tableData, styles.w5]}>
                              <Text style={[styles.tableDataText, styles.verticalCenter]}>
                                {entry.wellnessLeaveBalance}
                              </Text>
                            </View>

                            {/* SLB */}
                            <View style={[styles.tableData, styles.w5]}>
                              <Text style={[styles.tableDataText, styles.verticalCenter]}>
                                {!isEmpty(entry.specialLeaveBenefit) &&
                                parseFloat(entry.specialLeaveBenefit.toString()) !== 0
                                  ? entry.specialLeaveBenefit
                                  : null}
                              </Text>
                            </View>

                            {/* SBL BALANCE */}
                            <View style={[styles.tableData, styles.w5]}>
                              <Text style={[styles.tableDataText, styles.verticalCenter]}>
                                {entry.specialLeaveBenefitBalance}
                              </Text>
                            </View>

                            {/* REMARKS */}
                            <View style={[styles.tableData, styles.w18, { borderRight: 'none' }]}>
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
                      <View style={[styles.tableData, styles.w22]}>
                        <Text style={[styles.tableDataText, { fontFamily: 'Helvetica-Bold' }]}>TOTAL</Text>
                      </View>
                      <View style={[styles.tableData, styles.w5]}>
                        <Text style={[styles.tableDataText]}></Text>
                      </View>
                      <View style={[styles.tableData, styles.w5]}>
                        <Text
                          style={[styles.tableDataText, { fontFamily: 'Helvetica-Bold', backgroundColor: '#fecaca' }]}
                        >
                          {forcedLeaveBalance}
                        </Text>
                      </View>
                      <View style={[styles.tableData, styles.w5]}>
                        <Text style={[styles.tableDataText]}></Text>
                      </View>
                      <View style={[styles.tableData, styles.w5]}>
                        <Text
                          style={[styles.tableDataText, { fontFamily: 'Helvetica-Bold', backgroundColor: '#bbf7d0' }]}
                        >
                          {vacationLeaveBalance}
                        </Text>
                      </View>
                      <View style={[styles.tableData, styles.w5]}>
                        <Text style={[styles.tableDataText]}></Text>
                      </View>
                      <View style={[styles.tableData, styles.w5]}>
                        <Text
                          style={[styles.tableDataText, { fontFamily: 'Helvetica-Bold', backgroundColor: '#fed7aa' }]}
                        >
                          {sickLeaveBalance}
                        </Text>
                      </View>
                      <View style={[styles.tableData, styles.w5]}>
                        <Text style={[styles.tableDataText]}></Text>
                      </View>
                      <View style={[styles.tableData, styles.w5]}>
                        <Text
                          style={[styles.tableDataText, { fontFamily: 'Helvetica-Bold', backgroundColor: '#a5f3fc' }]}
                        >
                          {specialPrivilegeLeaveBalance}
                        </Text>
                      </View>

                      <View style={[styles.tableData, styles.w5]}>
                        <Text style={[styles.tableDataText]}></Text>
                      </View>
                      <View style={[styles.tableData, styles.w5]}>
                        <Text
                          style={[styles.tableDataText, { fontFamily: 'Helvetica-Bold', backgroundColor: '#387eff' }]}
                        >
                          {wellnessLeaveBalance}
                        </Text>
                      </View>

                      <View style={[styles.tableData, styles.w5]}>
                        <Text style={[styles.tableDataText]}></Text>
                      </View>
                      <View style={[styles.tableData, styles.w5]}>
                        <Text style={[styles.tableDataText]}></Text>
                      </View>
                      <View style={[styles.tableData, styles.w18, { borderRight: 'none' }]}>
                        <Text style={[styles.tableDataText]}></Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      )}
    </>
  );
};

export default LeaveLedgerPdf;
