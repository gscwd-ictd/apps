import { Button, Modal } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { TrainingCategoriesPageFooter } from 'apps/employee-monitoring/src/components/sidebar-items/maintenance/events/trainings-and-seminars/Footer';
import { TrainingCategoriesPageHeader } from 'apps/employee-monitoring/src/components/sidebar-items/maintenance/events/trainings-and-seminars/Header';
import { useTrainingTypeStore } from 'apps/employee-monitoring/src/store/training-type.store';
import { ModalActions } from 'libs/utils/src/lib/enums/modal-actions.enum';
import { TrainingType } from 'libs/utils/src/lib/types/training-type';
import React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

const types: Array<TrainingType> = [
  {
    id: '001',
    name: 'Foundational',
  },
  {
    id: '002',
    name: 'Technical',
  },
  {
    id: '003',
    name: 'Managerial',
  },
  {
    id: '004',
    name: 'Professional',
  },
];

export default function Index() {
  const action = useTrainingTypeStore((state) => state.action);
  const setAction = useTrainingTypeStore((state) => state.setAction);
  const modalIsOpen = useTrainingTypeStore((state) => state.modalIsOpen);
  const setModalIsOpen = useTrainingTypeStore((state) => state.setModalIsOpen);
  const trainingTypes = useTrainingTypeStore((state) => state.trainingTypes);
  const setTrainingTypes = useTrainingTypeStore(
    (state) => state.setTrainingTypes
  );
  const [categoryForEdit, setCategoryForEdit] = useState<TrainingType>(
    {} as TrainingType
  );

  const { setValue, watch, handleSubmit, reset, register } =
    useForm<TrainingType>({
      mode: 'onChange',
      defaultValues: {
        id: '',
        name: '',
      },
    });

  const onSubmit = handleSubmit(
    (trainingType: TrainingType, e: React.FormEvent<HTMLInputElement>) => {
      e.preventDefault();

      // create action
      if (action === ModalActions.CREATE) {
        trainingType.id = uuidv4(); //! Remove this, this is for testing only!
        const oldTrainingTypes = [...trainingTypes];
        oldTrainingTypes.push(trainingType);
        setTrainingTypes(oldTrainingTypes);
        setModalIsOpen(false);
        setAction(ModalActions.EMPTY);
      }

      // update action
      else if (action === ModalActions.UPDATE) {
        const oldTrainingTypes = [...trainingTypes];
        // const filteredTrainingTypes = oldTrainingTypes.filter(
        //   (oldTrainingType) => oldTrainingType.id !== trainingType.id
        // );
        oldTrainingTypes.map((oldTrainingType) => {
          if (oldTrainingType.id === trainingType.id) {
            oldTrainingType.name = trainingType.name;
          }
          return oldTrainingType;
        });

        setTrainingTypes(oldTrainingTypes);
        setModalIsOpen(false);
        setAction(ModalActions.EMPTY);
      }
    }
  );

  const editAction = (trainingType: TrainingType) => {
    setAction(ModalActions.UPDATE);
    setCategoryForEdit(trainingType);
    setDefaultValues(trainingType);
    setModalIsOpen(true);
  };

  const closeAction = () => {
    setModalIsOpen(false);
    reset();
  };

  const setDefaultValues = (trainingType: TrainingType) => {
    setValue('id', trainingType.id);
    setValue('name', trainingType.name);
  };

  useEffect(() => {
    setTrainingTypes(types);
  }, []);

  useEffect(() => {
    console.log(trainingTypes);
  }, [trainingTypes]);

  return (
    <>
      <div className="min-h-[100%] min-w-full">
        <form onSubmit={onSubmit} id="trainingType">
          <Modal open={modalIsOpen} setOpen={setModalIsOpen} steady size="sm">
            <Modal.Header>
              <div className="flex justify-between w-full">
                <span className="text-2xl text-gray-600">
                  {action === ModalActions.CREATE
                    ? 'New'
                    : action === ModalActions.UPDATE
                    ? 'Edit'
                    : ''}
                </span>
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
                    id={'trainingTypeName'}
                    label={'Name'}
                    controller={{ ...register('name') }}
                    onChange={(e) =>
                      setCategoryForEdit({
                        ...categoryForEdit,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="flex justify-end w-full">
                <Button variant="info" type="submit" form="trainingType">
                  <span className="text-xs font-normal">
                    {action === ModalActions.CREATE
                      ? 'Add'
                      : action === ModalActions.UPDATE
                      ? 'Update'
                      : ''}
                  </span>
                </Button>
              </div>
            </Modal.Footer>
          </Modal>
        </form>

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
              <TrainingCategoriesPageHeader />
              <div className="w-full px-5 mt-5">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs border-b-2 text-slate-700">
                      <th className="font-semibold w-[1/2] text-left ">Name</th>

                      <th className="font-semibold w-[1/2] text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide">
                    {trainingTypes &&
                      trainingTypes.map((category, index) => {
                        return (
                          <React.Fragment key={index}>
                            <tr className="h-[4rem] text-gray-700">
                              <td className="w-[1/2] text-xs ">
                                {category.name}
                              </td>

                              <td className="w-[1/2]">
                                <div className="flex justify-center w-full gap-2">
                                  <Button
                                    variant="info"
                                    onClick={() => editAction(category)}
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
              <TrainingCategoriesPageFooter />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
