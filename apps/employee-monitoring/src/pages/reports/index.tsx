import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { Navigate } from '../../components/router/navigate';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Reports } from '../../utils/enum/reports.enum';
import { Report } from 'apps/employee-monitoring/src/utils/types/report.type';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card } from '../../components/cards/Card';
import { BreadCrumbs } from '../../components/navigations/BreadCrumbs';
import { Button } from '@gscwd-apps/oneui';
import { SelectListRF } from '../../components/inputs/SelectListRF';
import { LabelInput } from '../../components/inputs/LabelInput';
import ConvertFullMonthNameToDigit from '../../utils/functions/ConvertFullMonthNameToDigit';
import ConvertToYearMonth from '../../utils/functions/ConvertToYearMonth';
import { useEffect } from 'react';

// yup error handling initialization
const yupSchema = yup.object().shape({
  reportName: yup.string().required('Select a type of report'),
  dateFrom: yup
    .date()
    .max(new Date(), 'Must not be greater than current date')
    .when('reportName', {
      is: (report: string) => {
        // Report on Attendance
        if (report === Reports[0].value) {
          return true;
        }

        // Report on Personal Business Pass Slip
        if (report === Reports[1].value) {
          return true;
        }

        // Report on Official Business Pass Slip
        if (report === Reports[2].value) {
          return true;
        }

        // Detailed Report on Personal Business Pass Slip
        if (report === Reports[3].value) {
          return true;
        }

        // Detailed Report on Official Business Pass Slip
        if (report === Reports[4].value) {
          return true;
        } else return false;
      },
      then: yup.date().required('Starting date is required').nullable(),
    })
    .nullable(),
  dateTo: yup
    .date()
    .max(new Date(), 'Must not be greater than current date')
    .when('reportName', {
      is: (report: string) => {
        // Report on Attendance
        if (report === Reports[0].value) {
          return true;
        }

        // Report on Personal Business Pass Slip
        if (report === Reports[1].value) {
          return true;
        }

        // Report on Official Business Pass Slip
        if (report === Reports[2].value) {
          return true;
        }

        // Detailed Report on Personal Business Pass Slip
        if (report === Reports[3].value) {
          return true;
        }

        // Detailed Report on Official Business Pass Slip
        if (report === Reports[4].value) {
          return true;
        } else return false;
      },
      then: yup.date().required('Ending date is required').nullable(),
    })
    .nullable(),
  monthYear: yup
    .date()
    .max(new Date(), 'Must not be greater than current date')
    .when('reportName', {
      is: (report: string) => {
        // Report on Employee Forced Leave Credits
        if (report === Reports[5].value) {
          return true;
        }

        // Report on Employee Leave Credit Balance
        if (report === Reports[6].value) {
          return true;
        }

        // Report on Employee Leave Credit Balance with Money
        if (report === Reports[7].value) {
          return true;
        }

        // Report on Summary of Leave Without Pay
        if (report === Reports[8].value) {
          return true;
        } else return false;
      },
      then: yup.date().required('Month year is required').nullable(),
    })
    .nullable(),
});

export default function Index() {
  // React hook form
  const {
    reset,
    register,
    unregister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Report>({
    mode: 'onChange',
    defaultValues: {
      reportName: '',
      dateFrom: null,
      dateTo: null,
      monthYear: null,
    },
    resolver: yupResolver(yupSchema),
  });

  const watchReportName = watch('reportName');

  // form submission
  const onSubmit: SubmitHandler<Report> = (data: Report) => {
    const url = `${window.location}/${replaceSpaceToDash(data.reportName)}?reportName=${data.reportName}`;

    const paramToFrom = `&date_from=${ConvertFullMonthNameToDigit(data.dateFrom)}&date_to=${ConvertFullMonthNameToDigit(
      data.dateTo
    )}`;
    const paramMonthYear = `&month_year=${ConvertToYearMonth(data.monthYear)}`;

    // condition if param needs to be month & year OR date to & date from
    if (
      data.reportName === Reports[5].value ||
      data.reportName === Reports[6].value ||
      data.reportName === Reports[7].value ||
      data.reportName === Reports[8].value
    ) {
      window.open(url + paramMonthYear, '_blank', 'noopener,noreferrer');
      reset();
    } else {
      window.open(url + paramToFrom, '_blank', 'noopener,noreferrer');
      reset();
    }
  };

  // Replace space with dash for URL on redirect
  const replaceSpaceToDash = (reportName: string) => {
    if (reportName != null && reportName.length > 0) {
      return reportName.replace(/ /g, '-');
    }
  };

  useEffect(() => {
    if (
      watchReportName === Reports[5].value ||
      watchReportName === Reports[6].value ||
      watchReportName === Reports[7].value ||
      watchReportName === Reports[8].value
    ) {
      register('monthYear');

      unregister('dateFrom');
      unregister('dateTo');
    } else {
      unregister('monthYear');

      register('dateFrom');
      register('dateTo');
    }
  }, [register, unregister, watchReportName]);

  return (
    <>
      <Can I="access" this="Reports">
        <div className="">
          <BreadCrumbs
            title="Reports"
            crumbs={[
              {
                layerNo: 1,
                layerText: 'Reports',
                path: '',
              },
            ]}
          />

          <div className="sm:px-2 md:px-2 lg:px-5">
            <Card>
              <form onSubmit={handleSubmit(onSubmit)} id="submitReportForm">
                <div className="grid gap-2">
                  {/* Report select input */}
                  <div>
                    <SelectListRF
                      id="reportName"
                      selectList={Reports}
                      controller={{
                        ...register('reportName'),
                      }}
                      label="Report name"
                      isError={errors.reportName ? true : false}
                      errorMessage={errors.reportName?.message}
                    />
                  </div>

                  {watchReportName === Reports[5].value ||
                  watchReportName === Reports[6].value ||
                  watchReportName === Reports[7].value ||
                  watchReportName === Reports[8].value ? (
                    <div>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Date From input */}
                        <div className="mb-6">
                          <LabelInput
                            id="monthYear"
                            label={'Month Year'}
                            type="month"
                            controller={{ ...register('monthYear') }}
                            isError={errors.monthYear ? true : false}
                            errorMessage={errors.monthYear?.message}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Date From input */}
                        <div className="mb-6">
                          <LabelInput
                            id="dateFrom"
                            label={'Date From'}
                            type="date"
                            controller={{ ...register('dateFrom') }}
                            isError={errors.dateFrom ? true : false}
                            errorMessage={errors.dateFrom?.message}
                          />
                        </div>

                        {/* Date To input */}
                        <div className="mb-6">
                          <LabelInput
                            id="dateTo"
                            label={'Date To'}
                            type="date"
                            controller={{ ...register('dateTo') }}
                            isError={errors.dateTo ? true : false}
                            errorMessage={errors.dateTo?.message}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end w-full">
                  <Button
                    variant="info"
                    type="submit"
                    form="submitReportForm"
                    className="ml-1 text-gray-400 disabled:cursor-not-allowed"
                    // disabled={postFormLoading ? true : false}
                  >
                    <span className="text-xs font-normal">Submit</span>
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </Can>

      <Can not I="access" this="Reports">
        <Navigate to="/page-404" />
      </Can>
    </>
  );
}
