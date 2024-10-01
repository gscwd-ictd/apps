/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @nx/enforce-module-boundaries */
import { PdfHeader } from '@gscwd-apps/oneui';
import { Page, Text, Document, StyleSheet, View, Image } from '@react-pdf/renderer';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { OvertimAuthorizationEmployee, OvertimeAuthorization } from 'libs/utils/src/lib/types/overtime.type';

const styles = StyleSheet.create({
  page: {
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
    width: '97%',
  },
  headerMain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    paddingLeft: 180,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 8,
    width: '100%',
  },
  controlNumber: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 5,
    fontSize: 8,
    width: '100%',
  },

  pdfTitle: {
    fontSize: 18,
    fontWeight: 'heavy',
    textAlign: 'center',
    paddingTop: 5,
  },
});

type PdfProps = {
  overtimeAuthorizationReport: OvertimeAuthorization;
};

export const OvertimeAuthorizationPdf = ({ overtimeAuthorizationReport }: PdfProps): JSX.Element => {
  return (
    <>
      <Document title="Overtime Authorization Report">
        <Page size={'A4'} orientation="portrait">
          <View style={styles.page}>
            <View style={styles.controlNumber}>
              <Text>{/* NO. 1 */}</Text>
            </View>
            <PdfHeader />
            <Text style={styles.pdfTitle}>OVERTIME AUTHORIZATION</Text>

            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                fontSize: 9,
                paddingTop: 10,
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <Text>Purpose: ________________________________________________________________________</Text>
              <Text
                style={{
                  position: 'absolute',
                  marginTop: 10,
                  marginLeft: 60,
                  width: 350,
                }}
              >
                {overtimeAuthorizationReport?.purpose}
              </Text>
              <Text>Date Covered: _____________</Text>
              <Text
                style={{
                  position: 'absolute',
                  marginTop: 10,
                  marginLeft: 505,
                  width: 90,
                }}
              >
                {DateFormatter(overtimeAuthorizationReport?.plannedDate, 'MM-DD-YYYY')}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                fontSize: 9,
                paddingTop: 0,
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <Text
                style={{
                  marginLeft: 38,
                }}
              >
                ________________________________________________________________________
              </Text>

              <Text>Estimated Hours: _______</Text>
              <Text
                style={{
                  position: 'absolute',
                  marginTop: 0,
                  marginLeft: 530,
                  width: 90,
                }}
              >
                {overtimeAuthorizationReport?.estimatedHours}
              </Text>
            </View>

            {/* MAIN TABLE CONTAINER */}
            <View
              style={{
                width: 'auto',
                display: 'flex',
                // borderBottom: '1px solid #000',
                borderRight: '1px solid #000',
                borderTop: '1px solid #000',
                borderLeft: '1px solid #000',
                flexDirection: 'column',
                marginLeft: 20,
                marginRight: 20,
                marginTop: 10,
                fontSize: 9,
              }}
            >
              {/* HEADERS */}
              <View
                style={{
                  width: 'auto',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    flexDirection: 'column',
                    fontSize: 9,
                    padding: 4,
                    width: '35%',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>{`EMPLOYEE'S NAME`}</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    flexDirection: 'column',
                    fontSize: 9,
                    padding: 2,
                    width: '15%',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>EMPLOYEE NO.</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid #000',
                    flexDirection: 'column',
                    fontSize: 9,
                    padding: 2,
                    width: '50%',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>OFFICE/DEPARTMENT/DIVISION</Text>
                </View>
              </View>
            </View>
            {overtimeAuthorizationReport?.employees?.map((employee: OvertimAuthorizationEmployee, idx: number) => (
              <View
                key={idx}
                style={{
                  width: 'auto',
                  display: 'flex',
                  borderBottom: '1px solid #000',
                  borderRight: '1px solid #000',
                  borderLeft: '1px solid #000',
                  flexDirection: 'column',
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 0,
                  fontSize: 9,
                }}
              >
                {/* HEADERS */}
                <View
                  style={{
                    width: 'auto',
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <View
                    style={{
                      display: 'flex',
                      borderRight: '1px solid #000',
                      flexDirection: 'column',
                      fontSize: 9,
                      padding: 4,
                      width: '35%',
                      textAlign: 'center',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Text>{employee.name}</Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      borderRight: '1px solid #000',

                      flexDirection: 'column',
                      fontSize: 9,
                      padding: 2,
                      width: '15%',
                      textAlign: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text>{employee.companyId}</Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      fontSize: 9,
                      width: '50%',
                      textAlign: 'center',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      padding: 4,
                    }}
                  >
                    <Text>{employee.assignment}</Text>
                  </View>
                </View>
              </View>
            ))}
            {/* SIGNATORIES */}
            <View
              style={{
                width: 'auto',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                fontSize: 9,
                paddingTop: 20,
                paddingLeft: 35,
                paddingRight: 35,
              }}
            >
              <Text>Prepared and Requested by:</Text>
              <Text
                style={{
                  marginRight: 205,
                }}
              >
                Approved by:
              </Text>
            </View>

            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                fontSize: 9,
                paddingTop: 0,
                paddingLeft: 30,
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
                  style={{ width: 50, marginBottom: 2 }}
                  src={
                    process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                      overtimeAuthorizationReport?.signatories?.employeeSignature ?? '/'
                  }
                />
                <Text
                  style={{
                    marginBottom: -8,
                    width: 165,
                    textAlign: 'center',
                  }}
                >
                  {overtimeAuthorizationReport?.signatories?.employeeName}
                </Text>
                <Text>_______________________________</Text>
                <Text
                  style={{
                    marginTop: 2,
                    textAlign: 'center',
                  }}
                >
                  Supervisor
                </Text>
              </View>

              <View
                style={{
                  width: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 9,
                  paddingTop: 0,
                }}
              >
                <Text
                  style={{
                    marginBottom: -8,
                    width: 165,
                    textAlign: 'center',
                  }}
                >
                  {overtimeAuthorizationReport?.requestedDate}
                </Text>
                <Text>_____________</Text>
                <Text
                  style={{
                    marginTop: 2,
                    textAlign: 'center',
                  }}
                >
                  Date
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
                  paddingTop: 0,
                }}
              >
                <Image
                  style={{ width: 50, marginBottom: 2 }}
                  src={
                    process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                      overtimeAuthorizationReport?.signatories?.supervisorSignature ?? '/'
                  }
                />
                <Text
                  style={{
                    marginBottom: -8,
                    width: 165,
                    textAlign: 'center',
                  }}
                >
                  {overtimeAuthorizationReport?.signatories?.supervisorName}
                </Text>
                <Text>_______________________________</Text>
                <Text
                  style={{
                    marginTop: 2,
                    textAlign: 'center',
                  }}
                >
                  Division/Department Manager
                </Text>
              </View>

              <View
                style={{
                  width: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 9,
                  paddingTop: 0,
                }}
              >
                <Text
                  style={{
                    marginBottom: -8,
                    width: 165,
                    textAlign: 'center',
                  }}
                >
                  {overtimeAuthorizationReport?.managerApprovalDate}
                </Text>
                <Text>_____________</Text>
                <Text
                  style={{
                    marginTop: 2,
                    textAlign: 'center',
                  }}
                >
                  Date
                </Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
};

export default OvertimeAuthorizationPdf;
