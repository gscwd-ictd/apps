/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, PDFViewer, View, Image } from '@react-pdf/renderer';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PassSlipPdf } from '../../../../../../libs/utils/src/lib/types/pass-slip.type';
import React, { useEffect, useState } from 'react';
import { EmployeeDetails } from '../../../types/employee.type';
import dayjs from 'dayjs';

const styles = StyleSheet.create({
  page: {
    border: '1px solid #000',
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  headerMain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    paddingLeft: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 8,
  },
  hrd: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 5,
    fontSize: 8,
  },
  flexRowJustifyBetween: {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    fontSize: 9,
    padding: 10,
    marginTop: 10,
  },
  flexColumnJustifyBetween: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: 'auto',
  },
  checkbox: {
    width: 15,
    height: 10,
    border: '1px solid #000',
    textAlign: 'center',
  },
  checkboxFlex: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 9,
    padding: 10,
    gap: 1,
  },
  checkboxLabelFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 2,
  },
  passSlipLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 5,
  },
});

type PassSlipPdfProps = {
  employeeDetails: EmployeeDetails;
  passSlipDetails: PassSlipPdf;
};

export const PassSlipPdfView = ({ employeeDetails, passSlipDetails }: PassSlipPdfProps): JSX.Element => {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <PDFViewer width={'100%'} height={1000} showToolbar>
          <Document title="Pass Slip">
            <Page size={[612.0, 396.0]}>
              <View style={styles.page}>
                <View style={styles.hrd}>
                  <Text>HRD-010-2</Text>
                </View>
                <View style={styles.headerMain}>
                  <Image style={{ width: 50 }} src={'/gwdlogo.png'} />
                  <View style={styles.header}>
                    <Text>Republic of the Philippines</Text>
                    <Text>GENERAL SANTOS WATER DISTRICT</Text>
                    <Text>E. Ferdnandez St., Lagao General Santos City</Text>
                    <Text>Telephone No.: 552-3824; Telefax No.: 553-4960</Text>
                    <Text>Email Address: gscwaterdistrict@yahoo.com</Text>
                  </View>
                </View>
                <Text style={styles.passSlipLabel}>PASS SLIP AUTHORIZATION</Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    fontSize: 9,
                    padding: 10,
                  }}
                >
                  <Text>DATE: _____________</Text>
                  <Text
                    style={{
                      position: 'absolute',
                      marginLeft: 40,
                      marginTop: 10,
                    }}
                  >
                    {dayjs(passSlipDetails.dateOfApplication).format('MM-DD-YYYY')}
                  </Text>
                  <Text>DEPARTMENT: _________________</Text>
                  <Text
                    style={{
                      position: 'absolute',
                      marginLeft: 192,
                      marginTop: 10,
                    }}
                  >
                    {passSlipDetails.assignment}
                  </Text>
                </View>
                <Text style={{ fontSize: 9, paddingLeft: 10 }}>NATURE OF BUSINESS:</Text>
                <Text style={{ fontSize: 9, paddingLeft: 10, marginTop: -10 }}>
                  _____________________________________________________
                </Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* PERSONAL BUSINESS COLUMN */}
                  <View style={styles.checkboxFlex}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        gap: 2,
                      }}
                    >
                      <Text style={styles.checkbox}>
                        {passSlipDetails.natureOfBusiness === 'Personal Business' ? 'X' : null}
                      </Text>
                      <Text>Personal Business</Text>
                    </View>
                    <View style={styles.checkboxLabelFlex}>
                      <Text style={styles.checkbox}>
                        {passSlipDetails.natureOfBusiness === 'Half Day' ? 'X' : null}
                      </Text>
                      <Text>Half Day</Text>
                    </View>
                    <View style={styles.checkboxLabelFlex}>
                      <Text style={styles.checkbox}>
                        {passSlipDetails.natureOfBusiness === 'Undertime' ? 'X' : null}
                      </Text>
                      <Text>Undertime</Text>
                    </View>
                  </View>
                  {/* OFFICIAL BUSINESS COLUMN */}
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'column',

                      fontSize: 9,
                      padding: 10,
                      gap: 1,
                    }}
                  >
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        gap: 2,
                        marginBottom: 10,
                      }}
                    >
                      <Text style={styles.checkbox}>
                        {passSlipDetails.natureOfBusiness === 'Official Business' ? 'X' : null}
                      </Text>
                      <Text>Official Business</Text>
                    </View>
                    <Text
                      style={{
                        marginLeft: 10,
                      }}
                    >
                      Mode of Transportation:
                    </Text>
                    <View style={styles.checkboxFlex}>
                      <View style={styles.checkboxLabelFlex}>
                        <Text style={styles.checkbox}>
                          {passSlipDetails.obTransportation === 'Office Vehicle' ? 'X' : null}
                        </Text>
                        <Text>Office Vehicle</Text>
                      </View>
                      <View style={styles.checkboxLabelFlex}>
                        <Text style={styles.checkbox}>
                          {passSlipDetails.obTransportation === 'Private/Personal Vehicle' ? 'X' : null}
                        </Text>
                        <Text>Private/Personal Vehicle</Text>
                      </View>
                      <View style={styles.checkboxLabelFlex}>
                        <Text style={styles.checkbox}>
                          {passSlipDetails.obTransportation === 'Public Vehicle' ? 'X' : null}
                        </Text>
                        <Text>Public Vehicle</Text>
                      </View>
                    </View>
                  </View>
                </View>
                {/* ESTIMATED HOURS */}
                <View>
                  <Text
                    style={{
                      position: 'absolute',
                      marginLeft: '175',
                      fontSize: 10,
                    }}
                  >
                    {passSlipDetails.estimateHours}
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 10,
                    }}
                  >
                    Estimated Hours: _____
                  </Text>
                </View>
                <View style={styles.flexRowJustifyBetween}>
                  <Text>PURPOSE/DESTINATION:</Text>
                  <View style={styles.flexColumnJustifyBetween}>
                    <Text>_______________________________</Text>
                    <Text style={{ marginTop: -2 }}>_______________________________</Text>
                    <Text style={{ marginTop: -2 }}>_______________________________</Text>
                    <Text style={{ marginTop: -2 }}>_______________________________</Text>

                    <Text style={{ position: 'absolute' }}>
                      {/* I will buy a brand new state of the art 2024 model Nissan
                      Almera and will pimp it to have jet boosters. I will also
                      install Trans Am system and install Quantum Burst System
                      and Shield Bits and Ultra Magnetic Tops. */}
                      {passSlipDetails.purposeDestination}
                    </Text>
                  </View>
                </View>
                <View style={styles.flexRowJustifyBetween}>
                  <View style={styles.flexColumnJustifyBetween}>
                    <Text>Requested by:</Text>
                    <Text
                      style={{
                        position: 'absolute',
                        marginTop: 21,
                        fontSize: 9,
                      }}
                    >
                      {passSlipDetails.employee.name}
                    </Text>

                    <Image
                      style={{
                        position: 'absolute',
                        marginTop: 0,
                        marginLeft: 90,
                        width: 50,
                      }}
                      src={passSlipDetails.employee.signature}
                    ></Image>
                    <Text style={{ marginTop: 10 }}>_____________________________</Text>
                    <Text>Signature Over Printed Name</Text>
                    <Text style={{ marginTop: 8 }}>Approved by:</Text>
                    <Text
                      style={{
                        position: 'absolute',
                        marginTop: 72,
                        fontSize: 9,
                      }}
                    >
                      {passSlipDetails.supervisor.name}
                    </Text>

                    <Image
                      style={{
                        position: 'absolute',
                        marginTop: 45,
                        marginLeft: 90,
                        width: 60,
                      }}
                      src={`${passSlipDetails.supervisor.signature}`}
                    ></Image>

                    <Text style={{ marginTop: 7 }}>_____________________________</Text>
                    <Text>Department Manager / Supervisor</Text>
                  </View>
                  <View style={styles.flexColumnJustifyBetween}>{/* <Text>X</Text> */}</View>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      )}
    </>
  );
};

export default PassSlipPdfView;
