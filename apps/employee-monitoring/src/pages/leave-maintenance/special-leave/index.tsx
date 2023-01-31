import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';

export default function Index() {
  return (
    <div className="min-h-[100%] min-w-full">
      <BreadCrumbs
        title="Special Leave"
        crumbs={[
          {
            layerNo: 1,
            layerText: 'Special Leave Maintenance',
            path: '',
          },
        ]}
      />
    </div>
  );
}
