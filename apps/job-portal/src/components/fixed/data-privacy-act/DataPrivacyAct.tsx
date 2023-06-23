import { useEffect } from 'react'
import { useJobOpeningsStore } from '../../../store/job-openings.store'

/* eslint-disable react/no-unescaped-entities */

export const DataPrivacyAct = () => {
  const checkboxTerms = useJobOpeningsStore((state) => state.checkboxTerms)

  const setCheckboxTerms = useJobOpeningsStore((state) => state.setCheckboxTerms)

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="h-[44rem] overflow-y-scroll  rounded px-[2%] text-justify text-base font-normal leading-6">
        <div className="mt-5 flex h-[4rem] w-full items-center justify-center bg-indigo-500 text-center text-2xl font-medium text-white">
          DATA PRIVACY AGREEMENT FORM
        </div>
        <br />
        By accepting this Data Privacy Agreement Form, I (as “Data Subject”) grant my free, voluntary, and unconditional consent to the
        collection and processing of all Personal Data (as defined below), and account or transaction information or records (collectively,
        the "Information") relating to me disclosed/transmitted by me in person or by my authorized representative/s to the information
        database system of the General Santos City Water District (GSCWD) (the “Agency”) and/or any of its authorized agent/s or
        representative/s as Information controller, by whatever means in accordance with Republic Act (R.A.) 10173, otherwise known as the
        “Data Privacy Act of 2012” of the Republic of the Philippines, including its Implementing Rules and Regulations (IRR) as well as all
        other guidelines and issuances by the National Privacy Commission (NPC).
        <br />
        <br />
        I understand that my “Personal Data” means any information obtained in the Agency’s “Services” (Website and Web Applications):
        <br />
        <div className="pl-10">
          a) from which the identity of an individual is apparent or can be reasonably and directly ascertained by the entity holding the
          information, or when put together with other information would directly and certainly identify an individual,
        </div>
        <div className="pl-10">
          b) about an individual’s marital status, age, sex, health, education, race, ethnic origin, and religious and/or political
          affiliations,
        </div>
        <div className="pl-10">
          c) referring to any proceeding for any offense committed or alleged to have been committed by such individual, the disposal of
          such proceedings, or the sentence of any court in such proceedings, and
        </div>
        <div className="pl-10">
          d) issued by government agencies peculiar to an individual which includes, but is not limited to, social security numbers and
          licenses.
        </div>
        <br />
        I understand, further, that General Santos City Water District (GSCWD) shall keep the Personal Data and Information of the
        transactions I do with GSCWD’s Services in strict confidence, and that the collection and processing of all Personal Data and/or
        Information by GSCWD may be used for any of the following purposes (collectively, the “Purposes”):
        <br />
        <div className="pl-10">
          a) to provide, operate and maintain the Services, including contacting the Data Subject by email, telephone calls, SMS, or other
          equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative
          communications related to the functionalities or contracted services, including the security updates, when necessary or reasonable
          for the implementation;
        </div>
        <div className="pl-10">
          b) to manage the registration of the Data Subject as a user in the Services. Personal Data is the basis for access to different
          functionalities of the Services that are available as a registered user;
        </div>
        <div className="pl-10">
          c) to monitor and record calls and electronic communications with Data Subject/s and Related Person/s for record-keeping, quality
          assurance, customer service, training, investigation, litigation, crime and fraud prevention purposes;
        </div>
        <div className="pl-10">
          d) to perform internal management and management reporting, to operate control and management information systems, and to carry
          out business risk, control or compliance review or testing, internal audits, or enable the conduct of external audits;
        </div>
        <div className="pl-10">e) any other transactions and/or purposes analogous or relating directly thereto.</div>
        <br />
        At the same time, I agree that the Information shall be retained by GSCWD for as long as necessary for the fulfillment of any of the
        aforementioned Purposes, and shall continue to be retained for a period of two (2) years notwithstanding the termination of any of
        the above Purposes.
        <br />
        <br />
        Further, I understand that, with respect to my submission, collection, and processing of the Personal Data of Related Person/s, it
        is my duty and responsibility:
        <div className="pl-10">
          a) to inform said Related Person/s of the Purpose/s for which his/their Personal Data have been submitted, collected, and
          processed by GSCWD,
        </div>
        <div className="pl-10">
          b) to obtain consent from the said Related Person/s for the collection and processing of his/their Personal Data/Information in
          accordance with the Data Privacy Act of 2012, and
        </div>
        <div className="pl-10">c) to inform GSCWD that such consent from said Related Person/s have been obtained.</div>
        <br />
        I hereby acknowledge that I have been provided with the notification below on my rights as a Data Subject (each, a “Right”,
        collectively, the “Rights”) in accordance with the Data Privacy Act of 2012, to wit:
        <br />
        <div className="pl-10">a) to be informed whether Information and/or Personal Data is being or has been processed.</div>
        <div className="pl-10">
          b) to require GSCWD to correct any Information and/or Personal Data relating to the Data Subject which is inaccurate;
        </div>
        <div className="pl-10">
          c) to object to the processing of the Information and/or Personal Data in case of changes or amendments to the Information and/or
          Personal Data supplied or declared to the Data Subject;
        </div>
        <div className="pl-10">d) to access the Information and/or Personal Data;</div>
        <div className="pl-10">
          e) to suspend, withdraw or order the blocking, removal, or destruction of the Data Subject's Personal Data from GSCWD's
          information database system.
        </div>
        <br />
        <hr className="border border-gray-600/90" />
        <br />I acknowledge, further, that if I were to exercise any of the Rights enumerated above, GSCWD reserves its right to re-evaluate
        and/or terminate its business with me as well as any of the Purposes for which the Information and/or Personal Data has been
        collected and processed.
        <br />
        <br />
        <div className=" flex w-full items-center gap-2">
          <input
            id="agreeToTerms"
            type="checkbox"
            checked={checkboxTerms ? true : false}
            onChange={() => setCheckboxTerms(!checkboxTerms)}
          />
          <label htmlFor="agreeToTerms">
            <p>
              I have read and understood the above and hereby consent to, agree on, accept and acknowledge these terms of consent for
              myself.
            </p>
          </label>
        </div>
      </div>
    </div>
  )
}
