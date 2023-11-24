import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
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
import { getEmpMonitoring } from '../../utils/helper/employee-monitoring-axios-helper';

// yup error handling initialization
const yupSchema = yup
  .object({
    reportName: yup.string().required('Select a type of report'),
    dateFrom: yup.date().required('Starting date os required').nullable(),
    dateTo: yup.date().required('Starting date os required').nullable(),
  })
  .required();

export default function Index() {
  // React hook form
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Report>({
    mode: 'onChange',
    defaultValues: {
      reportName: '',
      dateFrom: '',
      dateTo: '',
    },
    resolver: yupResolver(yupSchema),
  });

  // form submission
  const onSubmit: SubmitHandler<Report> = (data: Report) => {
    // set loading to true
    // PostCustomGroup();

    // handlePostResult(data);

    console.log(data);
  };

  const handlePostResult = async (data: Report) => {
    const { error, result } = await getEmpMonitoring(
      `/report/reportname?=${data.reportName}&datefrom=${data.dateFrom}&dateTo=${data.dateTo}`
    );

    if (error) {
      // request is done so set loading to false
      // PostCustomGroupFail(result);
    } else {
      // request is done so set loading to false
      // PostCustomGroupSuccess(result);
      // reset();
      // closeModalAction();
    }
  };

  return (
    <>
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

        <Can I="access" this="Reports">
          <div className="sm:px-2 md:px-2 lg:px-5">
            <Card>
              <form onSubmit={handleSubmit(onSubmit)} id="addUserForm">
                <div className="grid gap-2">
                  {/* Employee select input */}
                  <div>
                    <SelectListRF
                      id="employeeId"
                      selectList={Reports}
                      controller={{
                        ...register('reportName'),
                      }}
                      label="Report name"
                      isError={errors.reportName ? true : false}
                      errorMessage={errors.reportName?.message}
                    />
                  </div>

                  <div>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Date From input */}
                      <div className="mb-6">
                        <LabelInput
                          id={'name'}
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
                          id={'name'}
                          label={'Date To'}
                          type="date"
                          controller={{ ...register('dateTo') }}
                          isError={errors.dateTo ? true : false}
                          errorMessage={errors.dateTo?.message}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end w-full">
                  <Button
                    variant="info"
                    type="submit"
                    form="addUserForm"
                    className="ml-1 text-gray-400 disabled:cursor-not-allowed"
                    // disabled={postFormLoading ? true : false}
                  >
                    <span className="text-xs font-normal">Submit</span>
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </Can>
      </div>
    </>
  );
}
