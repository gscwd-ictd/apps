import { ButtonHTMLAttributes, forwardRef, HTMLAttributes, MouseEventHandler } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { HiDotsVertical } from 'react-icons/hi';

export type VerticalDropdownProps = {
  items: Array<{
    key: string;
    value: string;
    onClick?: () => void;
    href?: string | undefined;
    type: 'button' | 'a';
  }>;
};

export const VerticalDropdown = forwardRef<HTMLButtonElement, VerticalDropdownProps>(({ items, ...props }, ref) => {
  return (
    <Popover.Root>
      <Popover.Trigger className="h-full  select-none whitespace-nowrap rounded hover:cursor-pointer active:cursor-pointer active:outline-none  transition-colors text-black hover:text-gray-700 ease-in-out ">
        <HiDotsVertical className="w-4 h-full" />
      </Popover.Trigger>
      <Popover.Content className="shadow-2xl PopoverContent" sideOffset={5} collisionPadding={20} avoidCollisions>
        {items.map((item, idx) => {
          return (
            <div key={idx} className="z-50 flex w-full bg-white outline-none ring-0">
              {item.type == 'button' ? (
                <button
                  {...props}
                  ref={ref}
                  type="button"
                  onClick={item?.onClick}
                  className="flex text-sm items-center w-full py-2 px-4  text-gray-500 rounded active:bg-slate-50 active:text-gray-900 group"
                >
                  {item.key}
                </button>
              ) : (
                <a className="flex text-sm items-center w-full py-2 px-4  text-gray-500 rounded active:bg-slate-50 active:text-gray-900 group">
                  {item.key}
                </a>
              )}
            </div>
          );
        })}
      </Popover.Content>
    </Popover.Root>
  );
});

VerticalDropdown.displayName = 'VerticalDropdown';
