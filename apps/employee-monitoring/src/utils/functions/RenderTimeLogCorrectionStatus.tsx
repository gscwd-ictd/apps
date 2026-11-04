/** Colored pill for a time log correction status. */
export default function RenderTimeLogCorrectionStatus(status: string) {
  const color =
    status === 'approved'
      ? 'bg-green-100 text-green-800'
      : status === 'disapproved'
      ? 'bg-red-100 text-red-800'
      : 'bg-amber-100 text-amber-800';
  const label = status ? status.replace(/\b\w/g, (c) => c.toUpperCase()) : '-';
  return <span className={`px-2 py-0.5 text-xs font-medium rounded ${color}`}>{label}</span>;
}
