/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  getEmpMonitoring,
  postEmpMonitoring,
} from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import {
  getHRIS,
  postHRIS,
} from 'apps/employee-monitoring/src/utils/helper/hris-axios-helper';
import { isEmpty } from 'lodash';

import { useModulesStore } from 'apps/employee-monitoring/src/store/module.store';
import {
  PostRequestUserRoles,
  UserRole,
} from 'apps/employee-monitoring/src/utils/types/user.type';
import { useUsersStore } from 'apps/employee-monitoring/src/store/user.store';

import {
  Modal,
  AlertNotification,
  LoadingSpinner,
  Button,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { SelectListRF } from '../../../inputs/SelectListRF';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { Module } from 'apps/employee-monitoring/src/utils/types/module.type';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

// yup error handling initialization
const yupSchema = yup
  .object({
    employeeId: yup.string().required('Select an employee'),
  })
  .required();

const mockDataModules: Array<Module> = [
  {
    _id: 'dda572e1-3816-11ee-8170-005056b680ac',
    module: 'Employee Schedules',
    slug: 'employeeSchedules',
    url: '/employee-schedules',
  },
  {
    _id: 'dda58b5e-3816-11ee-8170-005056b680ac',
    module: 'Daily Time Record',
    slug: 'dailyTimeRecord',
    url: '/daily-time-record',
  },
  {
    _id: 'dda598b6-3816-11ee-8170-005056b680ac',
    module: 'Leave Ledger',
    slug: 'leaveLedger',
    url: '/leave-ledger',
  },
  {
    _id: 'dda5adce-3816-11ee-8170-005056b680ac',
    module: 'Scheduling Sheets',
    slug: 'schedulingSheets',
    url: '/scheduling-sheets',
  },
  {
    _id: 'dda5bc73-3816-11ee-8170-005056b680ac',
    module: 'Scheduling Sheet Station',
    slug: 'schedulingSheetStation',
    url: '/scheduling-sheet-station',
  },
  {
    _id: 'dda5d9c7-3816-11ee-8170-005056b680ac',
    module: 'Scheduling Sheet Field',
    slug: 'schedulingSheetField',
    url: '/scheduling-sheet-field',
  },
  {
    _id: 'dda5e67a-3816-11ee-8170-005056b680ac',
    module: 'Overtime',
    slug: 'overtime',
    url: '/overtime',
  },
  {
    _id: 'dda5f284-3816-11ee-8170-005056b680ac',
    module: 'Leave Applications',
    slug: 'leaveApplications',
    url: '/leave-applications',
  },
  {
    _id: 'dda5ff92-3816-11ee-8170-005056b680ac',
    module: 'Schedules',
    slug: 'schedules',
    url: '/schedules',
  },
  {
    _id: 'dda60b5d-3816-11ee-8170-005056b680ac',
    module: 'Schedule Office',
    slug: 'scheduleOffice',
    url: '/schedule-office',
  },
  {
    _id: 'dda617f1-3816-11ee-8170-005056b680ac',
    module: 'Schedule Field',
    slug: 'scheduleField',
    url: '/schedule-field',
  },
  {
    _id: 'dda6246b-3816-11ee-8170-005056b680ac',
    module: 'Schedule Station',
    slug: 'scheduleStation',
    url: '/schedule-station',
  },
  {
    _id: 'dda6313d-3816-11ee-8170-005056b680ac',
    module: 'Pass Slips',
    slug: 'passSlips',
    url: '/pass-slips',
  },
  {
    _id: 'dda63de2-3816-11ee-8170-005056b680ac',
    module: 'Event Holidays',
    slug: 'eventHolidays',
    url: '/event-holidays',
  },
  {
    _id: 'dda64b75-3816-11ee-8170-005056b680ac',
    module: 'Event Work Suspensions',
    slug: 'eventWorkSuspensions',
    url: '/event-work-suspensions',
  },
  {
    _id: 'dda65881-3816-11ee-8170-005056b680ac',
    module: 'Leave Benefits',
    slug: 'leaveBenefits',
    url: '/leave-benefits',
  },
  {
    _id: 'dda669f7-3816-11ee-8170-005056b680ac',
    module: 'Leave Benefit Cumulative',
    slug: 'leaveBenefitCumulative',
    url: '/leave-benefit-cumulative',
  },
  {
    _id: 'dda6758d-3816-11ee-8170-005056b680ac',
    module: 'Leave Benefit Recurring',
    slug: 'leaveBenefitRecurring',
    url: '/leave-benefit-recurring',
  },
  {
    _id: 'dda6815b-3816-11ee-8170-005056b680ac',
    module: 'Leave Benefit Special',
    slug: 'leaveBenefitSpecial',
    url: '/leave-benefit-special',
  },
  {
    _id: 'dda68de3-3816-11ee-8170-005056b680ac',
    module: 'Travel Orders',
    slug: 'travelOrders',
    url: '/travel-orders',
  },
  {
    _id: 'dda69a26-3816-11ee-8170-005056b680ac',
    module: 'Users',
    slug: 'users',
    url: '/users',
  },
  {
    _id: 'dda6a5ca-3816-11ee-8170-005056b680ac',
    module: 'Officer of the Day',
    slug: 'officerOfTheDay',
    url: '/officer-of-the-day',
  },
  {
    _id: 'dda6b234-3816-11ee-8170-005056b680ac',
    module: 'System Logs',
    slug: 'systemLogs',
    url: '/system-logs',
  },
  {
    _id: 'e19eba7f-bb64-4936-890c-6f6d51f2c5eb',
    module: 'Settings Module',
    slug: 'settings',
    url: '/settings',
  },
  {
    _id: 'eb3bbd5e-cdbf-4a05-bea0-8d3486fdac1d',
    module: 'Personnel Selection',
    slug: 'personnelSelection',
    url: '/personnel-selection',
  },
];

const mockDataUsers: Array<SelectOption> = [
  {
    label: 'Aquino, Wilhem R. ',
    value: '05b065ee-b191-11ed-a79b-000c29f95a80',
  },
  {
    label: 'Decrepito, Haniel O. ',
    value: 'af595d1a-b26e-11ed-a79b-000c29f95a80',
  },
  {
    label: 'Lucas, Lipsy Grace C. ',
    value: 'af6f15a4-b26e-11ed-a79b-000c29f95a80',
  },
  {
    label: 'Nudos, Melanie ',
    value: 'b8544c5a-8f7d-424e-99e8-b035ac41ec5d',
  },
];

const AddUserModal: FunctionComponent<AddModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
}) => {
  const [userRoles, setUserRoles] = useState<Array<UserRole>>([]);
  const [isDoneModuleToUserRole, setIsDoneModuleToUserRole] =
    useState<boolean>(false);

  // Zustand initialization
  const { Modules, SetGetModules, SetErrorModules } = useModulesStore(
    (state) => ({
      Modules: state.getModules,
      SetGetModules: state.setGetModules,

      SetErrorModules: state.setErrorModules,
    })
  );

  const {
    NonEmsUsers,
    SetGetNonEmsUsers,
    SetErrorNonEmsUsers,

    PostUser,
    SetPostUser,
    SetErrorUser,

    EmptyResponse,
  } = useUsersStore((state) => ({
    NonEmsUsers: state.getNonEmsUsers,
    SetGetNonEmsUsers: state.setGetNonEmsUsers,
    SetErrorNonEmsUsers: state.setErrorNonEmsUsers,

    PostUser: state.postUser,
    SetPostUser: state.setPostUser,
    SetErrorUser: state.setErrorUser,

    EmptyResponse: state.emptyResponse,
  }));

  // React hook form
  const {
    reset,
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting: postFormLoading },
  } = useForm<PostRequestUserRoles>({
    mode: 'onChange',
    defaultValues: {
      employeeId: '',
      userRoles: [],
    },
    resolver: yupResolver(yupSchema),
  });
  const { fields } = useFieldArray({
    control,
    name: 'userRoles',
  });

  // form submission
  const onSubmit: SubmitHandler<PostRequestUserRoles> = (
    data: PostRequestUserRoles
  ) => {
    EmptyResponse();

    handlePostResult(data);
  };

  // asynchronous request to post user and roles
  const handlePostResult = async (data: PostRequestUserRoles) => {
    const { error, result } = await postHRIS('/modules', data); // REPLACE postHRIS to postEmpMonitoring

    if (error) {
      SetErrorUser(result);
    } else {
      SetPostUser(result);

      reset();
      closeModalAction();
    }
  };

  // asynchronous request to fetch employee that is not assigned user of EMS module
  const fetchNonEmsUsers = async () => {
    // const { error, result } = await getEmpMonitoring('/users/assignable');
    const { error, result } = await getHRIS('/users/assignable');

    if (error) {
      SetErrorNonEmsUsers(result);
    } else {
      SetGetNonEmsUsers(result);
    }
  };

  // asynchronous request to fetch EMS modules
  const fetchModules = async () => {
    // const { error, result } = await getEmpMonitoring('/modules'); // REPLACE bottom code if route is available
    const { error, result } = await getHRIS('/modules');

    if (error) {
      SetErrorModules(result);
    } else {
      SetGetModules(result);

      // Mutate the result. Added each module object with hasAccess
      result.map((module: Module) => {
        const newUserRole = {
          moduleId: module._id,
          hasAccess: false,
          module: module.module,
          slug: module.slug,
          url: module.url,
        };
        setUserRoles((userRole) => [...userRole, newUserRole]);
      });

      setIsDoneModuleToUserRole(true);
    }
  };

  // If modal is open, set action to fetch for employee list
  useEffect(() => {
    if (modalState) {
      fetchNonEmsUsers();
      fetchModules();
    } else {
      // Upon closing, reset the ff: states
      setUserRoles([]);
      setIsDoneModuleToUserRole(false);
      reset();
    }
  }, [modalState]);

  // set value in react hook form for userRoles
  useEffect(() => {
    if (isDoneModuleToUserRole) {
      setValue('userRoles', userRoles);
    }
  }, [isDoneModuleToUserRole]);

  return (
    <>
      {/* Notification */}
      {!isEmpty(PostUser) ? (
        <ToastNotification
          toastType="success"
          notifMessage="User added successfully"
        />
      ) : null}

      <Modal open={modalState} setOpen={setModalState} steady size="md">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">Assign EMS User</span>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeModalAction}
            >
              <i className="bx bx-x"></i>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div>
            {/* Notifications */}
            {postFormLoading ? (
              <AlertNotification
                logo={<LoadingSpinner size="xs" />}
                alertType="info"
                notifMessage="Submitting request"
                dismissible={true}
              />
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} id="addUserForm">
              {/* Employee select input */}
              <div className="mb-6">
                <SelectListRF
                  id="employeeId"
                  selectList={NonEmsUsers}
                  controller={{
                    ...register('employeeId'),
                  }}
                  label="Employee"
                  isError={errors.employeeId ? true : false}
                  errorMessage={errors.employeeId?.message}
                />
              </div>

              <div className="mb-6">
                <label className="flex justify-between gap-2 mb-1 text-xs font-medium text-gray-900 dark:text-gray-800">
                  <div className="flex gap-2">Modules</div>
                </label>

                <div className="grid grid-cols-2 gap-1 pl-6">
                  {fields.map((item, index) => {
                    return (
                      <div className="flex" key={item.id}>
                        <input
                          id={item.slug}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          {...register(`userRoles.${index}.hasAccess`)}
                        />
                        <label
                          htmlFor={item.slug}
                          className="ml-2 flex justify-between gap-2 mb-1 text-xs font-medium text-gray-900"
                        >
                          {item.module}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>

        <Modal.Footer>
          {/* Submit button */}
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="submit"
              form="addUserForm"
              className="ml-1 text-gray-400 disabled:cursor-not-allowed"
              disabled={postFormLoading ? true : false}
            >
              <span className="text-xs font-normal">Submit</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddUserModal;
