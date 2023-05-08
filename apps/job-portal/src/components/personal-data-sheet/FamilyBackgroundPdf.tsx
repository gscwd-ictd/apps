import React, { useState } from 'react'
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { Spouse, Parent, Child } from '../../types/data/family.type'

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
  warningText: {
    fontFamily: 'ArialNarrowBoldItalic',
    textAlign: 'center',
    fontSize: 6.7,
    color: 'red',
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
  w70_1: { width: '70.1%' },
  w65: { width: '65%' },
  w57_6: { width: '57.6%' },
  w43_4: { width: '43.4%' },
  w42_9: { width: '42.9%' },
  w35: { width: '35%' },
  w29_9: { width: '29.9%' },
  w26_7: { width: '26.7%' },
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

type FamilyBackgroundPdfProps = {
  formatDate: any
  parents: Parent
  spouse: Spouse
  children: Array<Child>
}

export const FamilyBackgroundPdf = ({ formatDate, parents, spouse, children }: FamilyBackgroundPdfProps): JSX.Element => {
  const [emptyChildRows, setEmptyChildRows] = useState(12)

  const renderChildrenRows = () => {
    var content = children.slice(0, 12).map((child, index) => (
      <View style={[styles.borderTop, { flexDirection: 'row' }]} key={index}>
        <View style={[styles.borderRight, styles.inputValue, styles.w65]}>
          <Text>{child.childName}</Text>
        </View>

        <View style={[styles.inputValue, styles.w35]}>
          <Text style={{ textAlign: 'center' }}>{formatDate(child.birthDate)}</Text>
        </View>
      </View>
    ))

    return content
  }

  const renderEmptyChildrenRows = () => {
    let content = []
    const rowToRender = emptyChildRows - children.length

    for (let i = 0; i < rowToRender; i++) {
      content.push(
        <View style={[styles.borderTop, { flexDirection: 'row' }]} key={i}>
          <View style={[styles.borderRight, styles.inputValue, styles.w65]}>
            <Text style={{ textAlign: 'center' }}>N/A</Text>
          </View>

          <View style={[styles.inputValue, styles.w35]}>
            <Text style={{ textAlign: 'center' }}>N/A</Text>
          </View>
        </View>
      )
    }
    return content
  }

  return (
    <View>
      <View style={[styles.sectionTitleContainer, styles.borderTop]}>
        <Text style={styles.sectionTitleText}>II. FAMILY BACKGROUND</Text>
      </View>

      <View style={[styles.borderTop, { flexDirection: 'row', alignItems: 'stretch' }]}>
        <View style={[styles.w57_6]}>
          {/* Line 36 Spouse Surname */}
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.borderRight, styles.inputKey, styles.w29_9]}>
              <Text>22. SPOUSE&#39;S SURNAME</Text>
            </View>

            <View style={[styles.borderRight, styles.inputValue, styles.w70_1, { padding: '4 8' }]}>
              <Text>{spouse.lastName || 'N/A'}</Text>
            </View>
          </View>

          {/* Line 37 Spouse First Name */}
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.borderRight, styles.inputKey, styles.w29_9]}>
              <Text>&nbsp;&nbsp;&nbsp;&nbsp;FIRST NAME</Text>
            </View>

            <View style={[styles.borderRight, styles.borderTop, styles.inputValue, styles.w43_4, { padding: '4 8' }]}>
              <Text>{spouse.firstName || 'N/A'}</Text>
            </View>

            <View
              style={[
                styles.borderRight,
                styles.borderTop,
                styles.inputKey,
                styles.w26_7,
                {
                  padding: 1,
                  fontSize: 5.7,
                  flexDirection: 'row',
                },
              ]}
            >
              <Text>NAME EXTENSION (JR., SR)</Text>
              <Text style={{ padding: '3 8', fontSize: 5.7 }}>{spouse.nameExtension || 'N/A'}</Text>
            </View>
          </View>

          {/* Line 38 Spouse Middle Name */}
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.borderRight, styles.inputKey, styles.w29_9]}>
              <Text>&nbsp;&nbsp;&nbsp;&nbsp;MIDDLE NAME</Text>
            </View>

            <View style={[styles.borderTop, styles.borderRight, styles.inputValue, styles.w70_1, { padding: '4 8' }]}>
              <Text>{spouse.middleName || 'N/A'}</Text>
            </View>
          </View>

          {/* Line 39 Spouse Occupation */}
          <View style={[styles.borderTop, { flexDirection: 'row' }]}>
            <View style={[styles.borderRight, styles.inputKey, styles.w29_9]}>
              <Text>&nbsp;&nbsp;&nbsp;&nbsp;OCCUPATION</Text>
            </View>

            <View style={[styles.borderRight, styles.inputValue, styles.w70_1, { padding: '4 8' }]}>
              <Text>{spouse.occupation || 'N/A'}</Text>
            </View>
          </View>

          {/* Line 40 Spouse Business name */}
          <View style={[styles.borderTop, { flexDirection: 'row' }]}>
            <View style={[styles.borderRight, styles.inputKey, styles.w29_9]}>
              <Text>&nbsp;&nbsp;&nbsp;&nbsp;EMPLOYER/BUSINESS NAME</Text>
            </View>

            <View style={[styles.borderRight, styles.inputValue, styles.w70_1, { padding: '4 8' }]}>
              <Text>{spouse.employer || 'N/A'}</Text>
            </View>
          </View>

          {/* Line 41 Spouse Business address */}
          <View style={[styles.borderTop, { flexDirection: 'row' }]}>
            <View style={[styles.borderRight, styles.inputKey, styles.w29_9]}>
              <Text>&nbsp;&nbsp;&nbsp;&nbsp;BUSINESS ADDRESS</Text>
            </View>

            <View style={[styles.borderRight, styles.inputValue, styles.w70_1, { padding: '4 8' }]}>
              <Text>{spouse.businessAddress || 'N/A'}</Text>
            </View>
          </View>

          {/* Line 42 Spouse Business telephone no. */}
          <View style={[styles.borderTop, { flexDirection: 'row' }]}>
            <View style={[styles.borderRight, styles.inputKey, styles.w29_9]}>
              <Text>&nbsp;&nbsp;&nbsp;&nbsp;TELEPHONE NO.</Text>
            </View>

            <View style={[styles.borderRight, styles.inputValue, styles.w70_1, { padding: '4 8' }]}>
              <Text>{spouse.telephoneNumber || 'N/A'}</Text>
            </View>
          </View>

          {/* Line 43 Father Surname */}
          <View style={[styles.borderTop, { flexDirection: 'row' }]}>
            <View style={[styles.borderRight, styles.inputKey, styles.w29_9]}>
              <Text>24. FATHER&#39;S SURNAME</Text>
            </View>

            <View style={[styles.borderRight, styles.inputValue, styles.w70_1, { padding: '4 8' }]}>
              <Text>{parents.fatherLastName || 'N/A'}</Text>
            </View>
          </View>

          {/* Line 44 Father First Name */}
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.borderRight, styles.inputKey, styles.w29_9]}>
              <Text>&nbsp;&nbsp;&nbsp;&nbsp;FIRST NAME</Text>
            </View>

            <View style={[styles.borderRight, styles.borderTop, styles.inputValue, styles.w43_4, { padding: '4 8' }]}>
              <Text>{parents.fatherFirstName || 'N/A'}</Text>
            </View>

            <View
              style={[
                styles.borderRight,
                styles.borderTop,
                styles.inputKey,
                styles.w26_7,
                {
                  padding: 1,
                  fontSize: 5.7,
                  flexDirection: 'row',
                },
              ]}
            >
              <Text>NAME EXTENSION (JR., SR)</Text>
              <Text style={{ padding: '3 8', fontSize: 5.7 }}>{parents.fatherNameExtension || 'N/A'}</Text>
            </View>
          </View>

          {/* Line 45 Father Middle Name */}
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.borderRight, styles.inputKey, styles.w29_9]}>
              <Text>&nbsp;&nbsp;&nbsp;&nbsp;MIDDLE NAME</Text>
            </View>

            <View style={[styles.borderTop, styles.borderRight, styles.inputValue, styles.w70_1, { padding: '4 8' }]}>
              <Text>{parents.fatherMiddleName || 'N/A'}</Text>
            </View>
          </View>

          {/* Line 46 Mother's Maiden Name  */}
          <View style={[styles.borderTop, { flexDirection: 'row' }]}>
            <View style={[styles.borderRight, styles.inputKey, styles.w29_9]}>
              <Text>25. MOTHER&#39;S MAIDEN NAME</Text>
            </View>

            <View style={[styles.borderRight, styles.inputValue, styles.w70_1, { padding: '4 8' }]}>
              <Text>{parents.motherMaidenName || 'N/A'}</Text>
            </View>
          </View>

          {/* Line 47 Mother Surname */}
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.borderRight, styles.inputKey, styles.w29_9]}>
              <Text>&nbsp;&nbsp;&nbsp;&nbsp;SURNAME</Text>
            </View>

            <View style={[styles.borderTop, styles.borderRight, styles.inputValue, styles.w70_1, { padding: '4 8' }]}>
              <Text>{parents.motherLastName || 'N/A'}</Text>
            </View>
          </View>

          {/* Line 48 Mother First Name */}
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.borderRight, styles.inputKey, styles.w29_9]}>
              <Text>&nbsp;&nbsp;&nbsp;&nbsp;FIRST NAME</Text>
            </View>

            <View style={[styles.borderTop, styles.borderRight, styles.inputValue, styles.w70_1, { padding: '4 8' }]}>
              <Text>{parents.motherFirstName || 'N/A'}</Text>
            </View>
          </View>

          {/* Line 49 Mother Middle Name */}
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.borderRight, styles.inputKey, styles.w29_9]}>
              <Text>&nbsp;&nbsp;&nbsp;&nbsp;MIDDLE NAME</Text>
            </View>

            <View style={[styles.borderTop, styles.borderRight, styles.inputValue, styles.w70_1, { padding: '4 8' }]}>
              <Text>{parents.motherMiddleName || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* No. 23 Children */}
        <View style={[styles.w42_9]}>
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.borderRight, styles.inputKey, styles.w65]}>
              <Text>23. NAME of CHILDREN (Write full name and list all)</Text>
            </View>

            <View style={[styles.inputKey, styles.w35]}>
              <Text>DATE OF BIRTH (mm/dd/yyyy)</Text>
            </View>
          </View>

          {renderChildrenRows()}

          {children.length < 12 ? <>{renderEmptyChildrenRows()}</> : null}

          <View style={[styles.borderTop]}>
            <View style={[styles.inputKey, styles.w100]}>
              <Text style={styles.warningText}>(Continue on separate sheet if necessary)</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default FamilyBackgroundPdf
