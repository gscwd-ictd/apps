import { FunctionComponent } from 'react';
import { PrfTrail } from '../../../../types/prf.types';
import { PrfTimelineNode } from './PrfTimelineNode';

type PrfTimelineProps = {
  prfTrail: PrfTrail;
  createdAt?: Date;
};

export const PrfTimeline: FunctionComponent<PrfTimelineProps> = ({
  prfTrail,
  createdAt,
}) => {
  const { division, department, agm, admin, gm } = prfTrail;

  return (
    <>
      <div className="flex gap-1 w-full justify-center">
        {division.name !== 'N/A' && (
          <PrfTimelineNode
            status={division.status}
            name={division.name}
            position={division.position}
            createdAt={createdAt}
            updatedAt={division.updatedAt}
            designation={division.designation}
            photoUrl="https://cdn.lorem.space/images/face/.cache/500x0/pexels-alena-darmel-7710127.jpg"
          />
        )}

        {department.name !== 'N/A' && (
          <PrfTimelineNode
            status={department.status}
            name={department.name}
            designation={department.designation}
            createdAt={createdAt}
            updatedAt={department.updatedAt}
            position={department.position}
            photoUrl="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          />
        )}

        {agm.name !== 'N/A' && (
          <PrfTimelineNode
            status={agm.status}
            name={agm.name}
            position={agm.position}
            designation={agm.designation}
            createdAt={createdAt}
            updatedAt={agm.updatedAt}
            photoUrl="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
          />
        )}

        {admin.name !== 'N/A' && (
          <PrfTimelineNode
            status={admin.status}
            name={admin.name}
            position={admin.position}
            designation={admin.designation}
            createdAt={createdAt}
            updatedAt={admin.updatedAt}
            photoUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          />
        )}

        <PrfTimelineNode
          status={gm.status}
          name={gm.name}
          position={gm.position}
          designation={gm.designation}
          updatedAt={gm.updatedAt}
          photoUrl="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        />
      </div>
    </>
  );
};
