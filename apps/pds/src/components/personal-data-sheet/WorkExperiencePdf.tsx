import React, { useState } from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { WorkExperience } from '../../types/data/work.type';

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
    padding: '5.5 8',
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
  w31_9: { width: '31.9%' },
  w27_1: { width: '27.1%' },
  w17_2: { width: '17.2%' },
  w7: { width: '7%' },
  w5_6: { width: '5.6%' },
});

Font.register({
  family: 'ArialNarrow',
  src: '/assets/fonts/arial-narrow.ttf',
});

Font.register({
  family: 'ArialNarrowBoldItalic',
  src: '/assets/fonts/arial-narrow-bold-italic.ttf',
});

Font.registerHyphenationCallback((word) => [word]);

type WorkExperiencePdfProps = {
  formatDate: any;
  workExperience: Array<WorkExperience>;
};

export const WorkExperiencePdf = ({
  formatDate,
  workExperience,
}: WorkExperiencePdfProps): JSX.Element => {
  const [emptyWorkExperienceRows, setEmptyWorkExperienceRows] = useState(28);

  const renderWorkExperienceRows = () => {
    const content = workExperience.slice(0, 28).map((experience, index) => (
      <View
        style={[
          styles.borderTop,
          { flexDirection: 'row', alignItems: 'stretch' },
        ]}
        key={index}
      >
        {/* Inclusive Dates */}
        <View
          style={[
            styles.horizontalCenter,
            styles.borderRight,
            styles.inputValue,
            styles.w17_2,
            { padding: '0', flexDirection: 'row' },
          ]}
        >
          <View
            style={[styles.w50, styles.horizontalCenter, styles.borderRight]}
          >
            <Text style={[styles.verticalCenter, { padding: '3 0' }]}>
              {formatDate(experience.from) || 'N/A'}
            </Text>
          </View>
          <View style={[styles.w50, styles.horizontalCenter]}>
            <View style={[styles.verticalCenter, { padding: '3 0' }]}>
              <Text>{formatDate(experience.to) || 'PRESENT'}</Text>
            </View>
          </View>
        </View>

        {/* Position Title */}
        <View
          style={[
            styles.inputValue,
            styles.borderRight,
            styles.horizontalCenter,
            styles.w31_9,
            { flexDirection: 'row' },
          ]}
        >
          <View
            style={[
              styles.verticalCenter,
              styles.horizontalCenter,
              styles.w100,
            ]}
          >
            <Text>{experience.positionTitle || 'N/A'}</Text>
          </View>
        </View>

        {/* Company Name */}
        <View
          style={[
            styles.borderRight,
            styles.inputValue,
            styles.horizontalCenter,
            styles.w27_1,
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>{experience.companyName || 'N/A'}</Text>
          </View>
        </View>

        {/* Monthly Salary */}
        <View
          style={[
            styles.borderRight,
            styles.inputValue,
            styles.horizontalCenter,
            styles.w5_6,
            { padding: 0 },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>{experience.monthlySalary || 'N/A'}</Text>
          </View>
        </View>

        {/* Salary Grade / Increment */}
        <View
          style={[
            styles.borderRight,
            styles.inputValue,
            styles.horizontalCenter,
            styles.w5_6,
            { padding: 1 },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>{experience.salaryGrade || 'N/A'}</Text>
          </View>
        </View>

        {/* Status of Appointment */}
        <View
          style={[
            styles.borderRight,
            styles.inputValue,
            styles.horizontalCenter,
            styles.w7,
            { padding: 0 },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text style={{ fontSize: 6.2 }}>
              {experience.appointmentStatus || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Gov't Service */}
        <View
          style={[
            styles.inputValue,
            styles.horizontalCenter,
            styles.w5_6,
            { padding: 0 },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>{experience.isGovernmentService ? 'Y' : 'N'}</Text>
          </View>
        </View>
      </View>
    ));

    return content;
  };

  const renderEmptyWorkExperienceRows = () => {
    const content = [];
    const rowToRender = emptyWorkExperienceRows - workExperience.length;

    for (let i = 0; i < rowToRender; i++) {
      content.push(
        <View
          style={[
            styles.borderTop,
            { flexDirection: 'row', alignItems: 'stretch' },
          ]}
          key={i}
        >
          {/* Inclusive Dates */}
          <View
            style={[
              styles.horizontalCenter,
              styles.borderRight,
              styles.inputValue,
              styles.w17_2,
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

          {/* Position Title */}
          <View
            style={[
              styles.inputValue,
              styles.borderRight,
              styles.horizontalCenter,
              styles.w31_9,
              { flexDirection: 'row' },
            ]}
          >
            <View
              style={[
                styles.verticalCenter,
                styles.horizontalCenter,
                styles.w100,
              ]}
            >
              <Text>N/A</Text>
            </View>
          </View>

          {/* Company Name */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.horizontalCenter,
              styles.w27_1,
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Monthly Salary */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.horizontalCenter,
              styles.w5_6,
              { padding: 0 },
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Salary Grade / Increment */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.horizontalCenter,
              styles.w5_6,
              { padding: 1 },
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Status of Appointment */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.horizontalCenter,
              styles.w7,
              { padding: 0 },
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Gov't Service */}
          <View
            style={[
              styles.inputValue,
              styles.horizontalCenter,
              styles.w5_6,
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
        <Text style={styles.sectionTitleText}>V. WORK EXPERIENCE</Text>
        <Text style={styles.sectionSubtitleText}>
          (Include private employment. Start from your recent work) Description
          of duties should be indicated in the attached Work Experience sheet.
        </Text>
      </View>

      {/* Work Experience Header */}
      <View
        style={[
          styles.borderTop,
          { flexDirection: 'row', alignItems: 'stretch' },
        ]}
      >
        {/* Inclusive Dates */}
        <View
          style={[
            styles.horizontalCenter,
            styles.borderRight,
            styles.inputKey,
            styles.w17_2,
            { padding: '0' },
          ]}
        >
          <View
            style={[
              styles.horizontalCenter,
              { padding: '8 5', flexDirection: 'row' },
            ]}
          >
            <Text style={[styles.verticalCenter]}>28.</Text>
            <View style={[styles.w100, { textAlign: 'center' }]}>
              <Text>INCLUSIVE DATES</Text>
              <Text>(mm/dd/yyyy)</Text>
            </View>
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

        {/* Position Title */}
        <View
          style={[
            styles.inputKey,
            styles.borderRight,
            styles.horizontalCenter,
            styles.w31_9,
            { flexDirection: 'row' },
          ]}
        >
          <View
            style={[
              styles.verticalCenter,
              styles.horizontalCenter,
              styles.w100,
            ]}
          >
            <Text>POSITION TITLE</Text>
            <Text>(Write in full/Do not abbreviate)</Text>
          </View>
        </View>

        {/* Company Name */}
        <View
          style={[
            styles.borderRight,
            styles.inputKey,
            styles.horizontalCenter,
            styles.w27_1,
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>DEPARTMENT / AGENCY / OFFICE / COMPANY</Text>
            <Text>(Write in full/Do not abbreviate)</Text>
          </View>
        </View>

        {/* Monthly Salary */}
        <View
          style={[
            styles.borderRight,
            styles.inputKey,
            styles.horizontalCenter,
            styles.w5_6,
            { padding: 0 },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text style={{ fontSize: 5.7 }}>MONTHLY SALARY</Text>
          </View>
        </View>

        {/* Salary Grade / Increment */}
        <View
          style={[
            styles.borderRight,
            styles.inputKey,
            styles.horizontalCenter,
            styles.w5_6,
            { padding: 1 },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text style={{ fontSize: 4.7 }}>
              SALARY/ JOB/ PAY GRADE (if applicable)& STEP (Format
              &quot;00-0&quot;)/ INCREMENT
            </Text>
          </View>
        </View>

        {/* Status of Appointment */}
        <View
          style={[
            styles.borderRight,
            styles.inputKey,
            styles.horizontalCenter,
            styles.w7,
            { padding: 0 },
          ]}
        >
          <View style={[styles.verticalCenter, { fontSize: 5.7 }]}>
            <Text>STATUS OF</Text>
            <Text>APPOINTMENT</Text>
          </View>
        </View>

        {/* Gov't Service */}
        <View
          style={[
            styles.inputKey,
            styles.horizontalCenter,
            styles.w5_6,
            { padding: 0 },
          ]}
        >
          <View style={[styles.verticalCenter, { fontSize: 5.7 }]}>
            <Text>GOV&apos;T</Text>
            <Text>SERVICE</Text>
            <Text>(Y/ N)</Text>
          </View>
        </View>
      </View>

      {renderWorkExperienceRows()}

      {workExperience.length < 28 ? (
        <>{renderEmptyWorkExperienceRows()}</>
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

export default WorkExperiencePdf;
