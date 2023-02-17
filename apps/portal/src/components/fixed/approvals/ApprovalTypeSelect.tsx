import { ListDef, Select } from '@gscwd-apps/oneui';
import { useApprovalStore } from '../../../../src/store/approvals.store';

type ApprovalType = { type: string; code: number };

export const ApprovalTypeSelect = () => {
  const selectedApprovalType = useApprovalStore(
    (state) => state.selectedApprovalType
  );
  const setSelectedApprovalType = useApprovalStore(
    (state) => state.setSelectedApprovalType
  );

  const selection = [
    { type: 'For Approval', code: 1 },
    { type: 'Approved', code: 2 },
    { type: 'Disapproved', code: 3 },
  ] as ApprovalType[];

  const list: ListDef<ApprovalType> = {
    key: 'type',
    render: (info, state) => (
      <div
        className={`${
          state.active ? 'bg-indigo-200' : state.selected ? 'bg-slate-200' : ''
        } pl-2 cursor-pointer`}
      >
        {info.type}
      </div>
    ),
  };

  const onChangeType = (code: number) => {
    // e.preventDefault();
    setSelectedApprovalType(code);
  };

  return (
    <div className="flex justify-end gap-2">
      <Select
        className="w-52"
        data={selection}
        initial={selection[0]}
        listDef={list}
        onSelect={(selectedItem) => onChangeType(selectedItem.code)}
      />
      {/*     
      <Button
        variant={'primary'}
        size={'sm'}
        loading={false}
        onClick={(e) => searchDtr(e)}
        type="submit"
      >
        <HiOutlineSearch className="w-5 h-5" />
      </Button> */}
    </div>
  );
};
