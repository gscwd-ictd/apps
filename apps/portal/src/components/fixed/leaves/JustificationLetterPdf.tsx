/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, View, Image, Font } from '@react-pdf/renderer';
import React from 'react';
import { EmployeeDetails } from '../../../types/employee.type';
import { EmployeeLeaveDetails } from '../../../../../../libs/utils/src/lib/types/leave-application.type';
import Html from 'react-pdf-html';

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
  p: {
    fontWeight: 900,
  },
});

type JustificationLetterPdfProps = {
  leaveDetails: EmployeeLeaveDetails;
};

export const JustificationLetterPdf = ({ leaveDetails }: JustificationLetterPdfProps): JSX.Element => {
  const html = `
  <html>
  <body>
  <style>
    p {
      margin-top: 0px; /* between paragraphs */
      margin-bottom: 10px; /* between paragraphs */
      font-size: 16px;
     },
  </style>
  ${
    leaveDetails?.leaveApplicationBasicInfo?.lateFilingJustification != null &&
    leaveDetails?.leaveApplicationBasicInfo?.lateFilingJustification != '' &&
    leaveDetails?.leaveApplicationBasicInfo?.lateFilingJustification != '<p></p>'
      ? leaveDetails?.leaveApplicationBasicInfo?.lateFilingJustification
      : '<p>No Letter Found</p>'
  }
  </body>
  </html>
  `;
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
                    fontSize: 18,
                    paddingTop: 20,
                    fontFamily: 'Helvetica-Bold',
                  }}
                >
                  Justification Letter
                </Text>
              </View>
            </View>

            <View style={{ height: 30 }}></View>

            {/* actual justification letter in html */}
            <Html>{html}</Html>

            <View style={styles.container}>
              <View
                style={{
                  width: '30%',
                  textAlign: 'center',
                  // fontFamily: 'Helvetica',
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
                <Text style={{ paddingTop: 0, textAlign: 'center', fontSize: 14 }}>
                  {' '}
                  {leaveDetails.leaveApplicationBasicInfo.employeeName}
                </Text>
                <Text style={{ marginTop: -12, textAlign: 'center' }}>_____________</Text>
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
