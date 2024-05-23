import { AnnouncementStatus } from '../enums/announcements.enum';

export type Announcements = {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: string;
  title: string;
  description: string;
  url: string;
  photoUrl: string | null;
  status: AnnouncementStatus;
  eventAnnouncementDate: string;
};
