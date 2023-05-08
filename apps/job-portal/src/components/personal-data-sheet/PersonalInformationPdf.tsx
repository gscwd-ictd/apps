import React from 'react'
import { Text, View, StyleSheet, Font, Svg, Path } from '@react-pdf/renderer'
import { PersonalInfo, GovernmentIssuedIds } from '../../types/data/basic-info.type'
import { Address } from '../../types/data/address.type'

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
  },
  inputAddressKey: {
    fontFamily: 'ArialNarrowItalic',
    fontSize: 6.7,
    padding: '0 8',
  },

  // Border Styles
  borderTop: {
    borderTop: '1px solid #000000',
  },
  borderRight: {
    borderRight: '1px solid #000000',
  },

  // Width Styles
  w100: { width: '100%' },
  w82_9: { width: '82.9%' },
  w73_5: { width: '73.5%' },
  w72: { width: '72%' },
  w62: { width: '62%' },
  w60: { width: '60%' },
  w59_3: { width: '59.3%' },
  w59: { width: '59%' },
  w58: { width: '58%' },
  w55: { width: '55%' },
  w50: { width: '50%' },
  w45: { width: '45%' },
  w42: { width: '42%' },
  w40_7: { width: '40.7%' },
  w40: { width: '40%' },
  w38: { width: '38%' },
  w28: { width: '28%' },
  w26_5: { width: '26.5%' },
  w17_1: { width: '17.1%' },
})

Font.register({
  family: 'ArialNarrow',
  src: '/assets/fonts/arial-narrow.ttf',
})

Font.register({
  family: 'ArialNarrowItalic',
  src: '/assets/fonts/arial-narrow-italic.ttf',
})

Font.register({
  family: 'ArialNarrowBoldItalic',
  src: '/assets/fonts/arial-narrow-bold-italic.ttf',
})

type PersonalInformationPdfProps = {
  formatDate: any
  personalInfo: PersonalInfo
  permanentAddress: Address
  residentialAddress: Address
  governmentIssuedIds: GovernmentIssuedIds
}

export const PersonalInformationPdf = ({
  formatDate,
  personalInfo,
  permanentAddress,
  residentialAddress,
  governmentIssuedIds,
}: PersonalInformationPdfProps): JSX.Element => {
  return (
    <View>
      <View style={[styles.sectionTitleContainer, styles.borderTop]}>
        <Text style={styles.sectionTitleText}>I. PERSONAL INFORMATION</Text>
      </View>

      {/* Line 10 Surname */}
      <View style={[styles.lineContainer, styles.borderTop]}>
        <View style={[styles.borderRight, styles.inputKey, styles.w17_1]}>
          <Text>2. SURNAME</Text>
        </View>
        <View style={[styles.w82_9, styles.inputValue]}>
          <Text>{personalInfo.lastName || 'N/A'}</Text>
        </View>
      </View>

      {/* Line 11 First name */}
      <View style={[styles.lineContainer]}>
        <View style={[styles.borderRight, styles.inputKey, styles.w17_1]}>
          <Text>&nbsp;&nbsp;&nbsp;&nbsp;FIRST NAME</Text>
        </View>
        <View style={[styles.w59, styles.inputValue, styles.borderRight, styles.borderTop]}>
          <Text>{personalInfo.firstName || 'N/A'}</Text>
        </View>
        <View
          style={[
            styles.inputKey,
            styles.borderTop,
            {
              padding: 1,
              width: '23.9%',
              fontSize: 5.7,
              flexDirection: 'row',
            },
          ]}
        >
          <Text>NAME EXTENSION (JR., SR)</Text>
          <Text style={{ padding: '4 10', fontSize: 5.7 }}>{personalInfo.nameExtension || 'N/A'}</Text>
        </View>
      </View>

      {/* Line 12 Middle name*/}
      <View style={[styles.lineContainer]}>
        <View style={[styles.borderRight, styles.inputKey, styles.w17_1]}>
          <Text>&nbsp;&nbsp;&nbsp;&nbsp;MIDDLE NAME</Text>
        </View>
        <View style={[styles.borderTop, styles.w82_9, styles.inputValue]}>
          <Text>{personalInfo.middleName || 'N/A'}</Text>
        </View>
      </View>

      {/* Line 13 Date of Birth */}
      <View style={[styles.lineContainer, styles.borderTop]}>
        <View style={[styles.lineContainer, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}>
            <Text>3. DATE OF BIRTH</Text>
            <Text>&nbsp;&nbsp;&nbsp;&nbsp;(mm/dd/yyyy)</Text>
          </View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3]}>
            <Text>{formatDate(personalInfo.birthDate)}</Text>
          </View>
        </View>

        <View style={[styles.lineContainer, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w38, { padding: '4 8 0 5' }]}>
            <Text>16. CITIZENSHIP</Text>
          </View>

          <View style={[styles.inputValue, styles.w62, { flexDirection: 'row', padding: '4 8 0 8' }]}>
            <View style={{ flexDirection: 'row' }}>
              {personalInfo.citizenship === 'Filipino' ? (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path
                    d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z"
                    stroke="black"
                  />
                </Svg>
              ) : (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" stroke="black" />
                </Svg>
              )}
              <Text>&nbsp;&nbsp;Filipino</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
              {personalInfo.citizenship === 'Dual Citizenship' ? (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path
                    d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z"
                    stroke="black"
                  />
                </Svg>
              ) : (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" stroke="black" />
                </Svg>
              )}
              <Text>&nbsp;&nbsp;Dual Citizenship</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Line 14 __ */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7, { padding: 0 }]}></View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { padding: 0 }]}></View>
        </View>

        <View style={[styles.lineContainer, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w38, { padding: 0 }]}></View>
          <View style={[styles.inputValue, styles.w62, { flexDirection: 'row', padding: 0 }]}>
            <View style={{ flexDirection: 'row', paddingLeft: 75 }}>
              {personalInfo.citizenshipType === 'By birth' ? (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path
                    d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z"
                    stroke="black"
                  />
                </Svg>
              ) : (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" stroke="black" />
                </Svg>
              )}
              <Text>&nbsp;&nbsp;By birth</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingLeft: 20 }}>
              {personalInfo.citizenshipType === 'By naturalization' ? (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path
                    d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z"
                    stroke="black"
                  />
                </Svg>
              ) : (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" stroke="black" />
                </Svg>
              )}
              <Text>&nbsp;&nbsp;By naturalization</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Line 15 Place of Birth */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.borderTop, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}>
            <Text>4. PLACE OF BIRTH</Text>
          </View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3]}>
            <Text>{personalInfo.birthPlace}</Text>
          </View>
        </View>

        <View style={[styles.lineContainer, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w38, { padding: '4 8 0 8', textAlign: 'center' }]}>
            <Text>If holder of dual citizenship,</Text>
          </View>

          <View
            style={[
              styles.inputValue,
              styles.w62,
              {
                padding: '4 8 0 8',
                textAlign: 'center',
              },
            ]}
          >
            <Text>Pls. indicate country:</Text>
          </View>
        </View>
      </View>

      {/* Line 16 Sex */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.borderTop, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}>
            <Text>5. SEX</Text>
          </View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { flexDirection: 'row', padding: '4 8 0 8' }]}>
            <View style={{ flexDirection: 'row' }}>
              {personalInfo.sex === 'Male' ? (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path
                    d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z"
                    stroke="black"
                  />
                </Svg>
              ) : (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" stroke="black" />
                </Svg>
              )}
              <Text>&nbsp;&nbsp;Male</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingLeft: 25 }}>
              {personalInfo.sex === 'Female' ? (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path
                    d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z"
                    stroke="black"
                  />
                </Svg>
              ) : (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" stroke="black" />
                </Svg>
              )}
              <Text>&nbsp;&nbsp;Female</Text>
            </View>
          </View>
        </View>

        <View style={[styles.lineContainer, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w38, { padding: '4 8 0 8', textAlign: 'center' }]}>
            <Text>please indicate the details.</Text>
          </View>

          <View
            style={[
              styles.inputValue,
              styles.w62,
              {
                padding: '4 8 0 8',
                textAlign: 'center',
                borderTop: '0.5px solid #00000063',
              },
            ]}
          >
            <Text>{personalInfo.country || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Line 17 Civil Status*/}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.borderTop, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}>
            <Text>6. CIVIL STATUS</Text>
          </View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { flexDirection: 'row', padding: '4 8 0 8' }]}>
            <View style={{ flexDirection: 'row' }}>
              {personalInfo.civilStatus === 'Single' ? (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path
                    d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z"
                    stroke="black"
                  />
                </Svg>
              ) : (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" stroke="black" />
                </Svg>
              )}
              <Text>&nbsp;&nbsp;Single</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingLeft: 22 }}>
              {personalInfo.civilStatus === 'Married' ? (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path
                    d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z"
                    stroke="black"
                  />
                </Svg>
              ) : (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" stroke="black" />
                </Svg>
              )}
              <Text>&nbsp;&nbsp;Married</Text>
            </View>
          </View>
        </View>

        <View style={[styles.lineContainer, styles.borderTop, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5, { padding: '4 8 0 5' }]}>
            <Text>17. RESIDENTIAL ADDRESS</Text>
          </View>

          <View
            style={[
              styles.inputValue,
              styles.w73_5,
              {
                padding: '4 8',
                textAlign: 'center',
                flexDirection: 'row',
              },
            ]}
          >
            <Text style={[styles.w50]}>{residentialAddress.houseNumber || 'N/A'}</Text>
            <Text style={[styles.w50]}>{residentialAddress.street || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Line 18 */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}></View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { flexDirection: 'row', padding: '0 8' }]}>
            <View style={{ flexDirection: 'row' }}>
              {personalInfo.civilStatus === 'Widowed' ? (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path
                    d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z"
                    stroke="black"
                  />
                </Svg>
              ) : (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" stroke="black" />
                </Svg>
              )}
              <Text>&nbsp;&nbsp;Widowed</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
              {personalInfo.civilStatus === 'Separated' ? (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path
                    d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z"
                    stroke="black"
                  />
                </Svg>
              ) : (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" stroke="black" />
                </Svg>
              )}
              <Text>&nbsp;&nbsp;Separated</Text>
            </View>
          </View>
        </View>

        <View style={[styles.lineContainer, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5, { padding: '4 8 0 8' }]}>
            <Text></Text>
          </View>

          <View
            style={[
              styles.inputAddressKey,
              styles.w73_5,
              {
                textAlign: 'center',
                borderTop: '0.5px solid #00000063',
                flexDirection: 'row',
              },
            ]}
          >
            <Text style={[styles.w50]}>House/Block/Lot No.</Text>
            <Text style={[styles.w50]}>Street</Text>
          </View>
        </View>
      </View>

      {/* Line 19 */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}>
            <Text></Text>
          </View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { flexDirection: 'row', padding: '3 8 0 8' }]}>
            <View style={{ flexDirection: 'row' }}>
              {personalInfo.civilStatus === 'Others' ? (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path
                    d="M11 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597zm11-15v20h-20v-20h20zm2-2h-24v24h24v-24z"
                    stroke="black"
                  />
                </Svg>
              ) : (
                <Svg viewBox="0 0 24 24" width={7} height={7}>
                  <Path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" stroke="black" />
                </Svg>
              )}
              <Text>&nbsp;&nbsp;Other/s</Text>
            </View>
          </View>
        </View>

        <View style={[styles.lineContainer, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5, { padding: '4 8 0 8' }]}>
            <Text></Text>
          </View>

          <View
            style={[
              styles.borderTop,
              styles.inputValue,
              styles.w73_5,
              {
                padding: '4 8',
                textAlign: 'center',
                flexDirection: 'row',
              },
            ]}
          >
            <Text style={[styles.w50]}>{residentialAddress.subdivision || 'N/A'}</Text>
            <Text style={[styles.w50]}>{residentialAddress.barangay || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Line 20 */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7, { padding: '4 8 0 8' }]}></View>
          <View style={[styles.borderRight, styles.w59_3, { padding: '0' }]}></View>
        </View>

        <View style={[styles.lineContainer, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5, { padding: '4 8 0 8' }]}></View>

          <View
            style={[
              styles.inputAddressKey,
              styles.w73_5,
              {
                textAlign: 'center',
                borderTop: '0.5px solid #00000063',
                flexDirection: 'row',
              },
            ]}
          >
            <Text style={[styles.w50]}>Subdivision/Village</Text>
            <Text style={[styles.w50]}>Barangay</Text>
          </View>
        </View>
      </View>

      {/* Line 22 */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.borderTop, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}>
            <Text>7. HEIGHT (m)</Text>
          </View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { padding: '4 8 0 8' }]}>
            <Text>{personalInfo.height || 'N/A'}</Text>
          </View>
        </View>

        <View style={[styles.lineContainer, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5, { padding: '4 8 0 8' }]}>
            <Text></Text>
          </View>

          <View
            style={[
              styles.borderTop,
              styles.inputValue,
              styles.w73_5,
              {
                padding: '4 8',
                textAlign: 'center',
                flexDirection: 'row',
              },
            ]}
          >
            <Text style={[styles.w50]}>{residentialAddress.city || 'N/A'}</Text>
            <Text style={[styles.w50]}>{residentialAddress.province || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Line 23 */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7, { padding: '4 8 0 8' }]}></View>
          <View style={[styles.borderRight, styles.w59_3, { padding: '0' }]}></View>
        </View>

        <View style={[styles.lineContainer, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5, { padding: '4 8 0 8' }]}></View>

          <View
            style={[
              styles.inputAddressKey,
              styles.w73_5,
              {
                textAlign: 'center',
                borderTop: '0.5px solid #00000063',
                flexDirection: 'row',
              },
            ]}
          >
            <Text style={[styles.w50]}>City/Municipality</Text>
            <Text style={[styles.w50]}>Province</Text>
          </View>
        </View>
      </View>

      {/* Line 24 */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.borderTop, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}>
            <Text>8. WEIGHT (kg)</Text>
          </View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { padding: '4 8 0 8' }]}>
            <Text>{personalInfo.weight || 'N/A'}</Text>
          </View>
        </View>

        <View style={[styles.lineContainer, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5, { padding: '4 8 0 8', textAlign: 'center' }]}>
            <Text>ZIP CODE</Text>
          </View>

          <View
            style={[
              styles.borderTop,
              styles.inputValue,
              styles.w73_5,
              {
                padding: '4 8',
                textAlign: 'center',
              },
            ]}
          >
            <Text style={[styles.w100]}>{residentialAddress.zipCode || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Line 25 */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.borderTop, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}>
            <Text>9. BLOOD TYPE</Text>
          </View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { flexDirection: 'row', padding: '4 8 0 8' }]}>
            <Text>{personalInfo.bloodType || 'N/A'}</Text>
          </View>
        </View>

        <View style={[styles.lineContainer, styles.borderTop, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5, { padding: '4 8 0 5' }]}>
            <Text>18. PERMANENT ADDRESS</Text>
          </View>

          <View
            style={[
              styles.inputValue,
              styles.w73_5,
              {
                padding: '4 8',
                textAlign: 'center',
                flexDirection: 'row',
              },
            ]}
          >
            <Text style={[styles.w50]}>{permanentAddress.houseNumber || 'N/A'}</Text>
            <Text style={[styles.w50]}>{permanentAddress.street || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Line 26 */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}></View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { padding: '0 8' }]}></View>
        </View>

        <View style={[styles.lineContainer, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5, { padding: '4 8 0 8' }]}>
            <Text></Text>
          </View>

          <View
            style={[
              styles.inputAddressKey,
              styles.w73_5,
              {
                textAlign: 'center',
                borderTop: '0.5px solid #00000063',
                flexDirection: 'row',
              },
            ]}
          >
            <Text style={[styles.w50]}>House/Block/Lot No.</Text>
            <Text style={[styles.w50]}>Street</Text>
          </View>
        </View>
      </View>

      {/* Line 27 */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.borderTop, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}>
            <Text>10. GSIS ID NO.</Text>
          </View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { flexDirection: 'row', padding: '4 8 0 8' }]}>
            <Text>{governmentIssuedIds.gsisNumber || 'N/A'}</Text>
          </View>
        </View>

        <View style={[styles.lineContainer, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5, { padding: '4 8 0 8' }]}>
            <Text></Text>
          </View>

          <View
            style={[
              styles.borderTop,
              styles.inputValue,
              styles.w73_5,
              {
                padding: '4 8',
                textAlign: 'center',
                flexDirection: 'row',
              },
            ]}
          >
            <Text style={[styles.w50]}>{permanentAddress.subdivision || 'N/A'}</Text>
            <Text style={[styles.w50]}>{permanentAddress.barangay || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Line 28 */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}></View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { padding: '0 8' }]}></View>
        </View>

        <View style={[styles.lineContainer, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5, { padding: '4 8 0 8' }]}>
            <Text></Text>
          </View>

          <View
            style={[
              styles.inputAddressKey,
              styles.w73_5,
              {
                textAlign: 'center',
                borderTop: '0.5px solid #00000063',
                flexDirection: 'row',
              },
            ]}
          >
            <Text style={[styles.w50]}>Subdivision/Village</Text>
            <Text style={[styles.w50]}>Barangay</Text>
          </View>
        </View>
      </View>

      {/* Line 29 */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.borderTop, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}>
            <Text>11. PAG-IBIG ID NO.</Text>
          </View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { flexDirection: 'row', padding: '4 8 0 8' }]}>
            <Text>{governmentIssuedIds.pagibigNumber || 'N/A'}</Text>
          </View>
        </View>

        <View style={[styles.lineContainer, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5, { padding: '4 8 0 8' }]}>
            <Text></Text>
          </View>

          <View
            style={[
              styles.borderTop,
              styles.inputValue,
              styles.w73_5,
              {
                padding: '4 8',
                textAlign: 'center',
                flexDirection: 'row',
              },
            ]}
          >
            <Text style={[styles.w50]}>{permanentAddress.city || 'N/A'}</Text>
            <Text style={[styles.w50]}>{permanentAddress.province || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Line 30 */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}></View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { padding: '0 8' }]}></View>
        </View>

        <View style={[styles.lineContainer, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5, { padding: '4 8 0 8' }]}>
            <Text></Text>
          </View>

          <View
            style={[
              styles.inputAddressKey,
              styles.w73_5,
              {
                textAlign: 'center',
                borderTop: '0.5px solid #00000063',
                flexDirection: 'row',
              },
            ]}
          >
            <Text style={[styles.w50]}>City/Municipality</Text>
            <Text style={[styles.w50]}>Province</Text>
          </View>
        </View>
      </View>

      {/* Line 31 */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.borderTop, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}>
            <Text>12. PHILHEALTH NO.</Text>
          </View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { padding: '4 8 0 8' }]}>
            <Text>{governmentIssuedIds.philhealthNumber || 'N/A'}</Text>
          </View>
        </View>

        <View style={[styles.lineContainer, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5, { padding: '4 8 0 8', textAlign: 'center' }]}>
            <Text>ZIP CODE</Text>
          </View>

          <View
            style={[
              styles.borderTop,
              styles.inputValue,
              styles.w73_5,
              {
                padding: '4 8',
                textAlign: 'center',
              },
            ]}
          >
            <Text style={[styles.w100]}>{permanentAddress.zipCode || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Line 32 */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.borderTop, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}>
            <Text>13. SSS NO.</Text>
          </View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { padding: '4 8' }]}>
            <Text>{governmentIssuedIds.sssNumber || 'N/A'}</Text>
          </View>
        </View>

        <View style={[styles.lineContainer, styles.borderTop, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5]}>
            <Text>19. TELEPHONE NO.</Text>
          </View>

          <View style={[styles.inputValue, styles.w73_5, { padding: '4 8' }]}>
            <Text style={[styles.w100]}>{personalInfo.telephoneNumber || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Line 33 */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.borderTop, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}>
            <Text>14. TIN NO.</Text>
          </View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { padding: '4 8' }]}>
            <Text>{governmentIssuedIds.tinNumber || 'N/A'}</Text>
          </View>
        </View>

        <View style={[styles.lineContainer, styles.borderTop, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5]}>
            <Text>20. MOBILE NO.</Text>
          </View>

          <View style={[styles.inputValue, styles.w73_5, { padding: '4 8' }]}>
            <Text style={[styles.w100]}>{personalInfo.mobileNumber || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Line 34 */}
      <View style={styles.lineContainer}>
        <View style={[styles.lineContainer, styles.borderTop, styles.w42]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w40_7]}>
            <Text>15. AGENCY EMPLOYEE NO.</Text>
          </View>

          <View style={[styles.borderRight, styles.inputValue, styles.w59_3, { padding: '4 8' }]}>
            <Text>{governmentIssuedIds.agencyNumber || 'N/A'}</Text>
          </View>
        </View>

        <View style={[styles.lineContainer, styles.borderTop, styles.w58]}>
          <View style={[styles.borderRight, styles.inputKey, styles.w26_5]}>
            <Text>21. E-MAIL ADDRESS (if any)</Text>
          </View>

          <View style={[styles.inputValue, styles.w73_5, { padding: '4 8' }]}>
            <Text style={[styles.w100]}>{personalInfo.email || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default PersonalInformationPdf
