/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import useSWR from 'swr';

import { useTravelOrderStore } from 'apps/employee-monitoring/src/store/travel-order.store';
import { TravelOrder } from 'libs/utils/src/lib/types/travel-order.type';

import { createColumnHelper } from '@tanstack/react-table';
import {
  DataTableHrms,
  LoadingSpinner,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { Card } from '../../../components/cards/Card';
import { BreadCrumbs } from '../../../components/navigations/BreadCrumbs';

const Index = () => {
  return (
    <></>
    // <div className="min-h-[100%] min-w-full px-4">
    //   <BreadCrumbs title="Travel Orders" />

    //   {/* Error Notifications */}
    //   {!isEmpty(ErrorTravelOrders) ? (
    //     <ToastNotification toastType="error" notifMessage={ErrorTravelOrders} />
    //   ) : null}
    //   {!isEmpty(ErrorTravelOrder) ? (
    //     <ToastNotification toastType="error" notifMessage={ErrorTravelOrder} />
    //   ) : null}

    //   {/* Success Notifications */}
    //   {!isEmpty(PostTravelOrderResponse) ? (
    //     <ToastNotification
    //       toastType="success"
    //       notifMessage="Travel order added successfully"
    //     />
    //   ) : null}
    //   {!isEmpty(UpdateTravelOrderResponse) ? (
    //     <ToastNotification
    //       toastType="success"
    //       notifMessage="Travel order updated successfully"
    //     />
    //   ) : null}
    //   {!isEmpty(DeleteTravelOrderResponse) ? (
    //     <ToastNotification
    //       toastType="success"
    //       notifMessage="Travel order deleted successfully"
    //     />
    //   ) : null}

    //   <Card>
    //     {IsLoading ? (
    //       <LoadingSpinner size="lg" />
    //     ) : (
    //       <div className="flex flex-row flex-wrap">
    //         <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
    //           <button
    //             type="button"
    //             className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
    //             onClick={openAddActionModal}
    //           >
    //             <i className="bx bxs-plus-square"></i>&nbsp; Add Travel Order
    //           </button>
    //         </div>

    //         <DataTableHrms
    //           data={TypesMockData}
    //           // data={TravelOrders}
    //           columns={columns}
    //           columnVisibility={columnVisibility}
    //           paginate
    //           showGlobalFilter
    //         />
    //       </div>
    //     )}
    //   </Card>

    //   {/* Add modal */}
    //   {/* <AddTravelOrderModal
    //     modalState={addModalIsOpen}
    //     setModalState={setAddModalIsOpen}
    //     closeModalAction={closeAddActionModal}
    //   /> */}

    //   {/* Edit modal */}
    //   {/* <EditTravelOrderModal
    //     modalState={editModalIsOpen}
    //     setModalState={setEditModalIsOpen}
    //     closeModalAction={closeEditActionModal}
    //     rowData={currentRowData}
    //   /> */}

    //   {/* Delete modal */}
    //   {/* <DeleteTravelOrderModal
    //     modalState={deleteModalIsOpen}
    //     setModalState={setDeleteModalIsOpen}
    //     closeModalAction={closeDeleteActionModal}
    //     rowData={currentRowData}
    //   /> */}
    // </div>
  );
};

export default Index;
