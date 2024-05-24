/* eslint-disable @nx/enforce-module-boundaries */
import * as React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { Announcements } from 'libs/utils/src/lib/types/announcements.type';
import { useAnnouncementsStore } from 'apps/portal/src/store/announcements.store';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { defaultAnnouncements } from './Announcements';
import Image from 'next/image';

export default function Carousel() {
  const [next, setNext] = useState(false);
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
    },
    [
      (slider) => {
        const next1 = next;
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;

        if (next1) {
          slider.prev();
        }

        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 5000);
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on('dragStarted', clearNextTimeout);
        slider.on('animationEnded', nextTimeout);
        slider.on('updated', nextTimeout);
      },
    ]
  );
  const [finalAnnouncements, setFinalAnnouncements] = useState<Announcements[]>([]);
  const { announcements, getAnnouncements, getAnnouncementsSuccess, getAnnouncementsFail } = useAnnouncementsStore(
    (state) => ({
      announcements: state.announcements,
      getAnnouncements: state.getAnnouncements,
      getAnnouncementsSuccess: state.getAnnouncementsSuccess,
      getAnnouncementsFail: state.getAnnouncementsFail,
    })
  );

  const announcementsUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/event-announcements/`;

  const {
    data: swrAnnouncements,
    isLoading: swrAnnouncementsIsLoading,
    error: swrAnnouncementsError,
    mutate: mutateAnnouncements,
  } = useSWR(announcementsUrl, fetchWithToken, { shouldRetryOnError: false, revalidateOnFocus: true });

  // Initial zustand state update
  useEffect(() => {
    if (swrAnnouncementsIsLoading) {
      getAnnouncements(swrAnnouncementsIsLoading);
    }
  }, [swrAnnouncementsIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrAnnouncements)) {
      getAnnouncementsSuccess(swrAnnouncementsIsLoading, swrAnnouncements);
    }

    if (!isEmpty(swrAnnouncementsError)) {
      getAnnouncementsFail(swrAnnouncementsIsLoading, swrAnnouncementsError.message);
    }
  }, [swrAnnouncements, swrAnnouncementsError]);

  useEffect(() => {
    if (announcements.length > 0) {
      setFinalAnnouncements(announcements);
    } else {
      setFinalAnnouncements(defaultAnnouncements);
    }
  }, [announcements]);

  return (
    <div
      //if announcement is only 1, disable sliding
      ref={finalAnnouncements.length > 1 ? sliderRef : null}
      className="keen-slider w-full h-[150%] md:h-[280%] lg:h-screen pb-10 rounded-lg shadow bg-gray-100"
    >
      {finalAnnouncements.length > 0 &&
        finalAnnouncements.map((announce: Announcements, index) => (
          <div key={index} className="keen-slider__slide number-slide1 w-screen h-screen">
            <div className="w-full h-full bg-gray-100 flex flex-col pt-4 pb-4 pl-8 pr-8 gap-2">
              <label className="text-lg text-slate-600 uppercase">{announce.title}</label>
              <label className="hidden lg:block text-sm text-slate-500 text-justify">
                {announce.description.length > 250
                  ? `${announce.description.substring(0, 250)}...`
                  : announce.description}
              </label>

              <label className="text-right text-sm text-slate-500 cursor-pointer">
                {announce.url ? (
                  <a target="blank" href={announce.url}>
                    Read More
                  </a>
                ) : null}
              </label>
              <Image src={announce.photoUrl} width={843} height={843} alt={announce.title} />
            </div>
          </div>
        ))}
    </div>
  );
}
