import { Page, Text, Document, StyleSheet, PDFViewer, View, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    // border: '1px solid #000',
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
    paddingLeft: 160,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 8,
  },
});

export const PdfHeader = () => {
  return (
    <View style={styles.headerMain}>
      <Image style={{ width: 50 }} src={'/gwdlogo.png'} />
      <View style={styles.header}>
        <Text>Republic of the Philippines</Text>
        <Text>GENERAL SANTOS WATER DISTRICT</Text>
        <Text>E. Ferdnandez St., Lagao General Santos City</Text>
        <Text>Telephone No.: 552-3824; Telefax No.: 553-4960</Text>
        <Text>Email Address: gscwaterdistrict@yahoo.com</Text>
      </View>
      <Image style={{ width: 50 }} src={'/socotec-pab.jpg'} />
    </View>
  );
};
