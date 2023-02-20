import { useState } from 'react';
import { FunctionComponent } from 'react';
import { Button } from '../../modular/forms/buttons/Button';
import { Avatar } from '../avatar/Avatar';
import { useProfileStore } from '../../../store/create-profile.store';

const defaultImages = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  '/avatars/avatar5.png',
];

export const ChooseAvatar: FunctionComponent = () => {
  // access next page from store
  const nextPage = useProfileStore((state) => state.setNextPage);

  // access pending user from store
  const pendingUser = useProfileStore((state) => state.pendingUser);

  // access set pending user from store
  const setPendingUser = useProfileStore((state) => state.setPendingUser);

  return (
    <>
      <section className="mt-12">
        <div className="flex gap-10">
          <div className="flex flex-col items-center mt-12">
            <Avatar
              size="lg"
              shape="round"
              imageSrc={pendingUser.photoUrl}
              upload={pendingUser.photoUrl === '' || !pendingUser.hasOwnProperty('photoUrl') ? true : false}
            />
          </div>

          <div className="mt-14">
            <button className="border px-3 py-1 rounded border-gray-300">Choose image</button>
            <p className="text-sm text-gray-500 ml-1 mt-7 mb-3 font-medium">Or choose from one of our defaults:</p>

            <div className="flex gap-2">
              {defaultImages.map((img: string, index: number) => {
                return (
                  <Avatar
                    key={index}
                    imageSrc={img}
                    interactive
                    onClick={() => setPendingUser({ ...pendingUser, photoUrl: img })}
                  />
                );
              })}
            </div>

            <div className="flex justify-end mt-10">
              <div className="w-20">
                <Button btnLabel="Next" fluid onClick={nextPage} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
