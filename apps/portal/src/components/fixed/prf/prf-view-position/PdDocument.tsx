import React from 'react';

import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Fonts
// import CalibriRegular from '../../../../fonts/calibri-regular.ttf';
// import CalibriRegularBold from '../../../../fonts/calibri-regular-bold';
import { isEmpty } from 'lodash';
import Header from '../../pdf-documents/PositionDescription/Header';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    paddingTop: 10,
    paddingBottom: 25,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 5,
  },
  bodyBorder: {
    marginHorizontal: 50,
  },

  // Table Styles
  rowContainerTable: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  tHeadFirstLevel: {
    padding: '4 0 0 4',
  },
  tHeadSecondLevel: {
    // fontFamily: 'CalibriRegularBold',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    padding: '4 0 0 4',
    textAlign: 'center',
  },
  tData: {
    padding: '4 0 0 4',
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
  borderLeft: {
    borderLeft: '1px solid #000000',
  },
  borderBottom: {
    borderBottom: '1px solid #000000',
  },

  // Field Styles
  documentTitle: {
    // fontFamily: 'CalibriRegularBold',
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  headerText: {
    // fontFamily: 'CalibriRegularBold',
    fontFamily: 'Helvetica-Bold',
    textDecoration: 'underline',
    fontSize: 12,
    marginTop: 15,
    marginBottom: 4,
  },
  bodyText: {
    // fontFamily: 'CalibriRegular',
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  bodyTextBold: {
    // fontFamily: 'CalibriRegularBold',
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
  },
  upperCase: {
    textTransform: 'uppercase',
  },
  signatoryName: {
    // fontFamily: 'CalibriRegularBold',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    paddingTop: 3,
  },

  verticalCenter: { margin: 'auto 0' },
  horizontalCenter: { textAlign: 'center' },
  signature: {
    width: 100,
    marginHorizontal: 'auto',
  },

  // Width Styles
  w100: { width: '100%' },
  w75: { width: '75%' },
  w70: { width: '70%' },
  w60: { width: '60%' },
  w50: { width: '50%' },
  w40: { width: '40%' },
  w33_33: { width: '33.33%' },
  w30: { width: '30%' },
  w26: { width: '26%' },
  w20: { width: '20%' },
  w16: { width: '16%' },
  w15: { width: '15%' },
  w14: { width: '14%' },
  w10: { width: '10%' },
  w5: { width: '5%' },
});

Font.register({
  family: 'CalibriRegular',
  // src: '../../../../../public/fonts/calibri-regular.ttf',
  src: '/assets/fonts/calibri-regular.ttf',

  // src: CalibriRegular,
});

Font.register({
  family: 'CalibriRegularBold',
  // src: '../../../../../public/fonts/calibri-regular-bold.ttf',
  src: '/assets/fonts/calibri-regular-bold.ttf',

  // src: CalibriRegularBold,
});

export const PdDocument = (props) => {
  const { jobDescription, positionDutyResponsibilities, positionQualificationStandards, proficiencyLevel } = props;

  const renderCoreDuties = () => {
    const content = positionDutyResponsibilities?.duties.core.map((duty, index) => (
      <View style={[styles.rowContainerTable, styles.borderAll]} key={index} wrap={false}>
        <View style={[styles.w14, styles.tData, styles.borderRight]}>
          <Text style={[styles.horizontalCenter, styles.verticalCenter]}>{duty.percentage}</Text>
        </View>
        <View style={[styles.w60, styles.tData, styles.borderRight]}>
          <Text>{duty.description}</Text>
        </View>
        <View style={[styles.w26, styles.tData, styles.horizontalCenter]}>
          <Text>{duty.competency} / </Text>
          <Text>{duty.level}</Text>
        </View>
      </View>
    ));

    return content;
  };

  const renderFunctionalCompetencies = () => {
    const content = proficiencyLevel?.functional.map((competency, index) => (
      <View style={[styles.rowContainerTable, styles.borderAll]} key={index} wrap={false}>
        <View style={[styles.w60, styles.tData, styles.borderRight]}>
          <Text>
            <Text>{competency.name}</Text> - {competency.description}
          </Text>
        </View>
        <View style={[styles.w40, styles.tData]}>
          <Text style={[styles.horizontalCenter, styles.verticalCenter]}>{competency.level}</Text>
        </View>
      </View>
    ));

    return content;
  };

  const renderCrossCuttingCompetencies = () => {
    const content = proficiencyLevel?.crossCutting.map((competency, index) => (
      <View style={[styles.rowContainerTable, styles.borderAll]} key={index} wrap={false}>
        <View style={[styles.w60, styles.tData, styles.borderRight]}>
          <Text>
            <Text>{competency.name}</Text> - {competency.description}
          </Text>
        </View>
        <View style={[styles.w40, styles.tData]}>
          <Text style={[styles.horizontalCenter, styles.verticalCenter]}>{competency.level}</Text>
        </View>
      </View>
    ));

    return content;
  };

  const renderManagerialCompetencies = () => {
    const content = proficiencyLevel?.managerial.map((competency, index) => (
      <View style={[styles.rowContainerTable, styles.borderAll]} key={index} wrap={false}>
        <View style={[styles.w60, styles.tData, styles.borderRight]}>
          <Text>
            <Text>{competency.name}</Text> - {competency.description}
          </Text>
        </View>
        <View style={[styles.w40, styles.tData]}>
          <Text>{competency.level}</Text>
        </View>
      </View>
    ));

    return content;
  };

  const capitalizeFirstLetter = (string: string) => {
    if (!isEmpty(string)) return string.charAt(0).toUpperCase() + string.slice(1);
    else return '';
  };

  return (
    <Document
      author="General Santos City Water District"
      subject="Position Description - HRD-014-3"
      title={'Position Description for ' + jobDescription?.itemNumber}
    >
      <Page size="A4" style={styles.page}>
        <Header />

        <View style={[styles.bodyBorder]}>
          {/* Document Title */}
          <View style={[styles.documentTitle]}>
            <Text>POSITION DESCRIPTION</Text>
          </View>

          <View style={[styles.bodyText]}>
            {/* JOB DESCRIPTION */}
            <View>
              {/* Item Number */}
              <View style={[styles.rowContainer]}>
                <View style={[styles.w30]}>
                  <Text>Item Number</Text>
                </View>

                <View style={[styles.w10]}>
                  <Text>:</Text>
                </View>

                <View style={[styles.w60]}>
                  <Text>{jobDescription?.itemNumber || 'N/A'}</Text>
                </View>
              </View>

              {/* Job Title */}
              <View style={[styles.rowContainer]}>
                <View style={[styles.w30]}>
                  <Text>Position Title</Text>
                </View>

                <View style={[styles.w10]}>
                  <Text>:</Text>
                </View>

                <View style={[styles.w60]}>
                  <Text>{jobDescription?.positionTitle || 'N/A'}</Text>
                </View>
              </View>

              {/* Office */}
              <View style={[styles.rowContainer]}>
                <View style={[styles.w30]}>
                  <Text>Office</Text>
                </View>

                <View style={[styles.w10]}>
                  <Text>:</Text>
                </View>

                <View style={[styles.w60]}>
                  <Text>{jobDescription?.assignedTo.office.name || 'N/A'}</Text>
                </View>
              </View>

              {/* Department */}
              <View style={[styles.rowContainer]}>
                <View style={[styles.w30]}>
                  <Text>Department</Text>
                </View>

                <View style={[styles.w10]}>
                  <Text>:</Text>
                </View>

                <View style={[styles.w60]}>
                  <Text>{jobDescription?.assignedTo.department.name || 'N/A'}</Text>
                </View>
              </View>

              {/* Division */}
              <View style={[styles.rowContainer]}>
                <View style={[styles.w30]}>
                  <Text>Division</Text>
                </View>

                <View style={[styles.w10]}>
                  <Text>:</Text>
                </View>

                <View style={[styles.w60]}>
                  <Text>{jobDescription?.assignedTo.division.name || 'N/A'}</Text>
                </View>
              </View>

              {/* Reports to */}
              <View style={[styles.rowContainer]}>
                <View style={[styles.w30]}>
                  <Text>Reports to</Text>
                </View>

                <View style={[styles.w10]}>
                  <Text>:</Text>
                </View>

                <View style={[styles.w60]}>
                  <Text>{jobDescription?.reportsTo || 'N/A'}</Text>
                </View>
              </View>

              {/* Salary Grade */}
              <View style={[styles.rowContainer]}>
                <View style={[styles.w30]}>
                  <Text>Salary Grade</Text>
                </View>

                <View style={[styles.w10]}>
                  <Text>:</Text>
                </View>

                <View style={[styles.w60]}>
                  <Text>{jobDescription?.salary.salaryGrade || 0}</Text>
                </View>
              </View>

              {/* Nature of Appointment */}
              <View style={[styles.rowContainer]}>
                <View style={[styles.w30]}>
                  <Text>Nature of Appointment</Text>
                </View>

                <View style={[styles.w10]}>
                  <Text>:</Text>
                </View>

                <View style={[styles.w60]}>
                  <Text>{capitalizeFirstLetter(jobDescription?.natureOfAppointment) || 'N/A'}</Text>
                </View>
              </View>

              {/* Org struct description */}
              <View>
                <Text style={[styles.headerText]}>
                  Describe briefly the general function of Office/Department/Division
                </Text>
                <Text>{jobDescription?.description || 'N/A'}</Text>
              </View>

              {/* Job Summary */}
              <View>
                <Text style={[styles.headerText]}>
                  Describe briefly the general function of the position (Job Summary)
                </Text>
                <Text>{jobDescription?.summary || 'N/A'}</Text>
              </View>
            </View>

            {/* DUTIES AND RESPONSIBILITIES */}
            <View>
              <View>
                <Text style={[styles.headerText]}>Statement of Duties and Responsibilities</Text>

                {/* CORE */}
                <View>
                  {/* <View style={[styles.tHeadFirstLevel]}>
                    <Text>CORE</Text>
                  </View> */}

                  <View style={[styles.rowContainerTable, styles.borderAll]}>
                    <View style={[styles.w14, styles.tHeadSecondLevel, styles.borderRight]}>
                      <Text>Percentage of Work</Text>
                    </View>

                    <View style={[styles.w60, styles.tHeadSecondLevel, styles.borderRight]}>
                      <Text>Duties and Responsibilities</Text>
                    </View>

                    <View style={[styles.w26, styles.tHeadSecondLevel]}>
                      <Text>Competency/Level</Text>
                    </View>
                  </View>

                  {renderCoreDuties()}

                  {/* <View
                    style={[styles.rowContainerTable, styles.borderAll]}
                    wrap={false}
                  >
                    <View
                      style={[styles.w14, styles.tData, styles.borderRight]}
                    >
                      <Text
                        style={[styles.horizontalCenter, styles.verticalCenter]}
                      >
                        30.00
                      </Text>
                    </View>
                    <View
                      style={[styles.w60, styles.tData, styles.borderRight]}
                    >
                      <Text>
                        Spearheads in the implementation of the maintenance of
                        heavy/light equipment, including water tanks, boom
                        trucks, dump trucks, and backhoe loaders to ensure its
                        availability in the engineering- operation. Conducts
                        maintenance servicing of heavy/ light machinery and
                        equipment based on the running hours schedule provided
                        to ensure productive operation of the
                        machinery/equipment. Operates machinery and equipment,
                        such as water tanks, boom trucks, dump trucks, and
                        backhoe loaders, according to its operating procedure
                        and safety guidelines to ensure optimal performanc
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.w26,
                        styles.tData,
                        styles.horizontalCenter,
                      ]}
                    >
                      <Text>Customer Assistance and Request Handling / </Text>
                      <Text>ADVANCED</Text>
                    </View>
                  </View>

                  <View
                    style={[styles.rowContainerTable, styles.borderAll]}
                    wrap={false}
                  >
                    <View
                      style={[styles.w14, styles.tData, styles.borderRight]}
                    >
                      <Text
                        style={[styles.horizontalCenter, styles.verticalCenter]}
                      >
                        30.00
                      </Text>
                    </View>
                    <View
                      style={[styles.w60, styles.tData, styles.borderRight]}
                    >
                      <Text>
                        Spearheads in the implementation of the maintenance of
                        heavy/light equipment, including water tanks, boom
                        trucks, dump trucks, and backhoe loaders to ensure its
                        availability in the engineering- operation. Conducts
                        maintenance servicing of heavy/ light machinery and
                        equipment based on the running hours schedule provided
                        to ensure productive operation of the
                        machinery/equipment. Operates machinery and equipment,
                        such as water tanks, boom trucks, dump trucks, and
                        backhoe loaders, according to its operating procedure
                        and safety guidelines to ensure optimal performanc
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.w26,
                        styles.tData,
                        styles.horizontalCenter,
                      ]}
                    >
                      <Text>Customer Assistance and Request Handling / </Text>
                      <Text>ADVANCED</Text>
                    </View>
                  </View> */}
                </View>

                {/* SUPPORT */}
                {/* <View style={[styles.tableBorder, { marginTop: 10 }]}>
                  <View style={[styles.tHeadFirstLevel]}>
                    <Text>SUPPORT</Text>
                  </View>

                  <View style={[styles.rowContainerTable, styles.borderTop]}>
                    <View
                      style={[
                        styles.w14,
                        styles.tHeadSecondLevel,
                        styles.borderRight,
                      ]}
                    >
                      <Text>Percentage</Text>
                    </View>
                    <View
                      style={[
                        styles.w70,
                        styles.tHeadSecondLevel,
                        styles.borderRight,
                      ]}
                    >
                      <Text>Duty Description</Text>
                    </View>
                    <View style={[styles.w16, styles.tHeadSecondLevel]}>
                      <Text>Level</Text>
                    </View>
                  </View>

                  {renderSupportDuties()}
                </View> */}
              </View>
            </View>

            {/* QUALIFICATION STANDARDS */}
            <View wrap={false}>
              <View>
                <Text style={[styles.headerText]}>Qualification Standards</Text>
              </View>

              <View style={{ marginLeft: 15 }}>
                {/* Education */}
                <View style={[styles.rowContainer]}>
                  <View style={[styles.w20, styles.bodyTextBold]}>
                    <Text>Education</Text>
                  </View>

                  <View style={[styles.w5]}>
                    <Text>:</Text>
                  </View>

                  <View style={[styles.w75]}>
                    <Text>{positionQualificationStandards?.education || 'N/A'}</Text>
                  </View>
                </View>

                {/* Training */}
                <View style={[styles.rowContainer]}>
                  <View style={[styles.w20, styles.bodyTextBold]}>
                    <Text>Training</Text>
                  </View>

                  <View style={[styles.w5]}>
                    <Text>:</Text>
                  </View>

                  <View style={[styles.w75]}>
                    <Text>{positionQualificationStandards?.training || 'N/A'}</Text>
                  </View>
                </View>

                {/* Experience */}
                <View style={[styles.rowContainer]}>
                  <View style={[styles.w20, styles.bodyTextBold]}>
                    <Text>Experience</Text>
                  </View>

                  <View style={[styles.w5]}>
                    <Text>:</Text>
                  </View>

                  <View style={[styles.w75]}>
                    <Text>{positionQualificationStandards?.experience || 'N/A'}</Text>
                  </View>
                </View>

                {/* Eligibility */}
                <View style={[styles.rowContainer]}>
                  <View style={[styles.w20, styles.bodyTextBold]}>
                    <Text>Eligibility</Text>
                  </View>

                  <View style={[styles.w5]}>
                    <Text>:</Text>
                  </View>

                  <View style={[styles.w75]}>
                    <Text>{positionQualificationStandards?.eligibility || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* COMPETENCIES */}
            <View>
              <View>
                <Text style={[styles.headerText]}>Competencies</Text>
              </View>

              <View>
                {/* Table Header */}
                <View style={[styles.rowContainerTable, styles.borderAll]}>
                  <View style={[styles.w60, styles.tHeadSecondLevel, styles.borderRight]}>
                    <Text>Competency</Text>
                  </View>
                  <View style={[styles.w40, styles.tHeadSecondLevel]}>
                    <Text>Required Proficiency Level</Text>
                  </View>
                </View>

                {/* Table Body */}
                {renderFunctionalCompetencies()}
                {renderCrossCuttingCompetencies()}
                {renderManagerialCompetencies()}
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// PdDocument.propTypes = {
//   jobDescription?: PropTypes.object.isRequired,
//   positionDutyResponsibilities?: PropTypes.object.isRequired,
//   positionQualificationStandards?: PropTypes.object.isRequired,
//   proficiencyLevel?: PropTypes.object.isRequired,
//   prfTrail?: PropTypes.object,
//   prfDetails?: PropTypes.object,
// };
