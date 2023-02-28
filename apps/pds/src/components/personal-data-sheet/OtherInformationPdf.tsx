import React, { useState } from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import {
  Skill,
  Recognition,
  Organization,
} from '../../types/data/other-info.type';
import { constant } from 'lodash';

const styles = StyleSheet.create({
  lineContainer: {
    flexDirection: 'row',
  },
  sectionTitleContainer: {
    backgroundColor: '#969696',
    padding: 1.5,
  },
  sectionTitleText: {
    color: '#ffffff',
    fontFamily: 'ArialNarrowBoldItalic',
    fontSize: 9.2,
  },
  sectionSubtitleText: {
    color: '#ffffff',
    fontFamily: 'ArialNarrowBoldItalic',
    fontSize: 6.5,
    paddingTop: 2,
  },

  // Field Styles
  inputKey: {
    backgroundColor: '#EAEAEA',
    fontFamily: 'ArialNarrow',
    fontSize: 6.7,
    padding: '3.5 5',
  },
  inputValue: {
    fontFamily: 'ArialNarrow',
    fontSize: 6.7,
    padding: '2 8',
    textTransform: 'uppercase',
    height: 25,
    // '@media max-width: 30': {
    //   height: 30,
    // },
  },
  warningText: {
    fontFamily: 'ArialNarrowBoldItalic',
    textAlign: 'center',
    fontSize: 6.7,
    color: 'red',
  },
  verticalCenter: { margin: 'auto 0' },
  horizontalCenter: { textAlign: 'center' },

  // Border Styles
  borderTop: {
    borderTop: '1px solid #000000',
  },
  borderRight: {
    borderRight: '1px solid #000000',
  },

  // Width Styles
  w100: { width: '100%' },
  w59: { width: '59%' },
  w23_8: { width: '23.8%' },
  w17_2: { width: '17.2%' },
});

Font.register({
  family: 'ArialNarrow',
  src: '/assets/fonts/arial-narrow.ttf',
});

Font.register({
  family: 'ArialNarrowBoldItalic',
  src: '/assets/fonts/arial-narrow-bold-italic.ttf',
});

type OtherInformationPdfProps = {
  skills: Array<Skill>;
  recognitions: Array<Recognition>;
  organizations: Array<Organization>;
};

export const OtherInformationPdf = ({
  skills,
  recognitions,
  organizations,
}: OtherInformationPdfProps): JSX.Element => {
  const [emptySkillRows, setEmptySkillRows] = useState(7);
  const [emptyRecognitionRows, setEmptyRecognitionRows] = useState(7);
  const [emptyOrgRows, setEmptyOrgRows] = useState(7);

  const renderSpecialSkillRows = () => {
    const content = skills.slice(0, 7).map((skill, index) => (
      <View
        style={[styles.inputValue, styles.borderRight, styles.borderTop]}
        key={index}
      >
        <Text style={[styles.verticalCenter]} wrap={false}>
          {skill.skill}
        </Text>
      </View>
    ));

    return content;
  };

  const renderEmptySpecialSkillRows = () => {
    const content = [];
    const rowToRender = emptySkillRows - skills.length;

    for (let i = 0; i < rowToRender; i++) {
      content.push(
        <View
          style={[styles.inputValue, styles.borderRight, styles.borderTop]}
          key={i}
        >
          <Text style={[styles.verticalCenter]}>N/A</Text>
        </View>
      );
    }

    return content;
  };

  const renderRecognitionRows = () => {
    const content = recognitions.slice(0, 7).map((recognition, index) => (
      <View
        style={[styles.inputValue, styles.borderRight, styles.borderTop]}
        key={index}
      >
        <Text style={[styles.verticalCenter]} wrap={false}>
          {recognition.recognition}
        </Text>
      </View>
    ));

    return content;
  };

  const renderEmptyRecognitionRows = () => {
    const content = [];
    const rowToRender = emptyRecognitionRows - recognitions.length;

    for (let i = 0; i < rowToRender; i++) {
      content.push(
        <View
          style={[styles.inputValue, styles.borderRight, styles.borderTop]}
          key={i}
        >
          <Text style={[styles.verticalCenter]}>N/A</Text>
        </View>
      );
    }

    return content;
  };

  const renderMembershipRows = () => {
    const content = organizations.slice(0, 7).map((org, index) => (
      <View style={[styles.inputValue, styles.borderTop]} key={index}>
        <Text style={[styles.verticalCenter]} wrap={false}>
          {org.organization}
        </Text>
      </View>
    ));

    return content;
  };

  const renderEmptyMembershipRows = () => {
    const content = [];
    const rowToRender = emptyOrgRows - organizations.length;

    for (let i = 0; i < rowToRender; i++) {
      content.push(
        <View style={[styles.inputValue, styles.borderTop]} key={i}>
          <Text style={[styles.verticalCenter]}>N/A</Text>
        </View>
      );
    }

    return content;
  };

  return (
    <View>
      <View style={[styles.sectionTitleContainer, styles.borderTop]}>
        <Text style={styles.sectionTitleText}>VIII. OTHER INFORMATION</Text>
      </View>

      {/* Header */}
      <View
        style={[
          styles.borderTop,
          { flexDirection: 'row', alignItems: 'stretch' },
        ]}
      >
        {/* Special SKills */}
        <View
          style={[
            styles.inputKey,
            styles.borderRight,
            styles.w17_2,
            { flexDirection: 'row' },
          ]}
        >
          <Text style={[styles.verticalCenter]}>31.</Text>
          <Text style={[styles.verticalCenter, { paddingLeft: 2 }]}>
            SPECIAL SKILLS and HOBBIES
          </Text>
        </View>

        {/* Non-Academic Distinctions */}
        <View
          style={[
            styles.inputKey,
            styles.borderRight,
            styles.w59,
            { flexDirection: 'row' },
          ]}
        >
          <Text style={[styles.verticalCenter]}>32.</Text>

          <View
            style={[
              styles.w100,
              styles.verticalCenter,
              styles.horizontalCenter,
            ]}
          >
            <Text>NON-ACADEMIC DISTINCTIONS / RECOGNITION</Text>
            <Text>(Write in full)</Text>
          </View>
        </View>

        {/* Membership */}
        <View style={[styles.inputKey, styles.w23_8, { flexDirection: 'row' }]}>
          <Text style={[styles.verticalCenter]}>33.</Text>

          <View
            style={[
              styles.w100,
              styles.verticalCenter,
              styles.horizontalCenter,
            ]}
          >
            <Text>MEMBERSHIP IN ASSOCIATION / ORGANIZATION</Text>
            <Text>(Write in full)</Text>
          </View>
        </View>
      </View>

      {/* Rows */}
      <View style={[{ flexDirection: 'row' }]}>
        {/* Special SKills */}
        <View style={[styles.w17_2]}>
          {renderSpecialSkillRows()}
          {renderEmptySpecialSkillRows()}
        </View>

        {/* Non-Academic Distinctions */}
        <View style={[styles.w59]}>
          {renderRecognitionRows()}
          {renderEmptyRecognitionRows()}
        </View>

        {/* Membership */}
        <View style={[styles.w23_8]}>
          {renderMembershipRows()}
          {renderEmptyMembershipRows()}
        </View>
      </View>
    </View>
  );
};

export default OtherInformationPdf;
