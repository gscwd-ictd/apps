import { Page, Text, Document, StyleSheet, PDFViewer, View, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  headerMain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    paddingBottom: 5,
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
