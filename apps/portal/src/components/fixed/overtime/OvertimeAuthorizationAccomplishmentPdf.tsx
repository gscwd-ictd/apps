/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @nx/enforce-module-boundaries */
import { PdfHeader } from '@gscwd-apps/oneui';
import { Page, Text, Document, StyleSheet, View, Image } from '@react-pdf/renderer';
import { UseCapitalizer } from 'apps/employee-monitoring/src/utils/functions/Capitalizer';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import {
  OvertimAuthorizationEmployee,
  OvertimeAccomplishmentSummary,
  OvertimeAuthorization,
  OvertimeAuthorizationAccomplishment,
} from 'libs/utils/src/lib/types/overtime.type';

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
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
    fontSize: 10,
    fontWeight: 'heavy',
    textAlign: 'center',
    paddingTop: 1,
  },
});

type PdfProps = {
  overtimeAuthorizationAccomplishmentReport: OvertimeAuthorizationAccomplishment;
  selectedEmployeeType: string;
};

export const OvertimeAuthorizationAccomplishmentPdf = ({
  overtimeAuthorizationAccomplishmentReport,
  selectedEmployeeType,
}: PdfProps): JSX.Element => {
  return (
    <>
      <Document title="Overtime Authorization-Accomplishment Summary Report">
        <Page
          size={'FOLIO'}
          orientation="landscape"
          style={{
            paddingBottom: 25,
            paddingTop: 25,
          }}
        >
          <View style={styles.page}>
            <View style={styles.controlNumber}>
              <Text>{/* NO. 1 */}</Text>
            </View>
            <PdfHeader />
            <Text style={styles.pdfTitle}>{overtimeAuthorizationAccomplishmentReport?.orgName?.toUpperCase()}</Text>
            <Text style={styles.pdfTitle}>
              OVERTIME AUTHORIZATION-ACCOMPLISHMENT SUMMARY FOR {selectedEmployeeType?.toUpperCase()} EMPLOYEES
            </Text>
            <Text style={[styles.pdfTitle, { paddingBottom: 10 }]}>
              PERIOD COVERED:{' '}
              <Text style={[styles.pdfTitle, { paddingLeft: 3, paddingRight: 3, textDecoration: 'underline' }]}>
                {overtimeAuthorizationAccomplishmentReport.periodCovered}
              </Text>
            </Text>

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
                    fontSize: 7,
                    padding: 4,
                    width: '18%',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>NAME</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    flexDirection: 'column',
                    fontSize: 7,
                    padding: 2,
                    width: '6%',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>EMP. NO.</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    flexDirection: 'column',
                    fontSize: 7,
                    padding: 2,
                    width: '20%',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>PURPOSE</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    flexDirection: 'column',
                    fontSize: 7,
                    padding: 2,
                    width: '6%',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>DATE</Text>
                  <Text>APPLIED</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    flexDirection: 'column',
                    fontSize: 7,
                    padding: 2,
                    width: '6%',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>DATE</Text>
                  <Text>RENDERED</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    flexDirection: 'column',
                    fontSize: 7,
                    padding: 2,
                    width: '5%',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>EST.</Text>
                  <Text>HOURS</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    flexDirection: 'column',
                    fontSize: 7,
                    padding: 2,
                    width: '5%',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>ACTUAL</Text>
                  <Text>HOURS</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    flexDirection: 'column',
                    fontSize: 7,
                    padding: 2,
                    width: '8%',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>OT APP.</Text>
                  <Text>STATUS</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    borderRight: '1px solid #000',
                    borderBottom: '1px solid #000',
                    flexDirection: 'column',
                    fontSize: 7,
                    padding: 2,
                    width: '26%',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>ACCOMPLISHMENT</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid #000',
                    flexDirection: 'column',
                    fontSize: 7,
                    padding: 2,
                    width: '8%',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text>OT ACCOM.</Text>
                  <Text>STATUS</Text>
                </View>
              </View>
            </View>
            {overtimeAuthorizationAccomplishmentReport?.summary?.map(
              (employee: OvertimeAccomplishmentSummary, idx: number) => (
                <View
                  wrap={false}
                  key={idx}
                  style={{
                    width: 'auto',
                    display: 'flex',
                    borderTop: '1px solid #000',
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
                        fontSize: 7,
                        padding: 4,
                        width: '18%',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Text>{employee?.employeeName}</Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        borderRight: '1px solid #000',
                        flexDirection: 'column',
                        fontSize: 7,
                        padding: 2,
                        width: '6%',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text>{employee?.companyId}</Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        borderRight: '1px solid #000',
                        flexDirection: 'column',
                        fontSize: 7,
                        width: '20%',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        padding: 4,
                      }}
                    >
                      <Text>{employee?.purpose}</Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        borderRight: '1px solid #000',
                        flexDirection: 'column',
                        fontSize: 7,
                        width: '6%',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 4,
                      }}
                    >
                      <Text>{employee?.applicationDate}</Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        borderRight: '1px solid #000',
                        flexDirection: 'column',
                        fontSize: 7,
                        width: '6%',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 4,
                      }}
                    >
                      <Text>{employee?.plannedDate}</Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        borderRight: '1px solid #000',
                        flexDirection: 'column',
                        fontSize: 7,
                        width: '5%',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 4,
                      }}
                    >
                      <Text>{employee?.estimatedHours}</Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        borderRight: '1px solid #000',
                        flexDirection: 'column',
                        fontSize: 7,
                        width: '5%',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 4,
                      }}
                    >
                      <Text>{employee?.actualHours}</Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        borderRight: '1px solid #000',
                        flexDirection: 'column',
                        fontSize: 7,
                        width: '8%',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 4,
                      }}
                    >
                      <Text>{UseCapitalizer(employee?.otStatus)}</Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        borderRight: '1px solid #000',
                        flexDirection: 'column',
                        fontSize: 7,
                        width: '26%',

                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        padding: 4,
                      }}
                    >
                      <Text>{employee?.accomplishments}</Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: 7,
                        width: '8%',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 4,
                      }}
                    >
                      <Text>{UseCapitalizer(employee?.accomplishmentStatus)}</Text>
                    </View>
                  </View>
                </View>
              )
            )}
            {/* SIGNATORIES */}
            <View wrap={false}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  fontSize: 9,
                  paddingTop: 40,
                  paddingLeft: 35,
                  paddingRight: 35,
                }}
              >
                <Text>Prepared by:</Text>
                <Text
                  style={{
                    marginRight: 0,
                  }}
                >
                  Noted by:
                </Text>

                <Text
                  style={{
                    marginRight: 155,
                  }}
                >
                  Approved by:
                </Text>
              </View>

              {/* SIGNATURES */}
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
                    style={{ width: 80, marginBottom: -10 }}
                    src={
                      process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                      overtimeAuthorizationAccomplishmentReport?.signatories?.preparedBy?.signature
                        ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                          overtimeAuthorizationAccomplishmentReport?.signatories?.preparedBy?.signature
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
                    {overtimeAuthorizationAccomplishmentReport?.signatories?.preparedBy?.name}
                  </Text>
                  <Text>_______________________________</Text>
                  <Text
                    style={{
                      marginTop: 2,
                      textAlign: 'center',
                    }}
                  >
                    {overtimeAuthorizationAccomplishmentReport?.signatories?.preparedBy?.position}
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
                    style={{ width: 80, marginBottom: -10 }}
                    src={
                      process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                      overtimeAuthorizationAccomplishmentReport?.signatories?.notedBy?.signature
                        ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                          overtimeAuthorizationAccomplishmentReport?.signatories?.notedBy?.signature
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
                    {overtimeAuthorizationAccomplishmentReport?.signatories?.notedBy?.name}
                  </Text>
                  <Text>_______________________________</Text>
                  <Text
                    style={{
                      marginTop: 2,
                      textAlign: 'center',
                    }}
                  >
                    {overtimeAuthorizationAccomplishmentReport?.signatories?.notedBy?.position}
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
                    style={{ width: 80, marginBottom: -10 }}
                    src={
                      process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                      overtimeAuthorizationAccomplishmentReport?.signatories?.approvedBy?.signature
                        ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL +
                          overtimeAuthorizationAccomplishmentReport?.signatories?.approvedBy?.signature
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
                    {overtimeAuthorizationAccomplishmentReport?.signatories?.approvedBy?.name}
                  </Text>
                  <Text>_______________________________</Text>
                  <Text
                    style={{
                      marginTop: 2,
                      textAlign: 'center',
                    }}
                  >
                    {overtimeAuthorizationAccomplishmentReport?.signatories?.approvedBy?.position}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
};

export default OvertimeAuthorizationAccomplishmentPdf;
