import {
  CalendarClockIcon,
  CalendarPlusIcon,
  CalendarHeartIcon,
  ChevronUpIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import { FunctionComponent } from 'react';

type MyIconProps = {
  color?: string;
  size?: number;
  className?: string;
};

export const MyCalendarClockIcon: FunctionComponent<MyIconProps> = ({
  color = 'currentColor',
  size = 25,
  className,
}) => {
  return <CalendarClockIcon color={color} size={size} className={className} />;
};

export const MyCalendarPlusIcon: FunctionComponent<MyIconProps> = ({
  color = 'currentColor',
  size = 25,
  className,
}) => {
  return <CalendarPlusIcon color={color} size={size} className={className} />;
};

export const MyCalendarHeartIcon: FunctionComponent<MyIconProps> = ({
  color = 'currentColor',
  size = 25,
  className,
}) => {
  return <CalendarHeartIcon color={color} size={size} className={className} />;
};

export const MyChevronUpIcon: FunctionComponent<MyIconProps> = ({
  color = 'currentColor',
  size = 25,
  className,
}) => {
  return <ChevronUpIcon color={color} size={size} className={className} />;
};

export const MySearchIcon: FunctionComponent<MyIconProps> = ({
  color = 'currentColor',
  size = 25,
  className,
}) => {
  return <SearchIcon color={color} size={size} className={className} />;
};

export const MyXIcon: FunctionComponent<MyIconProps> = ({
  color = 'currentColor',
  size = 25,
  className,
}) => {
  return <XIcon color={color} size={size} className={className} />;
};
