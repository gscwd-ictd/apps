import React from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { isEmpty } from 'lodash';
import { EducationInfo } from '../../types/data/education.type';
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
    padding: '4 5',
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
  w24_5: { width: '24.5%' },
  w22_5: { width: '22.5%' },
  w17_2: { width: '17.2%' },
  w12: { width: '12%' },
  w8_9: { width: '8.9%' },
  w7_45: { width: '7.45%' },
});

Font.register({
  family: 'ArialNarrow',
  src: '/assets/fonts/arial-narrow.ttf',
});

Font.register({
  family: 'ArialNarrowBoldItalic',
  src: '/assets/fonts/arial-narrow-bold-italic.ttf',
});

type EducationalBackgroundPdfProps = {
  elementary: EducationInfo;
  secondary: EducationInfo;
  vocational: Array<EducationInfo>;
  college: Array<EducationInfo>;
  graduate: Array<EducationInfo>;
};

export const EducationalBackgroundPdf = ({
  elementary,
  secondary,
  vocational,
  college,
  graduate,
}: EducationalBackgroundPdfProps): JSX.Element => {
  return (
    <View>
      <View style={[styles.sectionTitleContainer, styles.borderTop]}>
        <Text style={styles.sectionTitleText}>III. EDUCATIONAL BACKGROUND</Text>
      </View>

      {/* Educational Background Header */}
      <View
        style={[
          styles.borderTop,
          { flexDirection: 'row', alignItems: 'stretch' },
        ]}
      >
        {/* Level */}
        <View
          style={[
            styles.inputKey,
            styles.borderRight,
            styles.w17_2,
            { flexDirection: 'row' },
          ]}
        >
          <Text style={[styles.verticalCenter]}>26.</Text>
          <Text style={[styles.verticalCenter, { paddingLeft: 28 }]}>
            LEVEL
          </Text>
        </View>

        {/* Name of School */}
        <View
          style={[
            styles.borderRight,
            styles.inputKey,
            styles.horizontalCenter,
            styles.w24_5,
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>NAME OF SCHOOL</Text>
            <Text>(Write in full)</Text>
          </View>
        </View>

        {/* Degree/Course */}
        <View
          style={[
            styles.borderRight,
            styles.inputKey,
            styles.horizontalCenter,
            styles.w22_5,
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>BASIC EDUCATION/DEGREE/COURSE</Text>
            <Text>(Write in full)</Text>
          </View>
        </View>

        {/* Period of Attendance */}
        <View
          style={[
            styles.borderRight,
            styles.horizontalCenter,
            styles.inputKey,
            styles.w12,
            { padding: '0' },
          ]}
        >
          <View style={[{ margin: 'auto 0', padding: '6 1' }]}>
            <Text style={{ fontSize: 6 }}>PERIOD OF ATTENDANCE</Text>
          </View>

          <View style={[styles.borderTop, { flexDirection: 'row' }]}>
            <View
              style={[styles.borderRight, styles.w50, styles.horizontalCenter]}
            >
              <Text style={{ lineHeight: 1.4, paddingTop: 0.8 }}>From</Text>
            </View>
            <View style={[styles.w50, styles.horizontalCenter]}>
              <Text style={{ lineHeight: 1.4, paddingTop: 0.8 }}>To</Text>
            </View>
          </View>
        </View>

        {/* Units earned */}
        <View
          style={[
            styles.borderRight,
            styles.inputKey,
            styles.horizontalCenter,
            styles.w8_9,
            { padding: '0 2' },
          ]}
        >
          <View style={[styles.verticalCenter, { fontSize: 6 }]}>
            <Text>HIGHEST LEVEL/ UNITS EARNED</Text>
            <Text>(if not graduated)</Text>
          </View>
        </View>

        {/* Year graduated */}
        <View
          style={[
            styles.borderRight,
            styles.inputKey,
            styles.horizontalCenter,
            styles.w7_45,
            { padding: '0 2' },
          ]}
        >
          <View
            style={[styles.verticalCenter, { padding: '0 4', fontSize: 6 }]}
          >
            <Text>YEAR GRADUATED</Text>
          </View>
        </View>

        {/* Scholarship/Honors */}
        <View
          style={[
            styles.inputKey,
            styles.horizontalCenter,
            styles.w7_45,
            { padding: '0 2' },
          ]}
        >
          <View style={[styles.verticalCenter, { fontSize: 6 }]}>
            <Text>SCHOLARSHIP/ ACADEMIC HONORS RECEIVED</Text>
          </View>
        </View>
      </View>

      {/* Elementary */}
      <View
        style={[
          styles.borderTop,
          { flexDirection: 'row', alignItems: 'stretch' },
        ]}
      >
        {/* Level */}
        <View style={[styles.inputKey, styles.borderRight, styles.w17_2]}>
          <Text style={[styles.verticalCenter]}>ELEMENTARY</Text>
        </View>

        {/* Name of School */}
        <View
          style={[
            styles.borderRight,
            styles.inputValue,
            styles.w24_5,
            { padding: '4 2' },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>{elementary.schoolName || 'N/A'}</Text>
          </View>
        </View>

        {/* Degree/Course */}
        <View
          style={[
            styles.borderRight,
            styles.inputValue,
            styles.w22_5,
            { padding: '4 2' },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>{elementary.degree || 'N/A'}</Text>
          </View>
        </View>

        {/* Period of Attendance */}
        <View
          style={[
            styles.borderRight,
            styles.inputValue,
            styles.w12,
            { padding: '0', flexDirection: 'row' },
          ]}
        >
          <View
            style={[styles.borderRight, styles.w50, styles.horizontalCenter]}
          >
            <Text style={[styles.verticalCenter]}>
              {elementary.from || 'N/A'}
            </Text>
          </View>
          <View style={[styles.w50, styles.horizontalCenter]}>
            <Text style={[styles.verticalCenter]}>
              {elementary.to || 'PRESENT'}
            </Text>
          </View>
        </View>

        {/* Units earned */}
        <View
          style={[
            styles.borderRight,
            styles.inputValue,
            styles.horizontalCenter,
            styles.w8_9,
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>{elementary.units || 'N/A'}</Text>
          </View>
        </View>

        {/* Year graduated */}
        <View
          style={[
            styles.borderRight,
            styles.inputValue,
            styles.horizontalCenter,
            styles.w7_45,
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>{elementary.yearGraduated || 'N/A'}</Text>
          </View>
        </View>

        {/* Scholarship/Honors */}
        <View
          style={[
            styles.inputValue,
            styles.horizontalCenter,
            styles.w7_45,
            { fontSize: 6.2, padding: '4 2' },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text hyphenationCallback={(e) => chunkSubstr(e)}>
              {elementary.awards || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      {/* Secondary */}
      <View
        style={[
          styles.borderTop,
          { flexDirection: 'row', alignItems: 'stretch' },
        ]}
      >
        {/* Level */}
        <View style={[styles.inputKey, styles.borderRight, styles.w17_2]}>
          <Text style={[styles.verticalCenter]}>SECONDARY</Text>
        </View>

        {/* Name of School */}
        <View
          style={[
            styles.borderRight,
            styles.inputValue,
            styles.w24_5,
            { padding: '4 2' },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>{secondary.schoolName || 'N/A'}</Text>
          </View>
        </View>

        {/* Degree/Course */}
        <View
          style={[
            styles.borderRight,
            styles.inputValue,
            styles.w22_5,
            { padding: '4 2' },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>{secondary.degree || 'N/A'}</Text>
          </View>
        </View>

        {/* Period of Attendance */}
        <View
          style={[
            styles.borderRight,
            styles.inputValue,
            styles.w12,
            { padding: '0', flexDirection: 'row' },
          ]}
        >
          <View
            style={[styles.borderRight, styles.w50, styles.horizontalCenter]}
          >
            <Text style={[styles.verticalCenter]}>
              {secondary.from || 'N/A'}
            </Text>
          </View>
          <View style={[styles.w50, styles.horizontalCenter]}>
            <Text style={[styles.verticalCenter]}>
              {secondary.to || 'PRESENT'}
            </Text>
          </View>
        </View>

        {/* Units earned */}
        <View
          style={[
            styles.borderRight,
            styles.inputValue,
            styles.horizontalCenter,
            styles.w8_9,
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>{secondary.units || 'N/A'}</Text>
          </View>
        </View>

        {/* Year graduated */}
        <View
          style={[
            styles.borderRight,
            styles.inputValue,
            styles.horizontalCenter,
            styles.w7_45,
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text>{secondary.yearGraduated || 'N/A'}</Text>
          </View>
        </View>

        {/* Scholarship/Honors */}
        <View
          style={[
            styles.inputValue,
            styles.horizontalCenter,
            styles.w7_45,
            { fontSize: 6.2, padding: '4 2' },
          ]}
        >
          <View style={[styles.verticalCenter]}>
            <Text hyphenationCallback={(e) => chunkSubstr(e)}>
              {secondary.awards || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      {/* Vocational */}
      {!isEmpty(vocational) ? (
        <>
          {vocational.slice(0, 1).map((vocation, index) => (
            <View
              style={[
                styles.borderTop,
                { flexDirection: 'row', alignItems: 'stretch' },
              ]}
              key={index}
            >
              {/* Level */}
              <View style={[styles.inputKey, styles.borderRight, styles.w17_2]}>
                <Text style={[styles.verticalCenter]}>
                  VOCATIONAL/TRADE COURSE
                </Text>
              </View>

              {/* Name of School */}
              <View
                style={[
                  styles.borderRight,
                  styles.inputValue,
                  styles.w24_5,
                  { padding: '4 2' },
                ]}
              >
                <View style={[styles.verticalCenter]}>
                  <Text>{vocation.schoolName || 'N/A'}</Text>
                </View>
              </View>

              {/* Degree/Course */}
              <View
                style={[
                  styles.borderRight,
                  styles.inputValue,
                  styles.w22_5,
                  { padding: '4 2' },
                ]}
              >
                <View style={[styles.verticalCenter]}>
                  <Text>{vocation.degree || 'N/A'}</Text>
                </View>
              </View>

              {/* Period of Attendance */}
              <View
                style={[
                  styles.borderRight,
                  styles.inputValue,
                  styles.w12,
                  { padding: '0', flexDirection: 'row' },
                ]}
              >
                <View
                  style={[
                    styles.borderRight,
                    styles.w50,
                    styles.horizontalCenter,
                  ]}
                >
                  <Text style={[styles.verticalCenter]}>
                    {vocation.from || 'N/A'}
                  </Text>
                </View>
                <View style={[styles.w50, styles.horizontalCenter]}>
                  <Text style={[styles.verticalCenter]}>
                    {vocation.to || 'PRESENT'}
                  </Text>
                </View>
              </View>

              {/* Units earned */}
              <View
                style={[
                  styles.borderRight,
                  styles.inputValue,
                  styles.horizontalCenter,
                  styles.w8_9,
                ]}
              >
                <View style={[styles.verticalCenter]}>
                  <Text>
                    {vocation.yearGraduated !== null
                      ? 'GRADUATED'
                      : vocation.units === '' && vocation.yearGraduated === null
                      ? 'N/A'
                      : vocation.units}
                  </Text>
                </View>
              </View>

              {/* Year graduated */}
              <View
                style={[
                  styles.borderRight,
                  styles.inputValue,
                  styles.horizontalCenter,
                  styles.w7_45,
                  { fontSize: 6.2, padding: '4 2' },
                ]}
              >
                <View style={[styles.verticalCenter]}>
                  <Text>{vocation.yearGraduated || 'N/A'}</Text>
                </View>
              </View>

              {/* Scholarship/Honors */}
              <View
                style={[
                  styles.inputValue,
                  styles.horizontalCenter,
                  styles.w7_45,
                  { fontSize: 6.2, padding: '4 2' },
                ]}
              >
                <View style={[styles.verticalCenter]}>
                  <Text hyphenationCallback={(e) => chunkSubstr(e)}>
                    {vocation.awards || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </>
      ) : (
        <View
          style={[
            styles.borderTop,
            { flexDirection: 'row', alignItems: 'stretch' },
          ]}
        >
          {/* Level */}
          <View style={[styles.inputKey, styles.borderRight, styles.w17_2]}>
            <Text style={[styles.verticalCenter]}>VOCATIONAL/TRADE COURSE</Text>
          </View>

          {/* Name of School */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.w24_5,
              { padding: '4 2' },
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Degree/Course */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.w22_5,
              { padding: '4 2' },
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Period of Attendance */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.w12,
              { padding: '0', flexDirection: 'row' },
            ]}
          >
            <View
              style={[styles.borderRight, styles.w50, styles.horizontalCenter]}
            >
              <Text style={[styles.verticalCenter]}>N/A</Text>
            </View>
            <View style={[styles.w50, styles.horizontalCenter]}>
              <Text style={[styles.verticalCenter]}>N/A</Text>
            </View>
          </View>

          {/* Units earned */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.horizontalCenter,
              styles.w8_9,
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Year graduated */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.horizontalCenter,
              styles.w7_45,
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Scholarship/Honors */}
          <View
            style={[
              styles.inputValue,
              styles.horizontalCenter,
              styles.w7_45,
              { fontSize: 6.2, padding: '4 2' },
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>
        </View>
      )}

      {/* College */}
      {!isEmpty(college) ? (
        <>
          {college.slice(0, 1).map((college, index) => (
            <View
              style={[
                styles.borderTop,
                { flexDirection: 'row', alignItems: 'stretch' },
              ]}
              key={index}
            >
              {/* Level */}
              <View style={[styles.inputKey, styles.borderRight, styles.w17_2]}>
                <Text style={[styles.verticalCenter]}>COLLEGE</Text>
              </View>

              {/* Name of School */}
              <View
                style={[
                  styles.borderRight,
                  styles.inputValue,
                  styles.w24_5,
                  { padding: '4 2' },
                ]}
              >
                <View style={[styles.verticalCenter]}>
                  <Text>{college.schoolName || 'N/A'}</Text>
                </View>
              </View>

              {/* Degree/Course */}
              <View
                style={[
                  styles.borderRight,
                  styles.inputValue,
                  styles.w22_5,
                  { padding: '4 2' },
                ]}
              >
                <View style={[styles.verticalCenter]}>
                  <Text>{college.degree || 'N/A'}</Text>
                </View>
              </View>

              {/* Period of Attendance */}
              <View
                style={[
                  styles.borderRight,
                  styles.inputValue,
                  styles.w12,
                  { padding: '0', flexDirection: 'row' },
                ]}
              >
                <View
                  style={[
                    styles.borderRight,
                    styles.w50,
                    styles.horizontalCenter,
                  ]}
                >
                  <Text style={[styles.verticalCenter]}>
                    {college.from || 'N/A'}
                  </Text>
                </View>
                <View style={[styles.w50, styles.horizontalCenter]}>
                  <Text style={[styles.verticalCenter]}>
                    {college.to || 'PRESENT'}
                  </Text>
                </View>
              </View>

              {/* Units earned */}
              <View
                style={[
                  styles.borderRight,
                  styles.inputValue,
                  styles.horizontalCenter,
                  styles.w8_9,
                ]}
              >
                <View style={[styles.verticalCenter]}>
                  <Text>
                    {college.yearGraduated !== null
                      ? 'GRADUATED'
                      : college.units === '' && college.yearGraduated === null
                      ? 'N/A'
                      : college.units}
                  </Text>
                </View>
              </View>

              {/* Year graduated */}
              <View
                style={[
                  styles.borderRight,
                  styles.inputValue,
                  styles.horizontalCenter,
                  styles.w7_45,
                ]}
              >
                <View style={[styles.verticalCenter]}>
                  <Text>{college.yearGraduated || 'N/A'}</Text>
                </View>
              </View>

              {/* Scholarship/Honors */}
              <View
                style={[
                  styles.inputValue,
                  styles.horizontalCenter,
                  styles.w7_45,
                  { fontSize: 6.2, padding: '4 2' },
                ]}
              >
                <View style={[styles.verticalCenter]}>
                  <Text hyphenationCallback={(e) => chunkSubstr(e)}>
                    {college.awards || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </>
      ) : (
        <View
          style={[
            styles.borderTop,
            { flexDirection: 'row', alignItems: 'stretch' },
          ]}
        >
          {/* Level */}
          <View style={[styles.inputKey, styles.borderRight, styles.w17_2]}>
            <Text style={[styles.verticalCenter]}>COLLEGE</Text>
          </View>

          {/* Name of School */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.w24_5,
              { padding: '4 2' },
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Degree/Course */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.w22_5,
              { padding: '4 2' },
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Period of Attendance */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.w12,
              { padding: '0', flexDirection: 'row' },
            ]}
          >
            <View
              style={[styles.borderRight, styles.w50, styles.horizontalCenter]}
            >
              <Text style={[styles.verticalCenter]}>N/A</Text>
            </View>
            <View style={[styles.w50, styles.horizontalCenter]}>
              <Text style={[styles.verticalCenter]}>N/A</Text>
            </View>
          </View>

          {/* Units earned */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.horizontalCenter,
              styles.w8_9,
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Year graduated */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.horizontalCenter,
              styles.w7_45,
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Scholarship/Honors */}
          <View
            style={[
              styles.inputValue,
              styles.horizontalCenter,
              styles.w7_45,
              { fontSize: 6.2, padding: '4 2' },
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>
        </View>
      )}

      {/* Graduate Studies */}
      {!isEmpty(graduate) ? (
        <>
          {graduate.slice(0, 1).map((graduate, index) => (
            <View
              style={[
                styles.borderTop,
                { flexDirection: 'row', alignItems: 'stretch' },
              ]}
              key={index}
            >
              {/* Level */}
              <View style={[styles.inputKey, styles.borderRight, styles.w17_2]}>
                <Text style={[styles.verticalCenter]}>GRADUATE STUDIES</Text>
              </View>

              {/* Name of School */}
              <View
                style={[
                  styles.borderRight,
                  styles.inputValue,
                  styles.w24_5,
                  { padding: '4 2' },
                ]}
              >
                <View style={[styles.verticalCenter]}>
                  <Text>{graduate.schoolName || 'N/A'}</Text>
                </View>
              </View>

              {/* Degree/Course */}
              <View
                style={[
                  styles.borderRight,
                  styles.inputValue,
                  styles.w22_5,
                  { padding: '4 2' },
                ]}
              >
                <View style={[styles.verticalCenter]}>
                  <Text>{graduate.degree || 'N/A'}</Text>
                </View>
              </View>

              {/* Period of Attendance */}
              <View
                style={[
                  styles.borderRight,
                  styles.inputValue,
                  styles.w12,
                  { padding: '0', flexDirection: 'row' },
                ]}
              >
                <View
                  style={[
                    styles.borderRight,
                    styles.w50,
                    styles.horizontalCenter,
                  ]}
                >
                  <Text style={[styles.verticalCenter]}>
                    {graduate.from || 'N/A'}
                  </Text>
                </View>
                <View style={[styles.w50, styles.horizontalCenter]}>
                  <Text style={[styles.verticalCenter]}>
                    {graduate.to || 'PRESENT'}
                  </Text>
                </View>
              </View>

              {/* Units earned */}
              <View
                style={[
                  styles.borderRight,
                  styles.inputValue,
                  styles.horizontalCenter,
                  styles.w8_9,
                ]}
              >
                <View style={[styles.verticalCenter]}>
                  <Text>
                    {graduate.yearGraduated !== null
                      ? 'GRADUATED'
                      : graduate.units === '' && graduate.yearGraduated === null
                      ? 'N/A'
                      : graduate.units}
                  </Text>
                </View>
              </View>

              {/* Year graduated */}
              <View
                style={[
                  styles.borderRight,
                  styles.inputValue,
                  styles.horizontalCenter,
                  styles.w7_45,
                ]}
              >
                <View style={[styles.verticalCenter]}>
                  <Text>{graduate.yearGraduated || 'N/A'}</Text>
                </View>
              </View>

              {/* Scholarship/Honors */}
              <View
                style={[
                  styles.inputValue,
                  styles.horizontalCenter,
                  styles.w7_45,
                  { fontSize: 6.2, padding: '4 2' },
                ]}
              >
                <View style={[styles.verticalCenter]}>
                  <Text hyphenationCallback={(e) => chunkSubstr(e)}>
                    {graduate.awards || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </>
      ) : (
        <View
          style={[
            styles.borderTop,
            { flexDirection: 'row', alignItems: 'stretch' },
          ]}
        >
          {/* Level */}
          <View style={[styles.inputKey, styles.borderRight, styles.w17_2]}>
            <Text style={[styles.verticalCenter]}>GRADUATE STUDIES</Text>
          </View>

          {/* Name of School */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.w24_5,
              { padding: '4 2' },
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Degree/Course */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.w22_5,
              { padding: '4 2' },
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Period of Attendance */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.w12,
              { padding: '0', flexDirection: 'row' },
            ]}
          >
            <View
              style={[styles.borderRight, styles.w50, styles.horizontalCenter]}
            >
              <Text style={[styles.verticalCenter]}>N/A</Text>
            </View>
            <View style={[styles.w50, styles.horizontalCenter]}>
              <Text style={[styles.verticalCenter]}>N/A</Text>
            </View>
          </View>

          {/* Units earned */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.horizontalCenter,
              styles.w8_9,
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Year graduated */}
          <View
            style={[
              styles.borderRight,
              styles.inputValue,
              styles.horizontalCenter,
              styles.w7_45,
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>

          {/* Scholarship/Honors */}
          <View
            style={[
              styles.inputValue,
              styles.horizontalCenter,
              styles.w7_45,
              { fontSize: 6.2, padding: '4 2' },
            ]}
          >
            <View style={[styles.verticalCenter]}>
              <Text>N/A</Text>
            </View>
          </View>
        </View>
      )}

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

export default EducationalBackgroundPdf;
