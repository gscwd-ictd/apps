import React, { useState, useEffect } from 'react';
import {
  PDFViewer,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { Accomplishment, Duty } from '../../store/work-experience-sheet.store';
import { Data } from 'apps/job-portal/utils/types/data/wes.type';

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
  },
  bodyBorder: {
    margin: 10,
    border: '1px solid #000000',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  mainTitleContainer: {
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#969696',
  },
  mainTitle: {
    fontFamily: 'ArialNarrowBoldItalic',
    fontSize: 18,
    paddingVertical: 5,
    color: '#FFFFFF',
  },
  instructionsContainer: {
    borderTop: '1px solid #000000',
    backgroundColor: '#EAEAEA',
    fontFamily: 'ArialItalic',
    fontSize: 12,
    padding: 2,
  },
  workExperiences: {
    borderTop: '1px solid #000000',
    padding: 10,
  },
  workExperienceContainer: {
    fontFamily: 'ArialRegular',
    fontSize: 12,
    marginLeft: 20,
  },
  signatoryContainer: {
    flexDirection: 'row',
    fontFamily: 'ArialRegular',
    fontSize: 12,
    paddingRight: 30,
    paddingTop: 20,
  },

  // Border Styles
  borderAll: {
    border: '1px solid #000000',
  },
  borderTop: {
    borderTop: '1px solid #000000',
  },
  borderRight: {
    borderRight: '1px solid #000000',
  },
  borderBottom: {
    borderBottom: '1px solid #000000',
  },

  // Field Styles
  verticalCenter: { margin: 'auto 0' },
  horizontalCenter: { textAlign: 'center' },
  mainListStyle: { lineHeight: 1.3 },
  subListStyle: { lineHeight: 1.3 },

  // Width Styles
  w100: { width: '100%' },
  w85: { width: '85%' },
  w60: { width: '60%' },
  w40: { width: '40%' },
  w15: { width: '15%' },
});

Font.register({
  family: 'ArialRegular',
  src: '/assets/fonts/arial-regular.ttf',
});

Font.register({
  family: 'ArialBold',
  src: '/assets/fonts/arial.ttf',
});

Font.register({
  family: 'ArialItalic',
  src: '/assets/fonts/arial-italic.ttf',
});

Font.register({
  family: 'ArialBoldItalic',
  src: '/assets/fonts/arial-bold-italic.ttf',
});

Font.register({
  family: 'ArialNarrowBold',
  src: '/assets/fonts/arial-narrow-bold.ttf',
});

Font.register({
  family: 'ArialNarrowBoldItalic',
  src: '/assets/fonts/arial-narrow-bold-italic.ttf',
});

export const WesDocument = ({
  formatDate,
  workExperiencesSheet,
  isSubmitted,
  applicant,
}: Data): JSX.Element => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    applicant && console.log(applicant);
  }, [applicant]);

  // Rendering of individual row of work experience
  const renderWorkExperiences = () => {
    const content =
      workExperiencesSheet &&
      workExperiencesSheet.map((experience, index) => (
        <View style={[styles.workExperiences]} key={index} wrap={false}>
          <View style={[styles.workExperienceContainer]}>
            <Text style={[styles.mainListStyle]}>
              • Duration: {formatDate(experience.from)} -{' '}
              {experience.to != null ? formatDate(experience.to) : 'PRESENT'}
            </Text>
            <Text style={[styles.mainListStyle]}>
              • Position: {experience.positionTitle}
            </Text>
            <Text style={[styles.mainListStyle]}>
              • Name of Office/Unit: {experience.nameOfOffice}
            </Text>
            <Text style={[styles.mainListStyle]}>
              • Immediate Supervisor: {experience.immediateSupervisor}
            </Text>
            <Text style={[styles.mainListStyle]}>
              • Name of Agency/Organization and Location:{' '}
              {experience.companyName}
            </Text>

            <Text style={[styles.mainListStyle]}>
              • List of Accomplishments and Contributions (if any)
            </Text>
            <View style={{ paddingLeft: 10 }}>
              {renderAccomplishments(experience.accomplishments)}
            </View>

            <Text style={[styles.mainListStyle]}>
              • Summary of Actual Duties
            </Text>
            <View style={{ paddingLeft: 10 }}>
              {renderDuties(experience.duties)}
            </View>
          </View>
        </View>
      ));

    return content;
  };

  // List of accomplishments
  const renderAccomplishments = (
    accomplishmentArray: Array<Accomplishment>
  ) => {
    const content = accomplishmentArray.map((accomplishment, index) => (
      <Text style={[styles.subListStyle]} key={index}>
        - {accomplishment.accomplishment}
      </Text>
    ));

    return content;
  };

  // List of duties
  const renderDuties = (dutiesArray: Array<Duty>) => {
    const content = dutiesArray.map((duty, index) => (
      <Text style={[styles.subListStyle]} key={index}>
        - {duty.duty}
      </Text>
    ));

    return content;
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <PDFViewer width={'100%'} height={760} showToolbar>
          <Document
            author="General Santos City Water District"
            subject="CS Form No. 212. Revised 2017"
            title="Personal Data Sheet"
          >
            {/* Page 1 */}
            <Page size={[612.3, 935.4]} style={styles.page}>
              {/* <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed /> */}

              <Text
                style={{
                  fontFamily: 'ArialNarrowBoldItalic',
                  fontSize: 11,
                  padding: '13 0 0 13',
                }}
                render={({ pageNumber }) => {
                  if (pageNumber == 1) {
                    return `${''}`;
                  } else {
                    return `${'Attachment to CS Form No. 212'}`;
                  }
                }}
                fixed
              />

              <View style={styles.bodyBorder}>
                {/* DOCUMENT TITLE */}
                <View style={styles.mainTitleContainer}>
                  <Text style={styles.mainTitle}>WORK EXPERIENCE SHEET</Text>
                </View>

                {/* INSTRUCTIONS */}
                <View style={[styles.instructionsContainer]}>
                  <View style={[styles.rowContainer]}>
                    <View style={[styles.w15]}>
                      <Text
                        style={[
                          {
                            fontFamily: 'ArialBoldItalic',
                            textAlign: 'center',
                          },
                        ]}
                      >
                        Instructions:
                      </Text>
                    </View>
                    <View style={[styles.w85]}>
                      <Text>
                        1. Include only the work experiences relevant to the
                        position being applied to.
                      </Text>
                      <Text style={[{ paddingTop: 15 }]}>
                        2. The duration should include start and finish dates,
                        if known, month in abbreviated form, if known, and year
                        in full. For the current position, use the word Present,
                        e.g., 1998-Present. Work experience should be listed
                        from most recent first.
                      </Text>
                    </View>
                  </View>
                </View>

                {/* WORK EXPERIENCE */}
                {renderWorkExperiences()}
              </View>

              {/* SIGNATORY */}
              <View style={[styles.signatoryContainer]} wrap={false}>
                <View style={[styles.w60]}></View>
                <View style={[styles.w40, { textAlign: 'center' }]}>
                  <View style={[styles.borderBottom]}>
                    <Text style={{ fontFamily: 'ArialBold' }}>
                      {applicant.fullName?.toUpperCase()}
                    </Text>
                  </View>
                  <Text>(Signature over Printed Name</Text>
                  <Text>of Employee/Applicant)</Text>

                  {isSubmitted ? (
                    <Text style={{ paddingTop: 15 }}>
                      Date: {'MMMM DD, YYYY'}
                    </Text>
                  ) : null}
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      )}
    </>
  );
};
