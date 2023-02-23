import React from "react";
import { Text, View, StyleSheet, Font } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  // Border Styles
  borderTop: {
    borderTop: "1px solid #000000",
  },
  // Field Styles
  footerText: {
    fontFamily: "ArialNarrowItalic",
    fontSize: 5.7,
    flexDirection: "row",
    padding: 1,
    justifyContent: "flex-end",
  },
});

Font.register({
  family: "ArialNarrowItalic",
  src: "/assets/fonts/arial-narrow-italic.ttf",
});

export const FooterPdf = (): JSX.Element => {
  return (
    <View style={[styles.footerText, styles.borderTop]}>
      <Text>CS FORM 212 (Revised 2017), Page </Text>
      <Text
        render={({ pageNumber, totalPages }) => `${pageNumber} of 4`}
        fixed
      />
    </View>
  );
};
export default FooterPdf;
