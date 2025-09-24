import React, { useState } from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { VoluntaryWork } from 'apps/job-portal/utils/types/data/vol-work.type';

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
  w29_8: { width: '29.8%' },
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

type VoluntaryWorkPdfProps = {
  formatDate: any;
  voluntaryWork: Array<VoluntaryWork>;
};

export const VoluntaryWorkPdf = ({ formatDate, voluntaryWork }: VoluntaryWorkPdfProps): JSX.Element => {
  const [emptyVoluntaryWorkRows] = useState(5);

  const renderVoluntaryWorkRows = () => {
    const content = voluntaryWork.slice(0, 5).map((work, index) => (
      <View style={[styles.borderTop, { flexDirection: 'row', alignItems: 'stretch' }]} key={index}>
        {/* Name & Address of Org */}
        <View
          style={[
            styles.inputValue,
            styles.borderRight,
            styles.horizontalCenter,
            styles.w46_2,
            { flexDirection: 'row' },
          ]}
        >
          <Text>{work.organizationName || 'N/A'}</Text>
        </View>

        {/* Inclusive Dates */}
        <View
          style={[
            styles.horizontalCenter,
            styles.borderRight,
            styles.inputValue,
            styles.w18,
            { padding: '0', flexDirection: 'row' },
          ]}
        >
          <View style={[styles.w50, styles.horizontalCenter, styles.borderRight]}>
            <Text style={[styles.verticalCenter, { padding: '3 0' }]}>{formatDate(work.from) || 'N/A'}</Text>
          </View>
          <View style={[styles.w50, styles.horizontalCenter]}>
            <View style={[styles.verticalCenter, { padding: '3 0' }]}>
              <Text>{formatDate(work.to) || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Hours */}
        <View style={[styles.borderRight, styles.inputValue, styles.horizontalCenter, styles.w6]}>
          <View style={[styles.verticalCenter]}>
            <Text>{work.numberOfHours || 'N/A'}</Text>
          </View>
        </View>

        {/* Position */}
        <View style={[styles.inputValue, styles.horizontalCenter, styles.w29_8, { padding: 0 }]}>
          <View style={[styles.verticalCenter]}>
            <Text>{work.position || 'N/A'}</Text>
          </View>
        </View>
      </View>
    ));

    return content;
  };

  const renderEmptyVoluntaryWorkRows = () => {
    const content = [];
    const rowToRender = emptyVoluntaryWorkRows - voluntaryWork.length;

    for (let i = 0; i < rowToRender; i++) {
      content.push(
        <View style={[styles.borderTop, { flexDirection: 'row', alignItems: 'stretch' }]} key={i}>
          {/* Name & Address of Org */}
          <View
            style={[
              styles.inputValue,
              styles.borderRight,
              styles.horizontalCenter,
              styles.w46_2,
              { flexDirection: 'row' },
            ]}
          >
            <Text>N/A</Text>
          </View>

          {/* Inclusive Dates */}
          <View
            style={[
              styles.horizontalCenter,
              styles.borderRight,
              styles.inputValue,
              styles.w18,
              { padding: '0', flexDirection: 'row' },
            ]}
          >
            <View style={[styles.w50, styles.horizontalCenter, styles.borderRight]}>
              <Text style={[styles.verticalCenter, { padding: '3 0' }]}>N/A</Text>
            </View>
            <View style={[styles.w50, styles.horizontalCenter]}>
              <View style={[styles.verticalCenter, { padding: '3 0' }]}>
                <Text>N/A</Text>
              </View>
            </View>
          </View>

          {/* Hours */}
          <View style={[styles.borderRight, styles.inputValue, styles.horizontalCenter, styles.w6]}>
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Position */}
          <View style={[styles.inputValue, styles.horizontalCenter, styles.w29_8, { padding: 0 }]}>
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
      <View style={[styles.sectionTitleContainer]}>
        <Text style={styles.sectionTitleText}>
          VI. VOLUNTARY WORK OR INVOLVEMENT IN CIVIC / NON-GOVERNMENT / PEOPLE / VOLUNTARY ORGANIZATION/S
        </Text>
      </View>

      {/* Voluntary Work header */}
      <View style={[styles.borderTop, { flexDirection: 'row', alignItems: 'stretch' }]}>
        {/* Name & Address of Org */}
        <View
          style={[styles.inputKey, styles.borderRight, styles.horizontalCenter, styles.w46_2, { flexDirection: 'row' }]}
        >
          <Text style={[styles.verticalCenter]}>29.</Text>
          <View style={[styles.verticalCenter, styles.horizontalCenter, { padding: '3 10', width: '100%' }]}>
            <Text>NAME & ADDRESS OF ORGANIZATION</Text>
            <Text>(Write in full)</Text>
          </View>
        </View>

        {/* Inclusive Dates */}
        <View style={[styles.horizontalCenter, styles.borderRight, styles.inputKey, styles.w18, { padding: '0' }]}>
          <View style={[styles.w100, { textAlign: 'center', padding: '4' }]}>
            <Text>INCLUSIVE DATES</Text>
            <Text>(dd/mm/yyyy)</Text>
          </View>

          <View style={[styles.borderTop, { flexDirection: 'row' }]}>
            <View style={[styles.w50, styles.horizontalCenter, styles.borderRight]}>
              <Text style={[styles.verticalCenter, { padding: '3 0' }]}>From</Text>
            </View>
            <View style={[styles.w50, styles.horizontalCenter]}>
              <View style={[styles.verticalCenter, { padding: '3 0' }]}>
                <Text>To</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Hours */}
        <View style={[styles.borderRight, styles.inputKey, styles.horizontalCenter, styles.w6]}>
          <View style={[styles.verticalCenter]}>
            <Text style={{ fontSize: 5.7 }}>NUMBER OF HOURS</Text>
          </View>
        </View>

        {/* Position */}
        <View style={[styles.inputKey, styles.horizontalCenter, styles.w29_8, { padding: 0 }]}>
          <View style={[styles.verticalCenter]}>
            <Text>POSITION / NATURE OF WORK</Text>
          </View>
        </View>
      </View>

      {renderVoluntaryWorkRows()}

      {voluntaryWork.length < 6 ? <>{renderEmptyVoluntaryWorkRows()}</> : null}

      <View style={[styles.borderTop]}>
        <View style={[styles.inputKey, styles.w100, { padding: '1 0' }]}>
          <Text style={styles.warningText}>(Continue on separate sheet if necessary)</Text>
        </View>
      </View>
    </View>
  );
};

export default VoluntaryWorkPdf;
