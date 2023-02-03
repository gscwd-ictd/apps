import {
  CalendarClockIcon,
  CalendarPlusIcon,
  CalendarHeartIcon,
  ChevronUpIcon,
  SearchIcon,
  XIcon,
  CalendarDaysIcon,
  CalendarRangeIcon,
  TimerResetIcon,
  FileInputIcon,
  LightbulbIcon,
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
  return (
    <CalendarClockIcon
      strokeWidth={1.5}
      color={color}
      size={size}
      className={className}
    />
  );
};

export const MyCalendarPlusIcon: FunctionComponent<MyIconProps> = ({
  color = 'currentColor',
  size = 25,
  className,
}) => {
  return (
    <CalendarPlusIcon
      strokeWidth={1.5}
      color={color}
      size={size}
      className={className}
    />
  );
};

export const MyCalendarHeartIcon: FunctionComponent<MyIconProps> = ({
  color = 'currentColor',
  size = 25,
  className,
}) => {
  return (
    <CalendarHeartIcon
      strokeWidth={1.5}
      color={color}
      size={size}
      className={className}
    />
  );
};

export const MyChevronUpIcon: FunctionComponent<MyIconProps> = ({
  color = 'currentColor',
  size = 25,
  className,
}) => {
  return (
    <ChevronUpIcon
      strokeWidth={1.5}
      color={color}
      size={size}
      className={className}
    />
  );
};

export const MySearchIcon: FunctionComponent<MyIconProps> = ({
  color = 'currentColor',
  size = 25,
  className,
}) => {
  return (
    <SearchIcon
      strokeWidth={1.5}
      color={color}
      size={size}
      className={className}
    />
  );
};

export const MyCalendarDaysIcon: FunctionComponent<MyIconProps> = ({
  color = 'currentColor',
  size = 25,
  className,
}) => {
  return (
    <CalendarDaysIcon
      strokeWidth={1.5}
      color={color}
      size={size}
      className={className}
    />
  );
};

export const MyCalendarRangeIcon: FunctionComponent<MyIconProps> = ({
  color = 'currentColor',
  size = 25,
  className,
}) => {
  return (
    <CalendarRangeIcon
      strokeWidth={1.5}
      color={color}
      size={size}
      className={className}
    />
  );
};

export const MyTimerResetIcon: FunctionComponent<MyIconProps> = ({
  color = 'currentColor',
  size = 25,
  className,
}) => {
  return (
    <TimerResetIcon
      strokeWidth={1.5}
      color={color}
      size={size}
      className={className}
    />
  );
};

export const MyFileInputIcon: FunctionComponent<MyIconProps> = ({
  color = 'currentColor',
  size = 25,
  className,
}) => {
  return (
    <FileInputIcon
      strokeWidth={1.5}
      color={color}
      size={size}
      className={className}
    />
  );
};

export const MyXIcon: FunctionComponent<MyIconProps> = ({
  color = 'currentColor',
  size = 25,
  className,
}) => {
  return (
    <XIcon strokeWidth={1.5} color={color} size={size} className={className} />
  );
};

export const MyLightBulbIcon: FunctionComponent<MyIconProps> = ({
  color = 'currentColor',
  size = 25,
  className,
}) => {
  return (
    <LightbulbIcon
      strokeWidth={1.5}
      color={color}
      size={size}
      className={className}
    />
  );
};
