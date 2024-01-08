/* eslint-disable @nx/enforce-module-boundaries */
export type Announcement = {
  _id: string;
  title: string;
  date: string;
  description: string;
  url: string;
  image: string;
};

export type FormPostAnnouncement = Omit<Announcement, '_id'> & { app: string };

export type AnnouncementId = Pick<Announcement, '_id'>;

export type FormDeleteAnnouncement = AnnouncementId;
