/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Logo
import GSCWDLogo from '../../../../../public/gwdlogo.png';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  logo: {
    width: 70,
    height: 70,
    margin: 'auto',
  },

  // Border Styles
  bodyBorder: {
    margin: 10,
    border: '2px solid #000000',
  },
  borderTop: {
    borderTop: '1px solid #000000',
  },
  borderRight: {
    borderRight: '1px solid #000000',
  },

  // Field Styles
  headerText: {
    // fontFamily: 'ArialRegular',
    fontFamily: 'Helvetica',
    fontSize: 9,
    padding: 1,
    marginVertical: 'auto',
  },
  documentCode: {
    // fontFamily: 'CalibriRegular',
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: '10 15 0 0',
    textAlign: 'right',
  },
  arialSemiBold: {
    // fontFamily: 'ArialSemiBold',
  },
  verticalCenter: { margin: 'auto 0' },
  horizontalCenter: { textAlign: 'center' },

  // Width Styles
  w100: { width: '100%' },
  w40: { width: '40%' },
  w30: { width: '30%' },
});

Font.register({
  family: 'ArialRegular',
  src: '/assets/fonts/arial-regular.ttf',
});

Font.register({
  family: 'ArialSemiBold',
  src: '/assets/fonts/arial-semibold.ttf',
});

Font.register({
  family: 'CalibriRegular',
  src: '/assets/fonts/calibri-regular.ttf',
});

const Header = () => {
  return (
    <View style={[styles.rowContainer, { paddingBottom: 10 }]} fixed>
      {/* Logo */}
      <View style={[styles.w30, { padding: '10 0 0 15' }]}>
        <Image src={GSCWDLogo.src} style={[styles.logo]} />
      </View>

      {/* Center Text */}
      <View style={[styles.w40, styles.headerText, styles.horizontalCenter]}>
        <Text>Republic of the Philippines</Text>
        <Text style={[styles.arialSemiBold]}>GENERAL SANTOS CITY WATER DISTRICT</Text>
        <Text>E. Fernandez St., Brgy. Lagao, General Santos City</Text>
        <Text>Telephone No.: 552-3824; Telefax No.: 553-4960</Text>
        <Text>Email Address: gscwaterdistrict@yahoo.com</Text>
      </View>

      {/* ISO Document Code */}
      <View style={[styles.w30, styles.documentCode]}>
        <Text>HRD-014-4</Text>
      </View>
    </View>
  );
};
export default Header;
