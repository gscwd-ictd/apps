import React from "react";
import { Text, View, StyleSheet, Font } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  signatureDateText: {
    backgroundColor: "#EAEAEA",
    fontFamily: "ArialNarrowBoldItalic",
    fontSize: 9.2,
    textAlign: "center",
    padding: "5 0",
  },

  // Border Styles
  borderTop: {
    borderTop: "1px solid #000000",
  },
  borderRight: {
    borderRight: "1px solid #000000",
  },

  // Width Styles
  w100: { width: "100%" },
  w47: { width: "47%" },
  w23_8: { width: "23.8%" },
  w17_2: { width: "17.2%" },
  w12: { width: "12%" },
});

Font.register({
  family: "ArialNarrowBoldItalic",
  src: "/assets/fonts/arial-narrow-bold-italic.ttf",
});

export const SignatureDate = (): JSX.Element => {
  return (
    <View
      style={[
        styles.borderTop,
        { flexDirection: "row", alignItems: "stretch" },
      ]}
    >
      <View
        style={[styles.w17_2, styles.signatureDateText, styles.borderRight]}
      >
        <Text>SIGNATURE</Text>
      </View>

      <View style={[styles.w47, styles.borderRight]}></View>

      <View style={[styles.w12, styles.signatureDateText, styles.borderRight]}>
        <Text>DATE</Text>
      </View>

      <View style={[styles.w23_8]}></View>
    </View>
  );
};

export default SignatureDate;
