/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, View, Image } from '@react-pdf/renderer';
import React from 'react';
import { EmployeeDetails } from '../../../types/employee.type';
import { EmployeeLeaveDetails } from '../../../../../../libs/utils/src/lib/types/leave-application.type';
import { LeaveName, LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';

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
    alignItems: 'flex-start',
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

type JustificationLetterPdfProps = {
  employeeDetails: EmployeeDetails;
  leaveDetails: EmployeeLeaveDetails;
};

export const JustificationLetterPdf = ({ employeeDetails, leaveDetails }: JustificationLetterPdfProps): JSX.Element => {
  return (
    <>
      <Document title="Leave">
        <Page size={'A4'}>
          <View style={styles.page}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 5,
                justifyContent: 'center',
              }}
            >
              <View style={styles.header}>
                <Text
                  style={{
                    fontSize: 14,
                    paddingTop: 20,
                    fontFamily: 'Helvetica-Bold',
                  }}
                >
                  JUSTIFICATION LETTER
                </Text>
              </View>
            </View>

            <View style={{ height: 5 }}></View>
            {/* OFFICE and Employee Name */}
            <View style={styles.container}>
              <Text
                style={{
                  paddingTop: 20,
                  fontSize: 16,
                }}
              >
                {leaveDetails.employeeDetails.assignment.name}
                Dear [Name], I am writing to sincerely apologize for [briefly describe the incident or action that
                requires an apology]. My behavior/actions were unacceptable, and I take full responsibility. I
                understand that my [behavior/actions] caused you [distress, inconvenience, etc.] and I feel terrible
                about that. You deserved much better from me. I made a mistake, and I am sorry. Going forward, I will
                [describe specific steps you will take to remedy the situation or ensure it does not happen again].
                Please let me know if there is anything I can do to make this right. Again, I am truly sorry. I hope
                that you can accept my apology and that we can move forward in a positive way.
              </Text>

              <View
                style={{
                  width: '30%',
                  textAlign: 'center',
                  fontFamily: 'Helvetica',
                  paddingBottom: 5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  style={{
                    paddingTop: 20,
                    width: '25%',
                    marginLeft: 0,
                  }}
                  src={
                    process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                    leaveDetails?.leaveApplicationBasicInfo?.employeeSignature
                      ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                        leaveDetails?.leaveApplicationBasicInfo?.employeeSignature
                      : '/'
                  }
                />
                <Text style={{ paddingTop: 6, textAlign: 'center' }}>
                  {' '}
                  {leaveDetails.leaveApplicationBasicInfo.employeeName}
                </Text>
                <Text style={{ paddingTop: 6, textAlign: 'center' }}>_____________</Text>
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
        </Page>
      </Document>
    </>
  );
};

export default JustificationLetterPdf;
