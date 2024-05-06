import { FunctionComponent } from 'react';
import { PrfTrail } from '../../../../types/prf.types';
import { PrfTimelineNode } from './PrfTimelineNode';
import defaultPhoto from '../../../../../public/profile.jpg';
import { PrfDetails } from 'apps/portal/src/types/prf.type';

type PrfTimelineProps = {
  prfTrail: PrfTrail;
  prfDetails?: PrfDetails;
  createdAt?: Date;
};

export const PrfTimeline: FunctionComponent<PrfTimelineProps> = ({ prfTrail, createdAt, prfDetails }) => {
  const { division, department, agm, admin, gm } = prfTrail;

  return (
    <>
      <div className="flex justify-center w-full gap-1">
        {division.name !== 'N/A' && (
          <PrfTimelineNode
            // status={prfDetails.status === 'Cancelled' ? 'Cancelled' : division.status}
            status={division.status}
            name={division.name}
            position={division.position}
            createdAt={createdAt}
            updatedAt={division.updatedAt}
            designation={division.designation}
            photoUrl={division.photoUrl ? division.photoUrl : defaultPhoto.src}
            // photoUrl="https://cdn.lorem.space/images/face/.cache/500x0/pexels-alena-darmel-7710127.jpg"
          />
        )}

        {department.name !== 'N/A' && (
          <PrfTimelineNode
            status={department.status}
            // status={prfDetails?.status === 'Cancelled' && division.name === 'N/A' ? 'Cancelled' : department.status}
            name={department.name}
            designation={department.designation}
            createdAt={createdAt}
            updatedAt={department.updatedAt}
            position={department.position}
            // photoUrl="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            photoUrl={department.photoUrl ? department.photoUrl : defaultPhoto.src}
          />
        )}

        {agm.name !== 'N/A' && (
          <PrfTimelineNode
            // status={prfDetails?.status === 'Cancelled' && department.name === 'N/A' ? 'Cancelled' : agm.status}
            status={agm.status}
            name={agm.name}
            position={agm.position}
            designation={agm.designation}
            createdAt={createdAt}
            updatedAt={agm.updatedAt}
            photoUrl={agm.photoUrl ? agm.photoUrl : defaultPhoto.src}
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
            photoUrl={admin.photoUrl ? admin.photoUrl : defaultPhoto.src}
          />
        )}

        <PrfTimelineNode
          status={gm.status}
          name={gm.name}
          position={gm.position}
          designation={gm.designation}
          updatedAt={gm.updatedAt}
          photoUrl={gm.photoUrl ? gm.photoUrl : defaultPhoto.src}
        />
      </div>
    </>
  );
};
