import React, { useState } from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { LearningDevelopment } from '../../types/data/lnd.type';
import { chunkSubstr } from './PdsDocument';

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
    padding: '4 8',
    textTransform: 'uppercase',
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
  w50: { width: '50%' },
  w46_2: { width: '46.2%' },
  w23_8: { width: '23.8%' },
  w18: { width: '18%' },
  w6: { width: '6%' },
});

Font.register({
  family: 'ArialNarrow',
  src: '/assets/fonts/arial-narrow.ttf',
});

Font.register({
  family: 'ArialNarrowBoldItalic',
  src: '/assets/fonts/arial-narrow-bold-italic.ttf',
});

type LearningAndDevelopmentPdfProps = {
  formatDate: any;
  learningDevelopment: Array<LearningDevelopment>;
};

export const LearningAndDevelopmentPdf = ({
  formatDate,
  learningDevelopment,
}: LearningAndDevelopmentPdfProps): JSX.Element => {
  const [emptyLearningDevRows] = useState(18);

  const renderLearningDevelopmentRows = () => {
    const content = learningDevelopment.slice(0, 18).map((training, index) => (
      <View
        style={[
          styles.borderTop,
          { flexDirection: 'row', alignItems: 'stretch' },
        ]}
        key={index}
      >
        {/* Title of Learning and Development */}
        <View
          style={[
            styles.inputValue,
            styles.borderRight,
            styles.horizontalCenter,
            styles.w46_2,
          ]}
        >
          <Text style={[styles.verticalCenter]}>{training.title || 'N/A'}</Text>
        </View>

        {/* Inclusive Dates of Attendance */}
        <View
          style={[
            styles.horizontalCenter,
            styles.borderRight,
            styles.inputValue,
            styles.w18,
            { padding: '0', flexDirection: 'row' },
          ]}
        >
          <View
            style={[styles.w50, styles.horizontalCenter, styles.borderRight]}
          >
            <Text style={[styles.verticalCenter, { padding: '3 0' }]}>
              {formatDate(training.from) || 'N/A'}
            </Text>
          </View>
          <View style={[styles.w50, styles.horizontalCenter]}>
            <View style={[styles.verticalCenter, { padding: '3 0' }]}>
              <Text>{formatDate(training.to) || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Hours */}
        <View
          style={[
            styles.borderRight,
            styles.inputValue,
            styles.horizontalCenter,
            styles.w6,
            { padding: '5.5 3' },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>{training.numberOfHours || 'N/A'}</Text>
          </View>
        </View>

        {/* Type of L&D */}
        <View
          style={[
            styles.borderRight,
            styles.inputValue,
            styles.horizontalCenter,
            styles.w6,
            { fontSize: 5, padding: '5.5 3' },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text hyphenationCallback={(e) => chunkSubstr(e)}>
              {training.type || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Sponsored By */}
        <View
          style={[
            styles.inputValue,
            styles.horizontalCenter,
            styles.w23_8,
            { padding: 0 },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text hyphenationCallback={(e) => chunkSubstr(e)}>
              {training.conductedBy || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    ));

    return content;
  };

  const renderEmptyLearningDevelopmentRows = () => {
    const content = [];
    const rowToRender = emptyLearningDevRows - learningDevelopment.length;

    for (let i = 0; i < rowToRender; i++) {
      content.push(
        <View
          style={[
            styles.borderTop,
            { flexDirection: 'row', alignItems: 'stretch' },
          ]}
          key={i}
        >
          {/* Title of Learning and Development */}
          <View
            style={[
              styles.inputValue,
              styles.borderRight,
              styles.horizontalCenter,
              styles.w46_2,
            ]}
          >
            <Text style={[styles.verticalCenter]}>N/A</Text>
          </View>

          {/* Inclusive Dates of Attendance */}
          <View
            style={[
              styles.horizontalCenter,
              styles.borderRight,
              styles.inputValue,
              styles.w18,
              { padding: '0', flexDirection: 'row' },
            ]}
          >
            <View
              style={[styles.w50, styles.horizontalCenter, styles.borderRight]}
            >
              <Text style={[styles.verticalCenter, { padding: '3 0' }]}>
                N/A
              </Text>
            </View>
            <View style={[styles.w50, styles.horizontalCenter]}>
              <View style={[styles.verticalCenter, { padding: '3 0' }]}>
                <Text>N/A</Text>
              </View>
            </View>
          </View>

          {/* Hours */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.horizontalCenter,
              styles.w6,
              { padding: '5.5 3' },
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Type of L&D */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.horizontalCenter,
              styles.w6,
              { padding: '5.5 3' },
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Sponsored By */}
          <View
            style={[
              styles.inputValue,
              styles.horizontalCenter,
              styles.w23_8,
              { padding: 0 },
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>
        </View>
      );
    }

    return content;
  };

  return (
    <View>
      <View style={[styles.sectionTitleContainer, styles.borderTop]}>
        <Text style={styles.sectionTitleText}>
          VII. LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS/TRAINING PROGRAMS
          ATTENDED
        </Text>
        <Text style={styles.sectionSubtitleText}>
          (Start from the most recent L&D/training program and include only the
          relevant L&D/training taken for the last five (5) years for Division
          Chief/Executive/Managerial positions)
        </Text>
      </View>

      {/* Learning and Development header */}
      <View
        style={[
          styles.borderTop,
          { flexDirection: 'row', alignItems: 'stretch' },
        ]}
      >
        {/* Title of Learning and Development */}
        <View
          style={[
            styles.inputKey,
            styles.borderRight,
            styles.horizontalCenter,
            styles.w46_2,
            { flexDirection: 'row' },
          ]}
        >
          <Text style={[styles.verticalCenter]}>30.</Text>
          <View
            style={[
              styles.verticalCenter,
              styles.horizontalCenter,
              { padding: '3 10', width: '100%' },
            ]}
          >
            <Text>
              TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS/TRAINING PROGRAMS
            </Text>
            <Text>(Write in full)</Text>
          </View>
        </View>

        {/* Inclusive Dates of Attendance */}
        <View
          style={[
            styles.horizontalCenter,
            styles.borderRight,
            styles.inputKey,
            styles.w18,
            { padding: '0' },
          ]}
        >
          <View style={[styles.w100, { textAlign: 'center', padding: '4 6' }]}>
            <Text>INCLUSIVE DATES OF</Text>
            <Text>ATTENDANCE</Text>
            <Text>(mm/dd/yyyy)</Text>
          </View>

          <View style={[styles.borderTop, { flexDirection: 'row' }]}>
            <View
              style={[styles.w50, styles.horizontalCenter, styles.borderRight]}
            >
              <Text style={[styles.verticalCenter, { padding: '3 0' }]}>
                From
              </Text>
            </View>
            <View style={[styles.w50, styles.horizontalCenter]}>
              <View style={[styles.verticalCenter, { padding: '3 0' }]}>
                <Text>To</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Hours */}
        <View
          style={[
            styles.borderRight,
            styles.inputKey,
            styles.horizontalCenter,
            styles.w6,
            { padding: '5.5 3' },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text style={{ fontSize: 5.7 }}>NUMBER OF HOURS</Text>
          </View>
        </View>

        {/* Type of L&D */}
        <View
          style={[
            styles.borderRight,
            styles.inputKey,
            styles.horizontalCenter,
            styles.w6,
            { padding: '5.5 3' },
          ]}
        >
          <View style={[styles.verticalCenter, { fontSize: 5.7 }]}>
            <Text>Type of LD</Text>
            <Text> (Managerial/ Supervisory/ Technical/etc)</Text>
          </View>
        </View>

        {/* Sponsored By */}
        <View
          style={[
            styles.inputKey,
            styles.horizontalCenter,
            styles.w23_8,
            { padding: 0 },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>CONDUCTED/ SPONSORED BY</Text>
            <Text>(Write in full)</Text>
          </View>
        </View>
      </View>

      {renderLearningDevelopmentRows()}

      {learningDevelopment.length < 19 ? (
        <>{renderEmptyLearningDevelopmentRows()}</>
      ) : null}

      <View style={[styles.borderTop]}>
        <View style={[styles.inputKey, styles.w100, { padding: '1 0' }]}>
          <Text style={styles.warningText}>
            (Continue on separate sheet if necessary)
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LearningAndDevelopmentPdf;
