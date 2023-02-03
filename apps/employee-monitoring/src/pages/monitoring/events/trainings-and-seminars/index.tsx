import { Button, Modal } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { TrainingsPageFooter } from 'apps/employee-monitoring/src/components/sidebar-items/monitoring/events/trainings-and-seminars/Footer';
import { TrainingsPageHeader } from 'apps/employee-monitoring/src/components/sidebar-items/monitoring/events/trainings-and-seminars/Header';
import React from 'react';
import { useEffect, useState } from 'react';
import { Training } from '../../../../../../../libs/utils/src/lib/types/training-type';

const training: Array<Training> = [
  {
    id: '001',
    name: 'Skills Training',
    dateFrom: 'February 27, 2023',
    dateTo: 'February 29, 2023',
    hours: 18,
    inOffice: true,
    learningServiceProvider: 'General Santos City Water District',
    location: 'GSCWD Office',
    type: 'foundational',
    assignedEmployees: [
      'Gergina Phan',
      'Spiridon Duarte',
      'Nidia Wolanski',
      'Zemfira Benvenuti',
      'Tony Hutmacher',
    ],
  },
  {
    id: '002',
    name: 'Leadership Training',
    dateFrom: 'March 18, 2023',
    dateTo: 'March 18, 2023',
    hours: 5,
    inOffice: true,
    learningServiceProvider: 'General Santos City Water District',
    location: 'GSCWD Office',
    type: 'managerial',
    assignedEmployees: ['Ellen Kron', 'Joana Loper'],
  },
  {
    id: '003',
    name: 'Senior Executive Training',
    dateFrom: 'March 22, 2023',
    dateTo: 'March 23, 2023',
    hours: 10,
    inOffice: false,
    learningServiceProvider: 'Ree Cardo Services',
    location: 'Green Leaf Hotel Gensan',
    type: 'managerial',
    assignedEmployees: ['Georgina Zeman', 'Inna Trajkovski'],
  },
  {
    id: '004',
    name: 'Technical Skills Training',
    dateFrom: 'April 01, 2023',
    dateTo: 'April 02, 2023',
    hours: 10,
    inOffice: false,
    learningServiceProvider: 'Ree Cardo Services',
    location: 'Gumasa, Saranggani Province',
    type: 'technical',
    assignedEmployees: ['Theo McPhee', 'Wilma Ariesen'],
  },
  {
    id: '005',
    name: 'Project Management Workshop Seminar',
    dateFrom: 'April 05, 2023',
    dateTo: 'April 10, 2023',
    hours: 36,
    inOffice: false,
    learningServiceProvider: 'Ree Cardo Services',
    location: 'Cebu City',
    type: 'professional',
    assignedEmployees: ['Sofia Whitaker'],
  },
];

const trainingType: Array<{ label: string; value: string }> = [
  { label: 'Foundational', value: 'foundational' },
  { label: 'Technical', value: 'technical' },
  { label: 'Managerial/Leadership', value: 'managerial' },
  { label: 'Professional', value: 'professional' },
];

export default function Index() {
  const [action, setAction] = useState<string>('');
  const [trainings, setTrainings] = useState<Array<Training>>([]);
  const [trainingForEdit, setTrainingForEdit] = useState<Training>({
    name: '',
    dateFrom: '',
    dateTo: '',
    hours: 0,
    inOffice: false,
    location: '',
    type: '',
  } as Training);
  const [trainingModalisOpen, setTrainingModalIsOpen] =
    useState<boolean>(false);

  const editAction = (training: Training) => {
    setAction('update');
    setTrainingForEdit(training);
    setTrainingModalIsOpen(true);
  };

  const closeAction = () => {
    setTrainingModalIsOpen(false);
  };

  useEffect(() => {
    setTrainings(training);
  }, []);

  useEffect(() => {
    console.log(action);
  }, [action]);

  return (
    <>
      <div className="min-h-[100%] min-w-full">
        <Modal
          open={trainingModalisOpen}
          setOpen={setTrainingModalIsOpen}
          steady
          size="full"
        >
          <Modal.Header>
            <div className="flex justify-between w-full">
              <span className="text-2xl text-gray-600">Edit</span>
              <button
                className="w-[1.5rem] h-[1.5rem] items-center text-center text-white bg-gray-400 rounded-full"
                type="button"
                onClick={closeAction}
              >
                x
              </button>
            </div>
          </Modal.Header>
          <hr />
          <Modal.Body>
            <div className="w-full mt-5">
              <div className="flex flex-col w-full gap-5">
                <LabelInput
                  id={'recurringName'}
                  label={'Leave Name'}
                  value={trainingForEdit.name}
                  onChange={(e) =>
                    setTrainingForEdit({
                      ...trainingForEdit,
                      name: e.target.value,
                    })
                  }
                />

                <div className="flex flex-col">
                  <label htmlFor="trainingType">
                    <span className="text-xs text-gray-700">Type</span>
                  </label>
                  <select
                    id="trainingType"
                    className="rounded border active:border-none border-gray-300 w-full outline-none text-xs text-gray-600 h-[2.25rem] px-4"
                    value={trainingForEdit.type}
                  >
                    {trainingType &&
                      trainingType.map((item) => {
                        return (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <LabelInput
                  id="trainingDateStart"
                  label="Date Start"
                  value={trainingForEdit.dateFrom}
                  onChange={(e) =>
                    setTrainingForEdit({
                      ...trainingForEdit,
                      dateFrom: e.target.value,
                    })
                  }
                />

                <LabelInput
                  id="trainingDateEnd"
                  label="Date End"
                  value={trainingForEdit.dateTo}
                  onChange={(e) =>
                    setTrainingForEdit({
                      ...trainingForEdit,
                      dateTo: e.target.value,
                    })
                  }
                />

                <LabelInput
                  id="trainingDateEnd"
                  label="Date End"
                  value={trainingForEdit.dateTo}
                  onChange={(e) =>
                    setTrainingForEdit({
                      ...trainingForEdit,
                      dateTo: e.target.value,
                    })
                  }
                />

                <LabelInput
                  id="trainingTotalHours"
                  label="Total Hours"
                  value={trainingForEdit.hours}
                  onChange={(e) =>
                    setTrainingForEdit({
                      ...trainingForEdit,
                      hours: e.target.valueAsNumber,
                    })
                  }
                />

                <div className="flex flex-col">
                  <label htmlFor="trainingInOffice">
                    <span className="text-xs text-gray-700">In Office</span>
                  </label>
                  <select
                    id="trainingInOffice"
                    className="rounded border active:border-none border-gray-300 w-full outline-none text-xs text-gray-600 h-[2.25rem] px-4"
                    value={trainingForEdit.inOffice === true ? 'yes' : 'no'}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <LabelInput
                  id="trainingProvider"
                  label="Provider"
                  value={trainingForEdit.learningServiceProvider}
                  onChange={(e) =>
                    setTrainingForEdit({
                      ...trainingForEdit,
                      learningServiceProvider: e.target.value,
                    })
                  }
                />

                <LabelInput
                  id="trainingLocation"
                  label="Location"
                  value={trainingForEdit.location}
                  onChange={(e) =>
                    setTrainingForEdit({
                      ...trainingForEdit,
                      location: e.target.value,
                    })
                  }
                />

                <LabelInput
                  id="trainingAssignedEmployees"
                  label="Assigned Employees"
                  value={trainingForEdit.assignedEmployees}
                  // onChange={(e) =>
                  //   setTrainingForEdit({
                  //     ...trainingForEdit,
                  //     assignedEmployees: e.target.value,
                  //   })
                  // }
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end w-full">
              <Button variant="info">
                <span className="text-xs font-normal">Update</span>
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
        <BreadCrumbs
          title="Trainings & Seminars"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Trainings & Seminars',
              path: '',
            },
          ]}
        />
        <div className="mx-5">
          <Card title={''}>
            {/** Top Card */}
            <div className="flex flex-col w-full h-full">
              <TrainingsPageHeader />
              <div className="w-full px-5 mt-5">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs border-b-2 max-h-4 text-slate-700">
                      <th className="font-semibold w-[1/10] text-left ">
                        Name
                      </th>

                      <th className="font-semibold w-[1/10] text-left">Type</th>

                      <th className="font-semibold w-[1/10] text-left">
                        Date Start
                      </th>
                      <th className="font-semibold w-[1/10] text-left">
                        Date End
                      </th>

                      <th className="font-semibold w-[1/10] text-left">
                        Total Hours
                      </th>

                      <th className="font-semibold w-[1/10] text-left">
                        In Office
                      </th>

                      <th className="font-semibold w-[1/10] text-left">
                        Provider
                      </th>

                      <th className="font-semibold w-[1/10] text-left">
                        Location
                      </th>

                      <th className="font-semibold w-[1/10] text-left">
                        Assigned Employees
                      </th>

                      <th className="font-semibold w-[1/10] text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide">
                    {trainings &&
                      trainings.map((training, index) => {
                        return (
                          <React.Fragment key={index}>
                            <tr className="w-full text-gray-700 h-[5rem]">
                              <td className="w-[1/10] text-xs px-1">
                                {training.name}
                              </td>

                              <td className="w-[1/10] text-xs px-1">
                                {training.type.toUpperCase()}
                              </td>

                              <td className="w-[1/10] text-xs px-1">
                                {training.dateFrom}
                              </td>

                              <td className="w-[1/10] text-xs px-1">
                                {training.dateTo}
                              </td>

                              <td className="w-[1/10] text-xs px-1">
                                {training.hours}
                              </td>

                              <td className="w-[1/10] text-xs uppercase px-1">
                                {training.inOffice === true ? 'Yes' : 'No'}
                              </td>

                              <td className="w-[1/10] text-xs px-1 ">
                                {training.learningServiceProvider}
                              </td>

                              <td className="w-[1/10] text-xs px-1">
                                {training.location}
                              </td>

                              <td className="w-[1/10] text-xs px-1">
                                {training.assignedEmployees.map((person) => {
                                  return (
                                    <div
                                      key={person}
                                      className="px-1 border border-white w-[8rem]"
                                    >
                                      <span className="px-1 rounded-full bg-gray-200/80">
                                        {person}
                                      </span>
                                    </div>
                                  );
                                })}
                              </td>
                              <td className="w-[1/10]">
                                <div className="flex justify-center w-full gap-2">
                                  <Button
                                    variant="info"
                                    onClick={() => editAction(training)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="w-4 h-4"
                                    >
                                      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                                      <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                                    </svg>
                                  </Button>
                                  <Button variant="danger">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="w-4 h-4"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <TrainingsPageFooter />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
