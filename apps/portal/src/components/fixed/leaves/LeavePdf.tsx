/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, View, Image } from '@react-pdf/renderer';
import React from 'react';
import { EmployeeDetails } from '../../../../src/types/employee.type';
import { EmployeeLeaveDetails } from '../../../../../../libs/utils/src/lib/types/leave-application.type';
import { LeaveName, LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { LeaveLedgerEntry } from 'libs/utils/src/lib/types/leave-ledger-entry.type';

const styles = StyleSheet.create({
  page: {
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 25,
    marginRight: 35,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Helvetica',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 10,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    border: '1px solid #000000',
    paddingTop: 5,
    paddingBottom: 5,
  },
  container2: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTop: '0px solid #000000',
    borderLeft: '1px solid #000000',
    borderRight: '1px solid #000000',
    borderBottom: '1px solid #000000',
    paddingTop: 5,
    height: 20,
  },
  container3: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #000000',
    padding: 2,
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    marginTop: 3,
    marginBottom: 3,
  },
  containerTable: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTop: '1px solid #000000',
    borderLeft: '1px solid #000000',
    borderRight: '1px solid #000000',
    marginBottom: 6,
  },
  containerTableRow: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRight: '1px solid #000000',
    borderBottom: '1px solid #000000',
    width: '31.5%',
    padding: 5,
    fontSize: 8,
  },
  containerTableRow2: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottom: '1px solid #000000',
    width: '31.5%',
    padding: 5,
    fontSize: 8,
  },
  containerTableRow3: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRight: '1px solid #000000',
    borderBottom: '1px solid #000000',
    width: '37%',
    padding: 5,
    fontSize: 8,
  },
  containerTableRow4: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRight: '1px solid #000000',
    borderBottom: '1px solid #000000',
    width: '37%',
    padding: 5,
    fontSize: 9,
  },
  checkbox: {
    border: '1px solid #000',
    height: 12,
    width: 12,
    marginVertical: 0.5,
    padding: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  leaveLabelContainer: {
    display: 'flex',
    gap: 2,
    flexDirection: 'row',
    fontSize: 9,
    alignItems: 'center',
    paddingLeft: 3,
  },
  leaveLabelContainer2: {
    display: 'flex',
    gap: 4,
    flexDirection: 'row',
    fontSize: 9,
    alignItems: 'center',
    paddingLeft: 20,
  },
  leaveLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  inCase: {
    paddingLeft: 20,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 8,
    fontFamily: 'Helvetica-Oblique',
  },
});

type LeavePdfProps = {
  employeeDetails: EmployeeDetails;
  leaveDetails: EmployeeLeaveDetails;
  selectedLeaveLedger: Array<LeaveLedgerEntry>;
};

export const LeavePdf = ({ employeeDetails, leaveDetails, selectedLeaveLedger }: LeavePdfProps): JSX.Element => {
  return (
    <>
      <Document title="Leave">
        <Page size={'A4'}>
          <View style={styles.page}>
            <Text style={{ position: 'absolute', fontSize: 6 }}>CIVIL SERVICES FORM NO. 6</Text>
            <Text style={{ position: 'absolute', fontSize: 6, marginTop: 10 }}>Revised 2020</Text>
            <Text style={{ position: 'absolute', fontSize: 10, right: 0 }}>
              {leaveDetails?.leaveApplicationBasicInfo?.referenceNo}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 5,
                justifyContent: 'center',
              }}
            >
              <Image style={{ width: 50, height: 50 }} src={'/gwdlogo.png'} />
              <View style={styles.header}>
                <Text style={{ fontSize: 14, paddingTop: 10 }}>Republic of the Philippines</Text>
                <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold' }}>GENERAL SANTOS WATER DISTRICT</Text>

                <Text
                  style={{
                    fontSize: 14,
                    paddingTop: 20,
                    fontFamily: 'Helvetica-Bold',
                  }}
                >
                  APPLICATION FOR LEAVE
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 6,
                  marginLeft: 10,
                  marginTop: 27,
                  width: '50px',
                  textAlign: 'center',
                }}
              >
                Stamp of Date of Receipt
              </Text>
            </View>

            <View style={{ height: 5 }}></View>
            {/* OFFICE and Employee Name */}
            <View style={styles.container}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 5,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  fontSize: 8,
                  marginTop: -2,
                  height: 24,
                  width: '100%',
                  padding: 1,
                }}
              >
                <Text style={{ marginRight: 50 }}>1. OFFICE/DEPARTMENT</Text>
                <Text
                  style={{
                    position: 'absolute',
                    marginTop: 11,
                    marginLeft: 10,
                    fontSize: 7,
                    width: '140px',
                  }}
                >
                  {leaveDetails.employeeDetails.assignment.name}
                </Text>
                {/* EMPLOYEE NAME */}
                <Text style={{ marginRight: 50 }}>2. NAME</Text>
                <Text
                  style={{
                    position: 'absolute',
                    marginTop: 11,
                    marginLeft: 180,
                    fontSize: 8,
                    width: '130px',
                    textAlign: 'center',
                  }}
                >
                  {employeeDetails.profile.lastName}
                </Text>
                <Text style={{ marginRight: 80 }}>(Last)</Text>
                <Text
                  style={{
                    position: 'absolute',
                    marginTop: 11,
                    marginLeft: 293,
                    fontSize: 8,
                    width: '120px',
                    textAlign: 'center',
                  }}
                >
                  {employeeDetails.profile.firstName}
                </Text>
                <Text style={{ marginRight: 80 }}>(First)</Text>
                <Text
                  style={{
                    position: 'absolute',
                    marginTop: 11,
                    marginLeft: 410,
                    fontSize: 8,
                    width: '100px',
                    textAlign: 'center',
                  }}
                >
                  {employeeDetails.profile.middleName}
                </Text>
                <Text style={{ marginRight: 50 }}>(Middle)</Text>
              </View>
            </View>
            {/* DATE OF FILING UP TO SALARY */}
            <View style={styles.container2}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 5,
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  fontSize: 8,
                  marginBottom: 1,
                  height: 24,
                  width: '100%',
                  padding: 1,
                }}
              >
                <Text style={{}}>3. DATE OF FILING</Text>
                <Text
                  style={{
                    position: 'absolute',
                    paddingBottom: 1,
                    marginLeft: 100,
                    fontSize: 8,
                    width: '100px',
                  }}
                >
                  {leaveDetails.leaveApplicationBasicInfo.dateOfFiling}
                </Text>
                <Text style={{ marginRight: 1 }}>___________________</Text>
                <Text style={{ marginRight: 1 }}>4. POSITION</Text>
                <Text
                  style={{
                    position: 'absolute',
                    paddingBottom: 1,
                    marginLeft: 282,
                    fontSize: 8,
                    width: '100px',
                  }}
                >
                  {leaveDetails.employeeDetails.assignment.positionTitle}
                </Text>
                <Text style={{ marginRight: 1 }}>___________________</Text>
                <Text style={{ marginRight: 1 }}>5. SALARY</Text>
                <Text
                  style={{
                    position: 'absolute',
                    paddingBottom: 1,
                    marginLeft: 470,
                    fontSize: 8,
                    width: '140px',
                  }}
                >
                  P{leaveDetails.employeeDetails.assignment.salary.substring(1)}
                </Text>
                <Text style={{ marginRight: 1 }}>___________________</Text>
              </View>
            </View>
            {/* DETAILS OF APPLICATION */}
            <View style={styles.container3}>
              <Text>6. DETAILS OF APPLICATION</Text>
            </View>
            {/* MAIN */}
            <View
              style={{
                display: 'flex',
                border: '1px solid #000',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              {/* LEAVE CHECKBOXES */}
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <View
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid #000',
                    borderRight: '1px solid #000',
                    flexDirection: 'column',
                    width: '52%',
                    fontSize: 9,
                    padding: 2,
                  }}
                >
                  <Text>6.A TYPE OF LEAVE TO BE AVAILED OF</Text>
                  <View style={styles.leaveLabelContainer}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.VACATION ? 'X' : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Vacation Leave</Text>
                    <Text style={{ fontSize: 6 }}>(Sec. 51, Rule XVI, Omnibus Rules Implementing E.O. No. 292)</Text>
                  </View>
                  <View style={styles.leaveLabelContainer}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.FORCED ? 'X' : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Mandatory/Force Leave</Text>
                    <Text style={{ fontSize: 6 }}>(Sec. 25, Rule XVI, Omnibus Rules Implementing E.O. No. 292)</Text>
                  </View>
                  <View style={styles.leaveLabelContainer}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.SICK ? 'X' : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Sick Leave</Text>
                    <Text style={{ fontSize: 6 }}>(Sec. 43, Rule XVI, Omnibus Rules Implementing E.O. No. 292)</Text>
                  </View>
                  <View style={styles.leaveLabelContainer}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.MATERNITY ? 'X' : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Maternity Leave</Text>
                    <Text style={{ fontSize: 6 }}>(R.A. No. 11210 / IRR issued by CSC, DOLE and SSS)</Text>
                  </View>
                  <View style={styles.leaveLabelContainer}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.PATERNITY ? 'X' : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Paternity Leave</Text>
                    <Text style={{ fontSize: 6 }}>(R.A. No. 8187 / CSC MC No. 71, s. 1998 as amended)</Text>
                  </View>
                  <View style={styles.leaveLabelContainer}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.SPECIAL_PRIVILEGE ? 'X' : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Special Privilege Leave</Text>
                    <Text style={{ fontSize: 6 }}>(Sec. 21, Rule XVI, Omnibus Rules Implementing E.O. No. 292)</Text>
                  </View>
                  <View style={styles.leaveLabelContainer}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.SOLO_PARENT ? 'X' : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Solo Parent Leave</Text>
                    <Text style={{ fontSize: 6 }}>(R.A. No. 8972 / CSC MC No. 8, s. 2004)</Text>
                  </View>
                  <View style={styles.leaveLabelContainer}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.STUDY ? 'X' : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Study Leave</Text>
                    <Text style={{ fontSize: 6 }}>(Sec. 68, Rule XVI, Omnibus Rules Implementing E.O. No. 292)</Text>
                  </View>
                  <View style={styles.leaveLabelContainer}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.VAWC ? 'X' : null}
                    </Text>
                    <Text style={styles.leaveLabel}>10-Day VAWC Leave</Text>
                    <Text style={{ fontSize: 6 }}>(R.A. No. 9262 / CSC MC No. 15, s. 2005)</Text>
                  </View>
                  <View style={styles.leaveLabelContainer}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.REHABILITATION ? 'X' : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Rehabilitation Privilege</Text>
                    <Text style={{ fontSize: 6 }}>(Sec. 55, Rule XVI, Omnibus Rules Implementing E.O. No. 292)</Text>
                  </View>
                  <View style={styles.leaveLabelContainer}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN
                        ? 'X'
                        : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Special Leave Benefits for Women</Text>
                    <Text style={{ fontSize: 6 }}>(R.A. No. 9710 / CSC MC No. 25, s. 2010)</Text>
                  </View>
                  <View style={styles.leaveLabelContainer}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.SPECIAL_EMERGENCY_CALAMITY
                        ? 'X'
                        : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Special Emergency (Calamity) Leave</Text>
                    <Text style={{ fontSize: 6 }}>(CSC MC No. 2, s. 2012, as amended)</Text>
                  </View>

                  <View style={styles.leaveLabelContainer}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.ADOPTION ? 'X' : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Adoption Leave</Text>
                    <Text style={{ fontSize: 6 }}>(R.A. No. 8552)</Text>
                  </View>
                  <View style={styles.leaveLabelContainer}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.MONETIZATION ||
                      leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.LEAVE_WITHOUT_PAY ||
                      leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.TERMINAL
                        ? 'X'
                        : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Others:</Text>
                  </View>
                </View>
                {/* 6.B DETAILS OF LEAVE CHECKBOXES */}
                <View
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid #000',
                    flexDirection: 'column',
                    width: '48%',
                    fontSize: 9,
                    padding: 2,
                  }}
                >
                  <Text>6.B DETAILS OF LEAVE</Text>
                  <Text style={styles.inCase}>In case of Vacation/Special Priviledge Leave:</Text>
                  <View style={styles.leaveLabelContainer2}>
                    <Text style={styles.checkbox}>
                      {(leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.VACATION ||
                        leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.FORCED ||
                        leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.SPECIAL_PRIVILEGE) &&
                      leaveDetails.leaveApplicationDetails.inPhilippinesOrAbroad &&
                      leaveDetails.leaveApplicationDetails.inPhilippinesOrAbroad === 'Within the Philippines'
                        ? 'X'
                        : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Within the Philippines</Text>
                    <Text style={{ fontSize: 6, paddingLeft: 25 }}>_______________________________</Text>
                    <Text
                      style={{
                        fontSize: 8,
                        position: 'absolute',
                        width: '110',
                        marginLeft: 152,
                        paddingBottom: 3,
                      }}
                    >
                      {(leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.VACATION ||
                        leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.FORCED ||
                        leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.SPECIAL_PRIVILEGE) &&
                      leaveDetails.leaveApplicationDetails.location &&
                      leaveDetails.leaveApplicationDetails.inPhilippinesOrAbroad &&
                      leaveDetails.leaveApplicationDetails.inPhilippinesOrAbroad === 'Within the Philippines'
                        ? leaveDetails.leaveApplicationDetails.location
                        : null}
                    </Text>
                    <Text
                      style={{
                        fontSize: 8,
                        position: 'absolute',
                        width: '100%',
                        marginLeft: 128,
                        paddingBottom: 3,
                      }}
                    ></Text>
                  </View>
                  <View style={styles.leaveLabelContainer2}>
                    <Text style={styles.checkbox}>
                      {(leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.VACATION ||
                        leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.FORCED ||
                        leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.SPECIAL_PRIVILEGE) &&
                      leaveDetails.leaveApplicationDetails.inPhilippinesOrAbroad &&
                      leaveDetails.leaveApplicationDetails.inPhilippinesOrAbroad === 'Abroad'
                        ? 'X'
                        : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Abroad (Specify)</Text>
                    <Text style={{ fontSize: 6, paddingLeft: 45 }}>_______________________________</Text>
                    <Text
                      style={{
                        fontSize: 8,
                        position: 'absolute',
                        width: '110',
                        marginLeft: 152,
                        paddingBottom: 3,
                      }}
                    >
                      {(leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.VACATION ||
                        leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.FORCED ||
                        leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.SPECIAL_PRIVILEGE) &&
                      leaveDetails.leaveApplicationDetails.location &&
                      leaveDetails.leaveApplicationDetails.inPhilippinesOrAbroad &&
                      leaveDetails.leaveApplicationDetails.inPhilippinesOrAbroad === 'Abroad'
                        ? leaveDetails.leaveApplicationDetails.location
                        : null}
                    </Text>
                  </View>
                  <Text style={styles.inCase}>In case of Sick Leave:</Text>
                  <View style={styles.leaveLabelContainer2}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.SICK &&
                      leaveDetails.leaveApplicationDetails.hospital &&
                      leaveDetails.leaveApplicationDetails.hospital === 'In Hospital'
                        ? 'X'
                        : null}
                    </Text>
                    <Text style={styles.leaveLabel}>In Hospital (Specify Illness)</Text>
                    <Text style={{ fontSize: 6, paddingLeft: 5 }}>_______________________________</Text>
                    <Text
                      style={{
                        fontSize: 8,
                        position: 'absolute',
                        width: '110',
                        marginLeft: 152,
                        paddingBottom: 3,
                      }}
                    >
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.SICK &&
                      leaveDetails.leaveApplicationDetails.illness &&
                      leaveDetails.leaveApplicationDetails.hospital === 'In Hospital'
                        ? leaveDetails.leaveApplicationDetails.illness
                        : null}
                    </Text>
                  </View>
                  <View style={styles.leaveLabelContainer2}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.SICK &&
                      leaveDetails.leaveApplicationDetails.hospital &&
                      leaveDetails.leaveApplicationDetails.hospital === 'Out Patient'
                        ? 'X'
                        : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Out Patient (Specify Illness)</Text>
                    <Text style={{ fontSize: 6, paddingLeft: 3 }}>_______________________________</Text>
                    <Text
                      style={{
                        fontSize: 8,
                        position: 'absolute',
                        width: '110',
                        marginLeft: 152,
                        paddingBottom: 3,
                      }}
                    >
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.SICK &&
                      leaveDetails.leaveApplicationDetails.illness &&
                      leaveDetails.leaveApplicationDetails.hospital === 'Out Patient'
                        ? leaveDetails.leaveApplicationDetails.illness
                        : null}
                    </Text>
                  </View>
                  <Text style={styles.inCase}>In case of Special Leave Benefit for Women:</Text>
                  <View style={styles.leaveLabelContainer2}>
                    <Text style={styles.leaveLabel}>(Specify Illness):</Text>
                    <Text style={{ fontSize: 6, paddingLeft: 5 }}>
                      ________________________________________________
                    </Text>
                    <Text
                      style={{
                        fontSize: 8,
                        position: 'absolute',
                        width: '155',
                        marginLeft: 95,
                        paddingBottom: 3,
                      }}
                    >
                      {leaveDetails.leaveApplicationBasicInfo.leaveName ===
                        LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN && leaveDetails.leaveApplicationDetails.splWomen
                        ? leaveDetails.leaveApplicationDetails.splWomen
                        : null}
                    </Text>
                  </View>
                  <Text style={styles.inCase}>In case of Study Leave:</Text>
                  <View style={styles.leaveLabelContainer2}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.STUDY &&
                      leaveDetails.leaveApplicationDetails.forMastersCompletion === '1'
                        ? 'X'
                        : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Completion of Mater's Degree</Text>
                  </View>
                  <View style={styles.leaveLabelContainer2}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.STUDY &&
                      leaveDetails.leaveApplicationDetails.forBarBoardReview === '1'
                        ? 'X'
                        : null}
                    </Text>
                    <Text style={styles.leaveLabel}>BAR/Board Examination Review</Text>
                  </View>
                  <View style={styles.leaveLabelContainer2}>
                    <Text style={styles.leaveLabel}>Other purpose:</Text>
                    <Text style={{ fontSize: 6, paddingLeft: 8 }}>
                      _________________________________________________
                    </Text>
                    <Text
                      style={{
                        fontSize: 8,
                        position: 'absolute',
                        width: '155',
                        marginLeft: 95,
                        paddingBottom: 3,
                      }}
                    >
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.STUDY &&
                      leaveDetails.leaveApplicationDetails.studyLeaveOther
                        ? leaveDetails.leaveApplicationDetails.studyLeaveOther
                        : null}
                    </Text>
                  </View>
                  <View style={styles.leaveLabelContainer2}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.MONETIZATION ? 'X' : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Monetization of Leave Credits</Text>
                  </View>
                  <View style={styles.leaveLabelContainer2}>
                    <Text style={styles.checkbox}>
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.TERMINAL ? 'X' : null}
                    </Text>
                    <Text style={styles.leaveLabel}>Terminal Leave</Text>
                  </View>
                </View>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                {/* 6.C NUMBER OF WORKING DAYS APPLIED */}
                <View
                  style={{
                    display: 'flex',
                    borderRight: '1px solid #000',
                    flexDirection: 'column',
                    width: '52%',
                    fontSize: 9,
                    padding: 2,
                  }}
                >
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Text>6.C NUMBER OF WORKING DAYS APPLIED FOR</Text>
                    <Text
                      style={{
                        fontSize: 8,
                        position: 'absolute',
                        padding: 6,
                        marginTop: 8,
                        lineHeight: 2.1,
                        textIndent: 5,
                        width: 250,
                      }}
                    >
                      {leaveDetails.leaveApplicationBasicInfo.leaveName == LeaveName.MONETIZATION
                        ? `P${leaveDetails.employeeDetails.assignment.salary.substring(1)} x ${
                            Number(leaveDetails.leaveApplicationDetails.convertedVl) +
                            Number(leaveDetails.leaveApplicationDetails.convertedSl)
                          } day(s) x ${
                            process.env.NEXT_PUBLIC_MONETIZATION_CONSTANT
                          } = P${leaveDetails.leaveApplicationDetails.monetizedAmount.substring(1)} `
                        : leaveDetails.leaveApplicationBasicInfo.leaveName == LeaveName.TERMINAL
                        ? `P${leaveDetails.employeeDetails.assignment.salary.substring(1)} x ${
                            Number(leaveDetails.leaveApplicationDetails.vlBalance.afterTerminalLeave) +
                            Number(leaveDetails.leaveApplicationDetails.slBalance.afterTerminalLeave)
                          } day(s) x ${
                            process.env.NEXT_PUBLIC_MONETIZATION_CONSTANT
                          } = P${leaveDetails.leaveApplicationDetails.monetizedAmount.substring(1)} `
                        : leaveDetails.leaveApplicationBasicInfo.leaveDates.length}
                    </Text>
                    <Text style={{ padding: 5 }}>_____________________________________________________</Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Text
                      style={{
                        paddingLeft: 6,
                      }}
                    >
                      INCLUSIVE DATES
                    </Text>
                    <Text
                      style={{
                        fontSize: 8,
                        position: 'absolute',
                        padding: 6,
                        marginTop: 8,
                        lineHeight: 2.1,
                        textIndent: 5,
                      }}
                    >
                      {leaveDetails.leaveApplicationBasicInfo.leaveName != LeaveName.MONETIZATION &&
                      leaveDetails.leaveApplicationBasicInfo.leaveName != LeaveName.TERMINAL &&
                      leaveDetails.leaveApplicationBasicInfo.leaveDates
                        ? leaveDetails.leaveApplicationBasicInfo.leaveDates.length > 5
                          ? `From ${leaveDetails.leaveApplicationBasicInfo.leaveDates[0]} To ${
                              leaveDetails.leaveApplicationBasicInfo.leaveDates[
                                leaveDetails.leaveApplicationBasicInfo.leaveDates.length - 1
                              ]
                            }`
                          : leaveDetails.leaveApplicationBasicInfo.leaveDates.join(', ')
                        : null}
                    </Text>
                    <Text style={{ padding: 5 }}>_____________________________________________________</Text>
                  </View>
                </View>
                {/* 6.D COMMUTATION */}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '48%',
                    fontSize: 9,
                    padding: 2,
                  }}
                >
                  <Text>6.D COMMUTATION</Text>
                  <View style={styles.leaveLabelContainer2}>
                    <Text style={styles.checkbox}></Text>
                    <Text style={styles.leaveLabel}>Not Requested</Text>
                  </View>
                  <View style={styles.leaveLabelContainer2}>
                    <Text style={styles.checkbox}></Text>
                    <Text style={styles.leaveLabel}>Requested</Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      fontFamily: 'Helvetica',
                      paddingBottom: 5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Image
                      style={{
                        width: '25%',
                        position: 'absolute',
                        marginLeft: 0,
                        paddingBottom: -5,
                      }}
                      src={
                        process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                        leaveDetails?.leaveApplicationBasicInfo?.employeeSignature
                          ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                            leaveDetails?.leaveApplicationBasicInfo?.employeeSignature
                          : '/'
                      }
                    />
                    <Text style={{ paddingTop: 6, paddingLeft: 6 }}>
                      _________________________________________________
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 8,
                      }}
                    >
                      (Signature of Applicant)
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* DETAILS OF ACTION ON APPLICATION - SIGNATORIES */}
            <View style={styles.container3}>
              <Text>7. DETAILS OF ACTION ON APPLICATION</Text>
            </View>
            <View
              style={{
                display: 'flex',
                border: '1px solid #000',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                {/* 7.A CERTIFICATION OF LEAVE CREDITS */}
                <View
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid #000',
                    borderRight: '1px solid #000',
                    flexDirection: 'column',
                    width: '52%',
                    fontSize: 9,
                    padding: 2,
                  }}
                >
                  <Text>7.A CERTIFICATION OF LEAVE CREDITS</Text>

                  <Text
                    style={{
                      position: 'absolute',
                      marginLeft: 130,
                      marginTop: 18,
                    }}
                  >
                    {leaveDetails.leaveApplicationBasicInfo.dateOfFiling}
                  </Text>
                  <Text
                    style={{
                      textAlign: 'right',
                      paddingTop: 8,
                      paddingBottom: 1,
                      paddingRight: 10,
                    }}
                  >
                    As of _______________________________
                  </Text>
                  <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                    {/* LEAVE CREDIT TABLE */}
                    <View style={styles.containerTable}>
                      <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={styles.containerTableRow4}></View>
                        <View style={styles.containerTableRow}>
                          <Text>Vacation Leave</Text>
                        </View>
                        <View style={styles.containerTableRow2}>
                          <Text>Sick Leave</Text>
                        </View>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={styles.containerTableRow3}>
                          <Text>Total Earned</Text>
                        </View>
                        <View style={styles.containerTableRow}>
                          <Text>
                            {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.VACATION ||
                            leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.FORCED
                              ? (
                                  parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`) +
                                  parseFloat(`${selectedLeaveLedger[0]?.vacationLeave}`) * -1
                                )
                                  // +
                                  // (parseFloat(`${selectedLeaveLedger[0]?.forcedLeaveBalance}`) +
                                  //   parseFloat(`${selectedLeaveLedger[0]?.forcedLeave}`) * -1)
                                  .toFixed(3)
                              : leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.TERMINAL
                              ? leaveDetails.leaveApplicationDetails.vlBalance.afterTerminalLeave
                              : leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.MONETIZATION
                              ? ''
                              : '0.000'}
                          </Text>
                        </View>
                        <View style={styles.containerTableRow2}>
                          <Text>
                            {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.SICK
                              ? (
                                  parseFloat(`${selectedLeaveLedger[0]?.sickLeaveBalance}`) +
                                  parseFloat(`${selectedLeaveLedger[0]?.sickLeave}`) * -1
                                ).toFixed(3)
                              : leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.TERMINAL
                              ? leaveDetails.leaveApplicationDetails.slBalance.afterTerminalLeave
                              : leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.MONETIZATION
                              ? ''
                              : '0.000'}
                          </Text>
                        </View>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={styles.containerTableRow3}>
                          <Text>Less this application</Text>
                        </View>
                        <View style={styles.containerTableRow}>
                          <Text>
                            {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.VACATION ||
                            leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.FORCED
                              ? leaveDetails?.leaveApplicationBasicInfo?.leaveDates?.length.toFixed(3)
                              : leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.MONETIZATION
                              ? leaveDetails.leaveApplicationDetails.convertedVl
                              : leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.TERMINAL
                              ? leaveDetails.leaveApplicationDetails.vlBalance.afterTerminalLeave
                              : '0.000'}
                          </Text>
                        </View>
                        <View style={styles.containerTableRow2}>
                          <Text>
                            {' '}
                            {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.SICK
                              ? leaveDetails?.leaveApplicationBasicInfo?.leaveDates?.length.toFixed(3)
                              : leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.MONETIZATION
                              ? leaveDetails.leaveApplicationDetails.convertedSl
                              : leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.TERMINAL
                              ? leaveDetails.leaveApplicationDetails.slBalance.afterTerminalLeave
                              : leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.MONETIZATION
                              ? ''
                              : '0.000'}
                          </Text>
                        </View>
                      </View>
                      <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={styles.containerTableRow3}>
                          <Text>Balance</Text>
                        </View>
                        <View style={styles.containerTableRow}>
                          <Text>
                            {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.VACATION
                              ? parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`).toFixed(3)
                              : leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.FORCED
                              ? (
                                  parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`) -
                                  leaveDetails?.leaveApplicationBasicInfo?.leaveDates?.length
                                ).toFixed(3)
                              : leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.TERMINAL
                              ? '0.000'
                              : leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.MONETIZATION
                              ? ''
                              : parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`)}
                          </Text>
                        </View>
                        <View style={styles.containerTableRow2}>
                          <Text>
                            {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.SICK
                              ? parseFloat(`${selectedLeaveLedger[0]?.sickLeaveBalance}`).toFixed(3)
                              : leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.TERMINAL
                              ? '0.000'
                              : leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.MONETIZATION
                              ? ''
                              : parseFloat(`${selectedLeaveLedger[0]?.sickLeaveBalance}`).toFixed(3)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* HRMO SIGNATURE */}
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                      <Image
                        style={{
                          width: '18%',
                          position: 'absolute',
                          paddingBottom: 7,
                        }}
                        src={
                          process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                          leaveDetails.leaveApplicationBasicInfo?.hrmoSignature
                            ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                              leaveDetails.leaveApplicationBasicInfo?.hrmoSignature
                            : '/'
                        }
                      />
                      <Text style={{ textAlign: 'center', paddingTop: 22 }}>
                        {leaveDetails.leaveApplicationBasicInfo?.hrmoApprovedByName ?? ''}
                      </Text>
                      <Text style={{ paddingLeft: 6, paddingTop: -8 }}>
                        _________________________________________________
                      </Text>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 7,
                          paddingTop: -8,
                        }}
                      >
                        Authorized Officer
                      </Text>
                    </View>
                  </View>
                </View>
                {/* 7.B RECOMMENDATION */}
                <View
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid #000',
                    flexDirection: 'column',
                    width: '48%',
                    fontSize: 9,
                    padding: 2,
                  }}
                >
                  <Text>7.B RECOMMENDATION</Text>
                  <View style={{ height: 20 }}></View>
                  <View style={styles.leaveLabelContainer2}>
                    <Text style={styles.checkbox}>
                      {leaveDetails?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED ? 'X' : null}
                    </Text>
                    <Text style={styles.leaveLabel}>For approval</Text>
                  </View>
                  <View style={styles.leaveLabelContainer2}>
                    <Text style={styles.checkbox}>
                      {leaveDetails?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM ||
                      leaveDetails?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO ||
                      leaveDetails?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                        ? 'X'
                        : null}
                    </Text>
                    <Text style={styles.leaveLabel}>For disapproval due to</Text>
                  </View>
                  <View style={{ marginLeft: 30 }}>
                    <Text
                      style={{
                        position: 'absolute',
                        padding: 5,
                        lineHeight: 2.2,
                      }}
                    >
                      {leaveDetails.leaveApplicationBasicInfo.supervisorDisapprovalRemarks
                        ? leaveDetails.leaveApplicationBasicInfo.supervisorDisapprovalRemarks
                        : leaveDetails.leaveApplicationBasicInfo.hrdmDisapprovalRemarks
                        ? leaveDetails.leaveApplicationBasicInfo.hrdmDisapprovalRemarks
                        : ''}
                    </Text>
                    <Text style={{ padding: 5 }}>____________________________________________</Text>
                    <Text style={{ padding: 5 }}>____________________________________________</Text>
                    <Text style={{ padding: 5 }}>____________________________________________</Text>
                  </View>
                  {/* SUPERVISOR SIGNATURE */}
                  <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                      style={{
                        width: '18%',
                        position: 'absolute',
                        paddingBottom: 18,
                      }}
                      src={
                        process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                        leaveDetails.leaveApplicationBasicInfo?.supervisorSignature
                          ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                            leaveDetails.leaveApplicationBasicInfo?.supervisorSignature
                          : '/'
                      }
                    />
                    <Text style={{ textAlign: 'center', paddingTop: 22 }}>
                      {leaveDetails.leaveApplicationBasicInfo?.supervisorName ?? ''}
                    </Text>
                    <Text style={{ paddingLeft: 6, paddingTop: -8 }}>
                      _________________________________________________
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 7,
                        paddingTop: -8,
                      }}
                    >
                      Authorized Officer
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  fontSize: 9,
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                {/* 7.C APPROVED FOR */}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    padding: 2,
                    width: '52%',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Text>7.C APPROVED FOR:</Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <Text
                      style={{
                        position: 'absolute',
                        marginTop: 0,
                        marginLeft: 13,
                      }}
                    >
                      {leaveDetails.leaveApplicationBasicInfo.leaveName != LeaveName.LEAVE_WITHOUT_PAY &&
                      leaveDetails.leaveApplicationBasicInfo.leaveName != LeaveName.MONETIZATION &&
                      leaveDetails.leaveApplicationBasicInfo.leaveName != LeaveName.TERMINAL
                        ? leaveDetails?.leaveApplicationBasicInfo?.leaveDates?.length
                        : 0}
                    </Text>
                    <Text>_______ days with pay</Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <Text
                      style={{
                        position: 'absolute',
                        marginTop: 0,
                        marginLeft: 13,
                      }}
                    >
                      {leaveDetails.leaveApplicationBasicInfo.leaveName === LeaveName.LEAVE_WITHOUT_PAY
                        ? leaveDetails?.leaveApplicationBasicInfo?.leaveDates?.length
                        : 0}
                    </Text>
                    <Text>_______ days without pay</Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <Text
                      style={{
                        position: 'absolute',
                        marginTop: 0,
                        marginLeft: 13,
                      }}
                    >
                      {0}
                    </Text>
                    <Text>_______ others (Specify)</Text>
                  </View>
                </View>
                {/* 7.D DISAPPROVED DUE TO REMARKS */}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 2,
                    width: '48%',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Text>7.D DISAPPROVED DUE TO:</Text>
                  <View style={{ marginLeft: 30 }}>
                    <Text
                      style={{
                        position: 'absolute',
                        padding: 5,
                        lineHeight: 2.2,
                      }}
                    >
                      {leaveDetails.leaveApplicationBasicInfo.supervisorDisapprovalRemarks
                        ? leaveDetails.leaveApplicationBasicInfo.supervisorDisapprovalRemarks
                        : leaveDetails.leaveApplicationBasicInfo.hrdmDisapprovalRemarks
                        ? leaveDetails.leaveApplicationBasicInfo.hrdmDisapprovalRemarks
                        : ''}
                    </Text>
                    <Text style={{ padding: 5 }}>____________________________________________</Text>
                    <Text style={{ padding: 5 }}>____________________________________________</Text>
                    <Text style={{ padding: 5 }}>____________________________________________</Text>
                  </View>
                </View>
              </View>
              {/* HRDM SIGNATURE */}
              <View
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontFamily: 'Helvetica',
                  paddingBottom: 20,
                }}
              >
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <Image
                    style={{
                      width: '12%',
                      position: 'absolute',
                      paddingBottom: 20,
                    }}
                    src={
                      process.env.NEXT_PUBLIC_IMAGE_SERVER_URL + leaveDetails.leaveApplicationBasicInfo?.hrdmSignature
                        ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                          leaveDetails.leaveApplicationBasicInfo?.hrdmSignature
                        : '/'
                    }
                  />
                  <Text style={{ textAlign: 'center', paddingTop: 22, fontSize: 9 }}>
                    {leaveDetails.leaveApplicationBasicInfo?.hrdmApprovedByName ?? ''}
                  </Text>
                  <Text style={{ paddingLeft: 6, paddingTop: -15 }}>_____________________</Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 7,
                      paddingTop: -15,
                    }}
                  >
                    Authorized Officer
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Page>
        {/* 2ND PAGE - INSTRUCTIONS */}
        <Page size={'A4'}>
          <View style={styles.page}>
            <View style={styles.container3}>
              <Text>INSTRUCTIONS AND REQUIREMENTS</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 5,
                fontSize: 9,
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  padding: 2,
                  width: '52%',
                  justifyContent: 'flex-start',
                }}
              >
                <Text>
                  Application for any type of leave shall be made on this Form and to be accomplished at least in
                  duplicate with documentary requirements, as follows:
                </Text>
                <Text style={{ fontFamily: 'Helvetica-Bold', paddingTop: 8 }}>1. Vacation leave*</Text>
                <Text>
                  It shall be filed five (5) days in advance, whenever possible, of the effective date of such leave.
                  Vacation leave within in the Philippines or abroad shall be indicated in the form for purpose of
                  securing travel authority and completing clearance from money and work accountabilities.
                </Text>

                <Text style={{ fontFamily: 'Helvetica-Bold', paddingTop: 8 }}>2. Mandatory/Forced leave*</Text>
                <Text>
                  Annual five-day vacation leave shall be forfeited if not taken during the year. In case the scheduled
                  leave has been cancelled in the exigency of the service by the head of agency, it shall no longer be
                  deducted from the accumulated vacation leave. Availment of one (1) day or more Vacation Leave (VL)
                  shall be considered for complying the mandatory/forced leave subject to the conditions under Section
                  25, Rule XVI of the Omnibus Rules Implementing E.O. No. 292.
                </Text>

                <Text style={{ fontFamily: 'Helvetica-Bold', paddingTop: 8 }}>3. Sick leave*</Text>
                <Text>* It shall be filed immediately upon employee's return from such leave.</Text>
                <Text>
                  * If filed in advance or exceeding five (5) days, application shall be accompanied by a medical
                  certificate. In case medical consultation was not availed of, an affidavit should be executed by an
                  applicant.
                </Text>

                <Text style={{ fontFamily: 'Helvetica-Bold', paddingTop: 8 }}>4. Maternity leave* - 105 days</Text>
                <Text>
                  * Proof of pregnancy e.g. ultrasound, doctor's certificate on the expected date of delivery.
                </Text>
                <Text>
                  * Accomplished Noticed of Allocation of Maternity Leave Credits (CS Form No. 6a), if needed.
                </Text>
                <Text>
                  * Seconded female employees shall enjoy maternity leave with full pay in the recipient agency.
                </Text>

                <Text style={{ fontFamily: 'Helvetica-Bold', paddingTop: 8 }}>5. Paternity leave - 7 days</Text>
                <Text>
                  Proof of child's delivery e.g. birth certificate, medical certificate and marriage contract.
                </Text>

                <Text style={{ fontFamily: 'Helvetica-Bold', paddingTop: 8 }}>6. Special Privilege leave - 3 days</Text>
                <Text>
                  It shall be filed/approved for at least one (1) week prior to availment, except on emergency cases.
                  Special privilege leave within the Philippines or abroad shall be indicated in the form for purposes
                  of securing travel authority and completing clearance from money and work accountabilities.
                </Text>

                <Text style={{ fontFamily: 'Helvetica-Bold', paddingTop: 8 }}>7. Solo Parent leave - 7 days</Text>
                <Text>
                  It shall be filed in advance or whenever possible five (5) days before going on such leave with
                  updated Solo Parent Identification Card.
                </Text>

                <Text style={{ fontFamily: 'Helvetica-Bold', paddingTop: 8 }}>8. Study leave* - up to 6 months</Text>
                <Text>* Shall meet the agency's internal requirements, if any;</Text>
                <Text>* Contract between the agency head or authorized representative and employee concerned.</Text>

                <Text style={{ fontFamily: 'Helvetica-Bold', paddingTop: 8 }}>9. VAWC leave - 10 days</Text>
                <Text>
                  * It shall be filed in advance or immediately upon the woman employee's return from such leave.
                </Text>
                <Text>* It shall be accompanied by any of the following supporting documents:</Text>
                <Text>a. Barangay Protection Order (BPO) obtained from the barangay;</Text>
                <Text>b. Temporary/Permanent Protection Order (TPO/PPO) obtained from the court;</Text>
                <Text>
                  c. If the protection order is not yet issued by the barangay or the court, a certification issued by
                  the Punong Barangay/Kagawad or Prosecutor or the Clerk of Court that the application for the BPO, TPO
                  or PPO has been filed with the said office shall be sufficient to support the application for the
                  ten-day leave; or
                </Text>
              </View>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 2,
                  width: '48%',
                  justifyContent: 'flex-start',
                }}
              >
                <Text>
                  d. In the absence of the BPO/TPO/PPO or the certification, a police report specifying the details of
                  the occurrence of violence on the victim and a medical certificate may be considered, at the
                  discretion of the immediate supervisor of the woman employee concerned.
                </Text>

                <Text style={{ fontFamily: 'Helvetica-Bold', paddingTop: 8 }}>
                  10. Rehabilitation leave* - up to 6 months
                </Text>
                <Text>
                  * Application shall be made within one (1) week from the time of the accident except when a longer
                  period is warranted.
                </Text>
                <Text>* Letter request supported by relevant reports such as the police report, if any,</Text>
                <Text>
                  * Medical certificate on the nature of the injuries, the course of treatment involved, and the need to
                  undergo rest, recuperation, and rehabilitation, as the case may be.
                </Text>
                <Text>
                  * Written concurrence of a government physician should be obtained relative to the recommendation for
                  rehabilitation if the attending physician is a private practicioner, particularly on the duration of
                  the period of rehabilitation.
                </Text>

                <Text style={{ fontFamily: 'Helvetica-Bold', paddingTop: 8 }}>
                  11. Special leave benefits for women* - up to 2 months
                </Text>
                <Text>
                  * The application may be filed in advance, that is, at least five (5) days prior to the scheduled date
                  of the gynercological surgery that will be undergone by the employee. In case of emergency, the
                  application for special leave shall be filed immediately upon employee's return but during confinement
                  the agency shall be notified of said surgery.{' '}
                </Text>
                <Text>
                  * The application shall be accompanied by a medical certificate filled out by the proper medical
                  authorities, e.g. the attending surgeon accompanied by a clinical summary reflecting the gynecological
                  disorder which shall be addressed or was addressed by the said surgery; the histopathological report;
                  the operative technique used for the surgery; the duration of the surgery including the perioperative
                  period (period of confinement around surgery); as well as the employees estimated period of
                  recuperation for the same.
                </Text>

                <Text style={{ fontFamily: 'Helvetica-Bold', paddingTop: 8 }}>
                  12. Special Emergency (Calamity) leave - up to 5 days
                </Text>
                <Text>
                  * The special emergency leave can be applied for a maximum of five (5) straight working days or
                  staggered basis within thirty (30) days from the actual occurence of the natural calamity/disaster.
                  Said privilege shall be enjoyed once a year, not in every instance of calamity or disaster.
                </Text>
                <Text>
                  * The head of office shall take full responsibility for the grant of special emergency leave and
                  verification of the employee's eligibility to be granted thereof. Said verification shall include:
                  validation of place of residence based on latest available records of the affected employee;
                  verification that the place of residence is covered in the declaration of calamity area by the proper
                  government agency; and such other proofs as may be necessary.
                </Text>

                <Text style={{ fontFamily: 'Helvetica-Bold', paddingTop: 8 }}>13. Monetization of leave credits</Text>
                <Text>
                  Application for monetization of fifty percent (50%) or more of the accumulated leave credits shall be
                  accompanied by letter request to the head of the agency stating the valid and justifiable reasons.
                </Text>

                <Text style={{ fontFamily: 'Helvetica-Bold', paddingTop: 8 }}>14. Terminal leave*</Text>
                <Text>Proof of employee's resignation or retirement or separation from the service.</Text>

                <Text style={{ fontFamily: 'Helvetica-Bold', paddingTop: 8 }}>15. Adoption</Text>
                <Text>
                  * Application for adoption leave shall be filed with an authenticated copy of the Pre-Adoptive
                  Placement Authority issued by the Department of Social Welfare and Development (DSWD).{' '}
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 9, paddingTop: 20 }}>
              * For leave of absence for thirty (30) calendar days or more and terminal leave, application shall be
              accompanied by a clearance from money, property and work-related accountabilities (persuant to CSC
              Memorandum Circular No. 2, s. 1985).
            </Text>
          </View>
        </Page>
      </Document>
    </>
  );
};

export default LeavePdf;
