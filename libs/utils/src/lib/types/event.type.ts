import { EventTypes } from '../enums/event.enum';

export type Event = {
  id?: string;
  name: string;
  type: EventTypes;
};
