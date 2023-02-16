import { useRouter } from 'next/router';

type SideNavLinkProps = {
  icon: JSX.Element;
  destination: string;
};

export const SideNavLink = ({ icon, destination }: SideNavLinkProps): JSX.Element => {
  const router = useRouter();
  return (
    <li
      onClick={() => router.push(destination)}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded transition-colors ease-in-out hover:bg-slate-200 hover:text-slate-500"
    >
      {icon}
    </li>
  );
};
