/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @nx/enforce-module-boundaries */
import { PdfHeader } from '@gscwd-apps/oneui';
import { Page, Text, Document, StyleSheet, View, Image } from '@react-pdf/renderer';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { OvertimeAccomplishmentReport } from 'libs/utils/src/lib/types/overtime.type';

const styles = StyleSheet.create({
  page: {
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  controlNumber: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 5,
    fontSize: 8,
  },

  pdfTitle: {
    fontSize: 18,
    fontWeight: 'heavy',
    textAlign: 'center',
    paddingTop: 5,
  },
});

type PdfProps = {
  overtimeAccomplishmentReport: OvertimeAccomplishmentReport;
};

export const OvertimeAccomplishmentReportPdf = ({ overtimeAccomplishmentReport }: PdfProps): JSX.Element => {
  return (
    <>
      <Document title="Overtime Accomplishment Report">
        <Page size={'A4'} orientation="portrait">
          <View style={styles.page}>
            <View style={styles.controlNumber}>{/* <Text>NO. 1</Text> */}</View>
            <PdfHeader />
            <Text style={styles.pdfTitle}>ACCOMPLISHMENT REPORT ON OVERTIME AUTHORIZATION</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                fontSize: 9,
                paddingTop: 20,
                paddingLeft: 35,
                paddingRight: 35,
              }}
            >
              <Text>Name: ____________________________________</Text>
              <Text
                style={{
                  position: 'absolute',
                  marginLeft: 65,
                  marginTop: 20,
                  width: 175,
                }}
              >
                {overtimeAccomplishmentReport?.employeeName}
              </Text>
              <Text>Office/Department/Division: ______________________________________</Text>
              <Text
                style={{
                  position: 'absolute',
                  marginLeft: 355,
                  marginTop: 20,
                  width: 200,
                }}
              >
                {overtimeAccomplishmentReport?.assignment}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                fontSize: 9,
                paddingTop: 10,
                paddingLeft: 35,
                paddingRight: 35,
              }}
            >
              <Text>Date: _____________</Text>
              <Text
                style={{
                  position: 'absolute',

                  marginTop: 10,
                  width: 90,
                }}
              >
                {DateFormatter(overtimeAccomplishmentReport?.date, 'MM-DD-YYYY')}
              </Text>
            </View>
            {/* MAIN TABLE CONTAINER */}
            <View
              style={{
                display: 'flex',
                border: '1px solid #000',
                flexDirection: 'column',
                marginLeft: 31,
                marginRight: 31,
                marginTop: 10,
                fontSize: 9,
              }}
            >
              {/* DATE AND WORK ACTIVITY ROW */}
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid #000',
                    flexDirection: 'column',
                    fontSize: 9,
                    padding: 6,
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  <Text>WORK ACTIVITY</Text>
                </View>
              </View>
              {/* ACCOMPLISHMENTS */}
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <View
                  style={{
                    display: 'flex',

                    flexDirection: 'column',
                    fontSize: 9,
                    padding: 6,
                    width: '100%',
                    height: 80,
                    textAlign: 'justify',
                  }}
                >
                  <Text>{overtimeAccomplishmentReport?.accomplishments}</Text>
                </View>
              </View>
            </View>
            {/* SIGNATORIES */}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                fontSize: 9,
                paddingTop: 10,
                paddingLeft: 35,
                paddingRight: 35,
              }}
            >
              <Text>Submitted by:</Text>
              <Text
                style={{
                  marginRight: 155,
                }}
              >
                Noted by:
              </Text>
            </View>
            {/* SIGNATURES */}

            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                fontSize: 9,
                paddingRight: 20,
                paddingLeft: 20,
              }}
            >
              <View
                style={{
                  width: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  fontSize: 9,
                  paddingTop: 0,
                  gap: 0,
                }}
              >
                <Image
                  style={{ width: 30, marginBottom: 2 }}
                  src={
                    process.env.NEXT_PUBLIC_IMAGE_SERVER_URL + overtimeAccomplishmentReport?.employeeSignature
                      ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL + overtimeAccomplishmentReport?.employeeSignature
                      : '/'
                  }
                />

                <Text
                  style={{
                    marginBottom: -8,
                    width: 165,
                    textAlign: 'center',
                  }}
                >
                  {overtimeAccomplishmentReport?.employeeName}
                </Text>
                <Text>_______________________________</Text>
                <Text
                  style={{
                    marginTop: 2,
                    textAlign: 'center',
                  }}
                >
                  Signature Over Printed Name
                </Text>
              </View>

              <View
                style={{
                  width: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  fontSize: 9,
                  gap: 0,
                }}
              >
                <Image
                  style={{ width: 40, marginBottom: 2 }}
                  src={
                    process.env.NEXT_PUBLIC_IMAGE_SERVER_URL + overtimeAccomplishmentReport?.supervisorSignature
                      ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL + overtimeAccomplishmentReport?.supervisorSignature
                      : '/'
                  }
                />

                <Text
                  style={{
                    marginBottom: -8,
                    width: 165,
                    textAlign: 'center',
                  }}
                >
                  {overtimeAccomplishmentReport?.supervisorName}
                </Text>
                <Text>_______________________________</Text>
                <Text
                  style={{
                    marginTop: 2,
                    textAlign: 'center',
                  }}
                >
                  {overtimeAccomplishmentReport?.supervisorPosition}
                </Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
};

export default OvertimeAccomplishmentReportPdf;
