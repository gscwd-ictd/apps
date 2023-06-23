import { useForm } from 'react-hook-form'
import { Applicant, useApplicantStore } from '../../../store/applicant.store'
import { usePageStore } from '../../../store/page.store'
import { Button } from '../../modular/buttons/Button'
import { CardContainer } from '../../modular/cards/CardContainer'
import { InputReactForm } from '../../modular/inputs/InputReactForm'

export const DetailsForm = () => {
  const applicant = useApplicantStore((state) => state.applicant)
  const isLoading = usePageStore((state) => state.isLoading)
  const setApplicant = useApplicantStore((state) => state.setApplicant)
  const setIsLoading = usePageStore((state) => state.setIsLoading)

  const handleSubmit = () => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const {
    register,
    formState: { errors },
  } = useForm<Applicant>()
  return (
    <>
      <div className="">
        <div className="inline-block min-w-full align-middle font-sans">
          <CardContainer
            bgColor="bg-white"
            className="rounded-xl shadow ring-1 ring-black ring-opacity-5 "
            remarks=""
            subtitle=""
            title={''}
            subtitleClassName="w-full item-center flex justify-start items-center place-items-center italic"
          >
            <>
              <div className="flex w-full grid-cols-2 px-2">
                <div className="w-[35%] rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600">
                  <div className="h-full w-full justify-center px-6 py-4 text-left align-middle font-medium text-white">
                    <div className="mt-12 w-full px-1 text-xl uppercase">
                      <div>General</div>
                      <div>Santos</div>
                      <div>City</div>
                      <div className="mt-5">Water</div>
                      <div>District</div>
                    </div>
                    <div className="pt-[60%] text-2xl font-bold text-white">Start your journey with us.</div>
                  </div>
                </div>

                <div className="mt-10 w-[65%] px-12">
                  <div className="mb-10 flex w-full justify-start text-2xl font-semibold">Applicant Information</div>

                  <div className="mb-5 w-full">
                    <InputReactForm
                      id="firstName"
                      type="text"
                      controller={{
                        ...register('firstName', {
                          value: applicant.firstName,
                          onChange: (e) =>
                            setApplicant({
                              ...applicant,
                              firstName: e.target.value,
                            }),
                        }),
                      }}
                      isError={errors.firstName ? true : false}
                      errorMessage={errors.firstName?.message}
                      name="firstName"
                      label="First Name"
                      withLabel
                      placeholder=""
                      className="placeholder:text-sm placeholder:text-gray-600"
                    />
                  </div>

                  <div className="mb-5 w-full">
                    <InputReactForm
                      id="middleName"
                      type="text"
                      controller={{
                        ...register('middleName', {
                          value: applicant.middleName,
                          onChange: (e) =>
                            setApplicant({
                              ...applicant,
                              middleName: e.target.value,
                            }),
                        }),
                      }}
                      isError={errors.middleName ? true : false}
                      errorMessage={errors.middleName?.message}
                      name="middleName"
                      label="Middle Name"
                      withLabel
                      className="placeholder:text-sm placeholder:text-gray-600"
                    />
                  </div>

                  <div className="mb-5 w-full ">
                    <InputReactForm
                      id="lastName"
                      type="text"
                      placeholder=""
                      label="Last Name"
                      withLabel
                      controller={{
                        ...register('lastName', {
                          value: applicant.lastName,
                          onChange: (e) =>
                            setApplicant({
                              ...applicant,
                              lastName: e.target.value,
                            }),
                        }),
                      }}
                      isError={errors.lastName ? true : false}
                      errorMessage={errors.lastName?.message}
                      name="lastName"
                      className="placeholder:text-sm placeholder:text-gray-600"
                    />
                  </div>

                  <div className="mb-5 w-full">
                    <InputReactForm
                      id="nameExtension"
                      label="Name Extension / Suffix"
                      withLabel
                      type="text"
                      controller={{
                        ...register('nameExtension', {
                          value: applicant.nameExtension,
                          onChange: (e) =>
                            setApplicant({
                              ...applicant,
                              nameExtension: e.target.value,
                            }),
                        }),
                      }}
                      isError={errors.nameExtension ? true : false}
                      errorMessage={errors.nameExtension?.message}
                      name="nameExtension"
                      className="placeholder:text-sm placeholder:text-gray-600"
                    />
                  </div>

                  <div className="mb-5 w-full">
                    <InputReactForm
                      id="email"
                      label="Email"
                      withLabel
                      type="text"
                      controller={{
                        ...register('email', {
                          value: applicant.email,
                          onChange: (e) =>
                            setApplicant({
                              ...applicant,
                              email: e.target.value,
                            }),
                        }),
                      }}
                      isError={errors.email ? true : false}
                      errorMessage={errors.email?.message}
                      name="emailAddress"
                      className="placeholder:text-sm placeholder:text-gray-600"
                    />
                  </div>
                  {/* 
                                    <div className="w-full gap-4 mb-5">
                                        <input id='terms' type="checkbox" className="mr-2 rounded"></input>
                                        <label htmlFor="terms" className="text-xs font-light"> By clicking here, I state that I have read and understood the terms and conditions.</label>
                                    </div> */}
                  <div className="mb-16 w-[8rem]">
                    <Button fluid variant="secondary" btnLabel="Submit" />
                  </div>
                </div>
              </div>
            </>
          </CardContainer>
        </div>
      </div>
    </>
  )
}
