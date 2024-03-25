/* eslint-disable @nx/enforce-module-boundaries */
export type Announcement = {
  id: string;
  title: string;
  description: string;
  url: string;
  photoUrl: string;
  status: string;
  fileName: string;
  eventAnnouncementDate: string;
};

export type FormPostAnnouncement = Omit<Announcement, 'id'> & { app: string };

export type AnnouncementId = Pick<Announcement, 'id'>;

export type FormDeleteAnnouncement = AnnouncementId;
