/* eslint-disable @nx/enforce-module-boundaries */
import { AnnouncementStatus } from 'libs/utils/src/lib/enums/announcements.enum';
import { Announcements } from 'libs/utils/src/lib/types/announcements.type';

export const defaultAnnouncements: Array<Announcements> = [
  {
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
    id: '0',
    title: 'Announcements',
    description: 'For the latest announcements, please visit our HRD page.',
    url: 'https://www.facebook.com/gensanwd',
    photoUrl: '/01.jpg',
    status: AnnouncementStatus.ACTIVE,
    eventAnnouncementDate: '',
  },
];
