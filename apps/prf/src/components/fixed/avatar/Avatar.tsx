import Image from 'next/image';
import { MouseEventHandler } from 'react';
import { FunctionComponent } from 'react';
import { HiOutlineCamera } from 'react-icons/hi';

type AvatarProps = {
  onClick?: MouseEventHandler<HTMLDivElement>;
  shape?: 'round' | 'curved-edge' | 'sharp-edge';
  size?: 'sm' | 'md' | 'lg';
  imageSrc?: string;
  upload?: boolean;
  interactive?: boolean;
};

export const Avatar: FunctionComponent<AvatarProps> = ({ size = 'md', shape = 'round', upload = false, interactive = false, imageSrc, onClick }) => {
  return (
    <>
      <div
        onClick={onClick}
        className={`
        ${interactive ? 'hover:ring-4 hover:ring-indigo-400 transition-colors' : ''} 
        ${upload ? 'flex items-center justify-center border-gray-200 border-4 border-dashed' : 'bg-gray-200'} ${
          size === 'sm' ? 'h-7 w-7' : size === 'md' ? 'h-12 w-12' : 'h-40 w-40'
        } ${shape === 'round' ? 'rounded-full' : shape === 'curved-edge' ? 'rounded-md' : ''} cursor-pointer overflow-hidden`}
      >
        {upload && <HiOutlineCamera className="h-10 w-10 text-gray-400" />}
        {imageSrc && (
          <Image
            src={imageSrc}
            alt="avatar"
            height={`${size === 'md' ? 100 : size === 'lg' ? 200 : 50}`}
            width={`${size === 'md' ? 100 : size === 'lg' ? 200 : 50}`}
          />
        )}
      </div>
    </>
  );
};
