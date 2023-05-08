import React, { useState } from 'react'
import { Text, View, StyleSheet, Font, Svg, Path } from '@react-pdf/renderer'
import {
  OfficeRelation,
  GuiltyCharged,
  Convicted,
  SeparatedService,
  CandidateResigned,
  Immigrant,
  IndigenousPwdSoloParent,
  Reference,
  GovernmentIssuedId,
} from '../../types/data/supporting-info.type'

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
  },
  grayBg: {
    backgroundColor: '#EAEAEA',
  },
  bodyBorder: {
    margin: 5,
    border: '1px solid #000000',
  },
  bodyBorderForSignature: {
    margin: '5 0 5 5',
    border: '1px solid #000000',
  },
  bodyBorderForId: {
    margin: '10 18 0 18',
    border: '1.5px solid #000000',
  },
  bodyBorderForThumbMark: {
    margin: '5 10 10 10',
    border: '1px solid #000000',
  },
  bodyBorderForPAO: {
    margin: '0 10 10 10',
    border: '1px solid #000000',
  },

  // Field Styles
  inputQuestions: {
    backgroundColor: '#EAEAEA',
    fontFamily: 'ArialNarrow',
    fontSize: 8.5,
    padding: '3.5 5',
  },
  inputAnswers: {
    fontFamily: 'ArialNarrow',
    fontSize: 8.5,
    padding: '3.5 5',
  },
  warningText: {
    fontFamily: 'ArialNarrow',
    fontSize: 6.5,
    color: 'red',
  },
  detailsField: {
    borderBottom: '0.5 solid #000000',
    padding: '1 5 2 5',
    textAlign: 'center',
  },
  iDText: {
    fontFamily: 'ArialRegular',
    fontSize: 7,
    textAlign: 'center',
    padding: '5 18',
  },
  photoText: {
    fontFamily: 'ArialNarrow',
    fontSize: 7.5,
    paddingTop: 3,
    textAlign: 'center',
    color: '#808080',
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
  borderBottom: {
    borderBottom: '1px solid #000000',
  },

  // Width Styles
  w100: { width: '100%' },
  w75: { width: '75%' },
  w65: { width: '65%' },
  w60: { width: '60%' },
  w50: { width: '50%' },
  w40: { width: '40%' },
  w35: { width: '35%' },
  w30: { width: '30%' },
  w25: { width: '25%' },
  w20: { width: '20%' },
})

Font.register({
  family: 'ArialRegular',
  src: '/assets/fonts/arial-regular.ttf',
})

Font.register({
  family: 'ArialNarrow',
  src: '/assets/fonts/arial-narrow.ttf',
})

Font.register({
  family: 'ArialNarrowItalic',
  src: '/assets/fonts/arial-narrow-italic',
})

Font.register({
  family: 'ArialNarrowBoldItalic',
  src: '/assets/fonts/arial-narrow-bold-italic.ttf',
})

Font.registerHyphenationCallback((word) => [word])

type QuestionsPdfProps = {
  formatDate: any
  officeRelation: OfficeRelation
  guiltyCharged: GuiltyCharged
  convicted: Convicted
  separatedService: SeparatedService
  candidateResigned: CandidateResigned
  immigrant: Immigrant
  indigenousPwdSoloParent: IndigenousPwdSoloParent
  references: Array<Reference>
  governmentIssuedId: GovernmentIssuedId
}

export const QuestionsPdf = ({
  formatDate,
  officeRelation,
  guiltyCharged,
  convicted,
  separatedService,
  candidateResigned,
  immigrant,
  indigenousPwdSoloParent,
  references,
  governmentIssuedId,
}: QuestionsPdfProps): JSX.Element => {
  const [emptyReferenceRows, setEmptyReferenceRows] = useState(3)

  const renderReferenceRows = () => {
    var content = references.slice(0, 3).map((reference, index) => (
      <View style={[styles.borderTop, { flexDirection: 'row' }]} key={index}>
        <View style={[styles.w50, styles.borderRight, styles.inputAnswers, { textAlign: 'center', fontSize: 8 }]}>
          <Text>{reference.name}</Text>
        </View>
        <View style={[styles.w30, styles.borderRight, styles.inputAnswers, { textAlign: 'center', fontSize: 8 }]}>
          <Text>{reference.address}</Text>
        </View>
        <View style={[styles.w20, styles.borderRight, styles.inputAnswers, { textAlign: 'center', fontSize: 8 }]}>
          <Text>{reference.telephoneNumber}</Text>
        </View>
      </View>
    ))
    return content
  }

  const renderEmptyReferenceRows = () => {
    let content = []
    const rowToRender = emptyReferenceRows - references.length

    for (let i = 0; i < rowToRender; i++) {
      content.push(
        <View style={[styles.borderTop, { flexDirection: 'row' }]} key={i}>
          <View style={[styles.w50, styles.borderRight, styles.inputAnswers, { textAlign: 'center', fontSize: 8 }]}>
            <Text>N/A</Text>
          </View>
          <View style={[styles.w30, styles.borderRight, styles.inputAnswers, { textAlign: 'center', fontSize: 8 }]}>
            <Text>N/A</Text>
          </View>
          <View style={[styles.w20, styles.borderRight, styles.inputAnswers, { textAlign: 'center', fontSize: 8 }]}>
            <Text>N/A</Text>
          </View>
        </View>
      )
    }

    return content
  }

  return (
    <View>
      {/* Question 34 */}
      <View style={[styles.rowContainer, { alignContent: 'stretch' }]}>
        {/* Questions Container */}
        <View style={[styles.borderRight, styles.w65, styles.grayBg]}>
          <View style={[styles.rowContainer, styles.inputQuestions]}>
            <Text>34.</Text>

            <View style={{ padding: '0 13 0 5' }}>
              <Text>
                Are you related by consanguinity or affinity to the appointing or recommending authority, or to the chief of bureau or
                office or to the person who has immediate supervision over you in the Office, Bureau or Department where you will be
                apppointed,
              </Text>
              <Text style={{ paddingTop: 5 }}>a. within the third degree?</Text>
              <Text style={{ paddingTop: 7 }}>b. within the fourth degree (for Local Government Unit - Career Employees)?</Text>
            </View>
          </View>
        </View>

        {/* Answer Container*/}
        <View style={[styles.w35, { paddingTop: 35 }]}>
          {/* a. */}
          <View style={[styles.rowContainer, styles.inputAnswers]}>
            <View style={{ flexDirection: 'row' }}>
              {officeRelation.withinThirdDegree ? (
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
              <Text>&nbsp;&nbsp;YES</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingLeft: 22 }}>
              {!officeRelation.withinThirdDegree ? (
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
              <Text>&nbsp;&nbsp;NO</Text>
            </View>
          </View>

          {/* b. */}
          <View style={[styles.rowContainer, styles.inputAnswers, { paddingBottom: 0 }]}>
            <View style={{ flexDirection: 'row' }}>
              {officeRelation.withinFourthDegree ? (
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
              <Text>&nbsp;&nbsp;YES</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingLeft: 22 }}>
              {!officeRelation.withinFourthDegree ? (
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
              <Text>&nbsp;&nbsp;NO</Text>
            </View>
          </View>

          {/* details */}
          <View style={[styles.inputAnswers]}>
            <Text>If YES, give details:</Text>
            <Text style={[styles.detailsField]}>{officeRelation.details || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Question 35. */}
      <View style={[styles.rowContainer, styles.borderTop, { alignContent: 'stretch' }]}>
        {/* Questions Container */}
        <View style={[styles.borderRight, styles.w65, styles.grayBg]}>
          <View style={[styles.rowContainer, styles.inputQuestions]}>
            <Text>35.</Text>

            <View style={{ padding: '0 13 0 5' }}>
              <Text>a. Have you ever been found guilty of any administrative offense?</Text>
              <Text style={{ paddingTop: 43 }}>b. Have you been criminally charged before any court?</Text>
            </View>
          </View>
        </View>

        {/* Answer Container*/}
        <View style={[styles.w35]}>
          {/* a. */}
          <View style={[{ paddingVertical: 3 }]}>
            {/* checkbox. */}
            <View style={[styles.rowContainer, styles.inputAnswers, { paddingBottom: 0 }]}>
              <View style={{ flexDirection: 'row' }}>
                {guiltyCharged.isGuilty ? (
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
                <Text>&nbsp;&nbsp;YES</Text>
              </View>

              <View style={{ flexDirection: 'row', paddingLeft: 22 }}>
                {!guiltyCharged.isGuilty ? (
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
                <Text>&nbsp;&nbsp;NO</Text>
              </View>
            </View>
            {/* details */}
            <View style={[styles.inputAnswers]}>
              <Text>If YES, give details:</Text>
              <Text style={[styles.detailsField]}>{guiltyCharged.guiltyDetails || 'N/A'}</Text>
            </View>
          </View>

          {/* b. */}
          <View style={[styles.borderTop, { paddingVertical: 3 }]}>
            {/* checkbox. */}
            <View style={[styles.rowContainer, styles.inputAnswers, { paddingBottom: 0 }]}>
              <View style={{ flexDirection: 'row' }}>
                {guiltyCharged.isCharged ? (
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
                <Text>&nbsp;&nbsp;YES</Text>
              </View>

              <View style={{ flexDirection: 'row', paddingLeft: 22 }}>
                {!guiltyCharged.isCharged ? (
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
                <Text>&nbsp;&nbsp;NO</Text>
              </View>
            </View>

            {/* details */}
            <View style={[styles.inputAnswers]}>
              <Text>If YES, give details:</Text>

              <View style={[styles.rowContainer, { paddingTop: 3 }]}>
                <Text style={{ width: '30%' }}>Date Filed:</Text>
                <Text style={[styles.detailsField, { width: '70%' }]}>{formatDate(guiltyCharged.chargedDateFiled) || 'N/A'}</Text>
              </View>

              <View style={[styles.rowContainer]}>
                <Text style={{ width: '30%' }}>Status of Case/s: </Text>
                <Text style={[styles.detailsField, { width: '70%' }]}>{guiltyCharged.chargedCaseStatus || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Question 36 */}
      <View style={[styles.rowContainer, styles.borderTop, { alignContent: 'stretch' }]}>
        {/* Questions Container */}
        <View style={[styles.borderRight, styles.w65, styles.grayBg]}>
          <View style={[styles.rowContainer, styles.inputQuestions]}>
            <Text>36.</Text>

            <View style={{ padding: '0 13 0 5' }}>
              <Text>
                Have you ever been convicted of any crime or violation of any law, decree, ordinance or regulation by any court or tribunal?
              </Text>
            </View>
          </View>
        </View>

        {/* Answer Container*/}
        <View style={[styles.w35]}>
          {/* checkbox */}
          <View style={[styles.rowContainer, styles.inputAnswers, { paddingBottom: 0 }]}>
            <View style={{ flexDirection: 'row' }}>
              {convicted.isConvicted ? (
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
              <Text>&nbsp;&nbsp;YES</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingLeft: 22 }}>
              {!convicted.isConvicted ? (
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
              <Text>&nbsp;&nbsp;NO</Text>
            </View>
          </View>

          {/* details */}
          <View style={[styles.inputAnswers]}>
            <Text>If YES, give details:</Text>
            <Text style={[styles.detailsField]}>{convicted.details || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Question 37 */}
      <View style={[styles.rowContainer, styles.borderTop, { alignContent: 'stretch' }]}>
        {/* Questions Container */}
        <View style={[styles.borderRight, styles.w65, styles.grayBg]}>
          <View style={[styles.rowContainer, styles.inputQuestions]}>
            <Text>37.</Text>

            <View style={{ padding: '0 13 0 5' }}>
              <Text>
                Have you ever been separated from the service in any of the following modes: resignation, retirement, dropped from the
                rolls, dismissal, termination, end of term, finished contract or phased out (abolition) in the public or private sector?
              </Text>
            </View>
          </View>
        </View>

        {/* Answer Container*/}
        <View style={[styles.w35]}>
          <View style={[styles.rowContainer, styles.inputAnswers, { paddingBottom: 0 }]}>
            <View style={{ flexDirection: 'row' }}>
              {separatedService.isSeparated ? (
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
              <Text>&nbsp;&nbsp;YES</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingLeft: 22 }}>
              {!separatedService.isSeparated ? (
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
              <Text>&nbsp;&nbsp;NO</Text>
            </View>
          </View>

          {/* details */}
          <View style={[styles.inputAnswers]}>
            <Text>If YES, give details:</Text>
            <Text style={[styles.detailsField]}>{separatedService.details || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Question 38 */}
      <View style={[styles.rowContainer, styles.borderTop, { alignContent: 'stretch' }]}>
        {/* Questions Container */}
        <View style={[styles.borderRight, styles.w65, styles.grayBg]}>
          <View style={[styles.rowContainer, styles.inputQuestions]}>
            <Text>38.</Text>

            <View style={{ padding: '0 13 0 5' }}>
              <Text>
                a. Have you ever been a candidate in a national or local election held within the last year (except Barangay election)?
              </Text>
              <Text style={{ paddingTop: 23 }}>
                b. Have you resigned from the government service during the three (3)-month period before the last election to
                promote/actively campaign for a national or local candidate?
              </Text>
            </View>
          </View>
        </View>

        {/* Answer Container*/}
        <View style={[styles.w35]}>
          {/* a. checkbox */}
          <View style={[styles.rowContainer, styles.inputAnswers, { paddingBottom: 0 }]}>
            <View style={{ flexDirection: 'row' }}>
              {candidateResigned.isCandidate ? (
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
              <Text>&nbsp;&nbsp;YES</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingLeft: 22 }}>
              {!candidateResigned.isCandidate ? (
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
              <Text>&nbsp;&nbsp;NO</Text>
            </View>
          </View>
          {/* a. details */}
          <View style={[styles.inputAnswers, styles.rowContainer]}>
            <Text style={{ width: '30%' }}>If YES, give details:</Text>
            <Text style={[styles.detailsField, { width: '70%' }]}>{candidateResigned.candidateDetails || 'N/A'}</Text>
          </View>

          {/* b. checkbox */}
          <View style={[styles.rowContainer, styles.inputAnswers, { paddingBottom: 0 }]}>
            <View style={{ flexDirection: 'row' }}>
              {candidateResigned.isResigned ? (
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
              <Text>&nbsp;&nbsp;YES</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingLeft: 22 }}>
              {!candidateResigned.isResigned ? (
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
              <Text>&nbsp;&nbsp;NO</Text>
            </View>
          </View>
          {/* b. details */}
          <View style={[styles.inputAnswers, styles.rowContainer]}>
            <Text style={{ width: '30%' }}>If YES, give details:</Text>
            <Text style={[styles.detailsField, { width: '70%' }]}>{candidateResigned.resignedDetails || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Question 39 */}
      <View style={[styles.rowContainer, styles.borderTop, { alignContent: 'stretch' }]}>
        {/* Questions Container */}
        <View style={[styles.borderRight, styles.w65, styles.grayBg]}>
          <View style={[styles.rowContainer, styles.inputQuestions]}>
            <Text>39.</Text>

            <View style={{ padding: '0 13 0 5' }}>
              <Text>Have you acquired the status of an immigrant or permanent resident of another country?</Text>
            </View>
          </View>
        </View>

        {/* Answer Container*/}
        <View style={[styles.w35]}>
          <View style={[styles.rowContainer, styles.inputAnswers, { paddingBottom: 0 }]}>
            <View style={{ flexDirection: 'row' }}>
              {immigrant.isImmigrant ? (
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
              <Text>&nbsp;&nbsp;YES</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingLeft: 22 }}>
              {!immigrant.isImmigrant ? (
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
              <Text>&nbsp;&nbsp;NO</Text>
            </View>
          </View>

          {/* details */}
          <View style={[styles.inputAnswers]}>
            <Text>If YES, give details (country):</Text>
            <Text style={[styles.detailsField]}>{immigrant.details || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Question 40 */}
      <View style={[styles.rowContainer, styles.borderTop, { alignContent: 'stretch' }]}>
        {/* Questions Container */}
        <View style={[styles.borderRight, styles.w65, styles.grayBg]}>
          <View style={[styles.rowContainer, styles.inputQuestions]}>
            <Text>40.</Text>

            <View style={{ padding: '0 13 0 5' }}>
              <Text>
                Pursuant to: (a) Indigenous People&apos;s Act (RA 8371); (b) Magna Carta for Disabled Persons (RA 7277); and (c) Solo
                Parents Welfare Act of 2000 (RA 8972), please answer the following items:
              </Text>
              <Text style={{ paddingTop: 8 }}>a. Are you a member of any indigenous group?</Text>
              <Text style={{ paddingTop: 22 }}>b. Are you a person with disability?</Text>
              <Text style={{ paddingTop: 20 }}>c. Are you a solo parent?</Text>
            </View>
          </View>
        </View>

        {/* Answer Container*/}
        <View style={[styles.w35, { paddingTop: 30 }]}>
          {/* a. checkbox */}
          <View style={[styles.rowContainer, styles.inputAnswers, { paddingBottom: 0 }]}>
            <View style={{ flexDirection: 'row' }}>
              {indigenousPwdSoloParent.isIndigenousMember ? (
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
              <Text>&nbsp;&nbsp;YES</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingLeft: 22 }}>
              {!indigenousPwdSoloParent.isIndigenousMember ? (
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
              <Text>&nbsp;&nbsp;NO</Text>
            </View>
          </View>
          {/* a. details */}
          <View style={[styles.inputAnswers, styles.rowContainer, { paddingTop: 0 }]}>
            <Text style={{ width: '40%' }}>If YES, please specify:</Text>
            <Text style={[styles.detailsField, { width: '60%' }]}>{indigenousPwdSoloParent.indigenousMemberDetails || 'N/A'}</Text>
          </View>

          {/* b. checkbox */}
          <View style={[styles.rowContainer, styles.inputAnswers, { paddingBottom: 0 }]}>
            <View style={{ flexDirection: 'row' }}>
              {indigenousPwdSoloParent.isPwd ? (
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
              <Text>&nbsp;&nbsp;YES</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingLeft: 22 }}>
              {!indigenousPwdSoloParent.isPwd ? (
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
              <Text>&nbsp;&nbsp;NO</Text>
            </View>
          </View>
          {/* b. details */}
          <View style={[styles.inputAnswers, styles.rowContainer, { paddingTop: 0 }]}>
            <Text style={{ width: '45%' }}>If YES, please specify ID No:</Text>
            <Text style={[styles.detailsField, { width: '55%' }]}>{indigenousPwdSoloParent.pwdIdNumber || 'N/A'}</Text>
          </View>

          {/* c. checkbox */}
          <View style={[styles.rowContainer, styles.inputAnswers, { paddingBottom: 0 }]}>
            <View style={{ flexDirection: 'row' }}>
              {indigenousPwdSoloParent.isSoloParent ? (
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
              <Text>&nbsp;&nbsp;YES</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingLeft: 22 }}>
              {!indigenousPwdSoloParent.isSoloParent ? (
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
              <Text>&nbsp;&nbsp;NO</Text>
            </View>
          </View>
          {/* c. details */}
          <View style={[styles.inputAnswers, styles.rowContainer, { paddingTop: 0 }]}>
            <Text style={{ width: '45%' }}>If YES, please specify ID No:</Text>
            <Text style={[styles.detailsField, { width: '55%' }]}>{indigenousPwdSoloParent.soloParentIdNumber || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* 41 - References */}
      <View style={[styles.borderTop, styles.borderBottom, styles.rowContainer]}>
        <View style={[styles.w75]}>
          {/* 41 - References */}
          <View style={[styles.inputQuestions, styles.borderRight, styles.grayBg, { flexDirection: 'row', fontSize: 8 }]}>
            <Text>41.</Text>
            <Text style={[{ paddingLeft: 2 }]}>REFERENCES</Text>
            <Text style={[styles.warningText, { paddingLeft: 2 }]}>
              (Person not related by consanguinity or affinity to applicant /appointee)
            </Text>
          </View>

          {/* References Header */}
          <View style={[styles.borderTop, { flexDirection: 'row' }]}>
            <View style={[styles.w50, styles.borderRight, styles.inputQuestions, { textAlign: 'center', fontSize: 8 }]}>
              <Text>NAME</Text>
            </View>
            <View style={[styles.w30, styles.borderRight, styles.inputQuestions, { textAlign: 'center', fontSize: 8 }]}>
              <Text>ADDRESS</Text>
            </View>
            <View style={[styles.w20, styles.borderRight, styles.inputQuestions, { textAlign: 'center', fontSize: 8 }]}>
              <Text>TEL NO.</Text>
            </View>
          </View>

          {renderReferenceRows()}
          {renderEmptyReferenceRows()}

          {/* 42 - oath */}
          <View
            style={[
              styles.inputQuestions,
              styles.borderRight,
              styles.borderTop,
              styles.borderBottom,
              styles.grayBg,
              { flexDirection: 'row' },
            ]}
          >
            <Text>42.</Text>
            <Text style={[{ padding: '0 18 1 5', textAlign: 'justify', lineHeight: 1.5 }]}>
              I declare under oath that I have personally accomplished this Personal Data Sheet which is a true, correct and complete
              statement pursuant to the provisions of pertinent laws, rules and regulations of the Republic of the Philippines. I authorize
              the agency head/authorized representative to verify/validate the contents stated herein. I agree that any misrepresentation
              made in this document and its attachments shall cause the filing of administrative/criminal case/s against me.
            </Text>
          </View>

          {/* Gov't Issued Id / Signature Box */}
          <View style={[styles.rowContainer, { alignItems: 'stretch' }]}>
            {/* Gov't Issued Id */}
            <View style={[styles.w50]}>
              <View style={[styles.bodyBorder]}>
                {/* Header */}
                <View style={[styles.rowContainer, styles.grayBg, { alignItems: 'stretch', padding: '3 5 0 5' }]}>
                  <Text style={[styles.inputAnswers, styles.verticalCenter, { padding: 0, fontSize: 7.9 }]}>Government Issued ID</Text>
                  <Text style={[styles.inputAnswers, styles.verticalCenter, { paddingLeft: 3, fontSize: 6 }]}>
                    (i.e.Passport, GSIS, SSS, PRC, Driver&apos;s License, etc.)
                  </Text>
                </View>

                <Text
                  style={[
                    styles.grayBg,
                    {
                      fontFamily: 'ArialNarrowItalic',
                      padding: '0 5 3 5',
                      fontSize: 7.9,
                    },
                  ]}
                >
                  PLEASE INDICATE ID Number and Date of Issuance
                </Text>

                {/* Government Issued ID: */}
                <View style={[styles.rowContainer, styles.borderTop, styles.inputAnswers, { fontSize: 7.5, padding: 5 }]}>
                  <Text style={[styles.w40]}>Government Issued ID:</Text>
                  <Text style={[styles.w60]}>{governmentIssuedId.issuedId || 'N/A'}</Text>
                </View>

                {/* ID/License/Passport No.: */}
                <View style={[styles.rowContainer, styles.borderTop, styles.inputAnswers, { fontSize: 7.5, padding: 5 }]}>
                  <Text style={[styles.w40]}>ID/License/Passport No.:</Text>
                  <Text style={[styles.w60]}>{governmentIssuedId.idNumber || 'N/A'}</Text>
                </View>

                {/* Date/Place of Issuance: */}
                <View style={[styles.rowContainer, styles.borderTop, styles.inputAnswers, { fontSize: 7.5, padding: 5 }]}>
                  <Text style={[styles.w40]}>Date/Place of Issuance:</Text>
                  <Text style={[styles.w60]}>{formatDate(governmentIssuedId.issueDate) + ' ' + governmentIssuedId.issuePlace}</Text>
                </View>
              </View>
            </View>

            {/* Signature Box */}
            <View style={[styles.w50]}>
              <View style={[styles.bodyBorderForSignature]}>
                {/* Empty Box for Signature */}
                <View style={[styles.inputAnswers]}>
                  <Text style={[{ height: 41 }]}></Text>
                </View>

                {/* Signature Text */}
                <View
                  style={[
                    styles.inputQuestions,
                    styles.borderTop,
                    styles.borderBottom,
                    { textAlign: 'center', fontSize: 7.2, padding: '2 0' },
                  ]}
                >
                  <Text>Signature (Sign inside the box)</Text>
                </View>

                {/* Empty Box for Date */}
                <View style={[styles.inputAnswers]}>
                  <Text style={[{ height: 5 }]}></Text>
                </View>

                {/* Date Accomplished */}
                <View style={[styles.inputQuestions, styles.borderTop, { textAlign: 'center', fontSize: 7.2, padding: '2 0' }]}>
                  <Text>Date Accomplished</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.w25]}>
          {/*Photo Box */}
          <View style={[styles.bodyBorderForId]}>
            <Text style={[styles.iDText, { paddingTop: 9, paddingBottom: 0 }]}>
              ID picture taken within the last 6 months 3.5 cm. X 4.5 cm
            </Text>

            <Text style={[styles.iDText, { paddingTop: 0 }]}>(passport size)</Text>

            <Text style={[styles.iDText]}>With full and handwritten name tag and signature over printed name</Text>

            <Text style={[styles.iDText, { paddingBottom: 9 }]}>Computer generated or photocopied picture is not acceptable</Text>
          </View>
          <Text style={[styles.photoText]}>PHOTO</Text>

          {/* Thumbmark */}
          <View style={[styles.bodyBorderForThumbMark]}>
            {/* Empty Box for Thumbmark */}
            <View>
              <Text style={{ height: 69.5 }}></Text>
            </View>

            {/* Thumbmark Text */}
            <View style={[styles.inputQuestions, styles.borderTop, { textAlign: 'center', fontSize: 7.2, padding: '2 0' }]}>
              <Text>Right Thumbmark</Text>
            </View>
          </View>
        </View>
      </View>

      {/* SUBSCRIBED AND SWORN */}
      <View>
        <View style={[styles.inputAnswers, { textAlign: 'center', paddingVertical: 8 }]}>
          <Text>
            {' '}
            SUBSCRIBED AND SWORN to before me this _______________________, affiant exhibiting his/her validly issued government ID as
            indicated above.
          </Text>
        </View>

        <View style={[styles.bodyBorderForPAO, { width: '35%', marginHorizontal: 'auto' }]}>
          {/* Empty Box for PAO Signature */}
          <View>
            <Text style={{ height: 50 }}></Text>
          </View>

          {/* Person Administering Oath Text */}
          <View
            style={[
              styles.inputQuestions,
              styles.borderTop,
              {
                textAlign: 'center',
                fontSize: 8,
                padding: '2 0',
              },
            ]}
          >
            <Text>Person Administering Oath</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default QuestionsPdf
