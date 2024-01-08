/* eslint-disable @nx/enforce-module-boundaries */
import { Text, StyleSheet, View, Image } from '@react-pdf/renderer';
import GscwdLogo from 'apps/employee-monitoring/public/gscwd-logo.png';
import IsoAccreditorLogo from 'apps/employee-monitoring/public/socotec-logo.jpg';
import { isEmpty } from 'lodash';
import React, { FunctionComponent } from 'react';

type HeaderProps = {
  isoCode?: string;
  withIsoLogo?: boolean;
  isFixed?: boolean;
};

const styles = StyleSheet.create({
  gscwdLogo: {
    width: 60,
    height: 60,
    margin: 'auto',
  },
  isoLogo: {
    width: 71,
    height: 46,
    margin: 'auto',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  borderTop: {
    borderTop: '1px solid #000000',
  },

  horizontalCenter: { textAlign: 'center' },

  // Width Styles
  w40: { width: '40%' },
  w30: { width: '30%' },
});

export const PdfHeader: FunctionComponent<HeaderProps> = ({ isoCode, withIsoLogo = false, isFixed = false }) => {
  return (
    <>
      {/* HEADER */}
      <View style={[styles.rowContainer, { paddingBottom: 10 }]} fixed={isFixed}>
        {/* LEFT */}
        <View style={[styles.w30, { padding: '0 0 0 15' }]}>
          <Image src={GscwdLogo.src} style={[styles.gscwdLogo]} />
        </View>

        {/* CENTER */}
        <View style={[styles.w40, styles.horizontalCenter]}>
          <Text style={{ fontSize: 8, paddingTop: 3 }}>Republic of the Philippines</Text>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold' }}>GENERAL SANTOS CITY WATER DISTRICT</Text>
          <Text style={{ fontSize: 8, paddingTop: 3 }}>E. Fernandez St., Brgy. Lagao, General Santos City</Text>
          <Text style={{ fontSize: 8, paddingTop: 3 }}>Telephone No.: 552-3824; Telefax No.: 553-4960</Text>
          <Text style={{ fontSize: 8, paddingTop: 3 }}>Email Address: gscwaterdistrict@yahoo.com</Text>
          <Text style={{ fontSize: 8, paddingTop: 3 }}>www.gensanwater.gov.ph</Text>
        </View>

        {/* RIGHT */}
        <View style={[styles.w30, { padding: '0 15 0 0' }]}>
          {/* ISO CODE */}
          {!isEmpty(isoCode) ? (
            <View style={[{ position: 'absolute', right: 0 }]}>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica' }}>{isoCode}</Text>
            </View>
          ) : null}

          {/* ISO LOGO */}
          {withIsoLogo ? <Image src={IsoAccreditorLogo.src} style={[styles.isoLogo]} /> : null}
        </View>
      </View>
    </>
  );
};
