import { AsideContext, Sidebar } from '@gscwd-apps/oneui';
import { useContext } from 'react';
import { ChevronDoubleLeft } from '../icons/ChevronDoubleLeft';

export const SideNavigation = () => {
  const { collapsed, setCollapsed } = useContext(AsideContext);

  return (
    <Sidebar className="text-white">
      <Sidebar.Header>
        <div className="flex justify-end px-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`bg-transparent hover:shadow-none ${
              collapsed ? 'rotate-180' : ''
            }`}
          >
            <ChevronDoubleLeft />
          </button>
        </div>
      </Sidebar.Header>
      <Sidebar.Content>
        <ul>
          <Sidebar.Item display="Test" icon={<></>} path=""></Sidebar.Item>
          <Sidebar.Item display="Test" icon={<>i</>} path=""></Sidebar.Item>
        </ul>
      </Sidebar.Content>
    </Sidebar>
  );
};
