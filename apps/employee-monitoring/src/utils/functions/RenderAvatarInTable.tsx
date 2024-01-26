import { isEmpty } from 'lodash';
import UseRenderNameIcon from './RenderNameIcon';
import Image from 'next/image';

function UseRenderAvatarInTable(avatarUrl: string, name: string) {
  if (!isEmpty(avatarUrl)) {
    return (
      <Image
        src={avatarUrl}
        width={48}
        height={48}
        alt={`Picture of employee ${name}`}
        className="m-auto rounded-full"
      />
    );
  }

  return <> {UseRenderNameIcon(name)}</>;
}

export default UseRenderAvatarInTable;
