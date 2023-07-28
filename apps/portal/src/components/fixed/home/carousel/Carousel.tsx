/* eslint-disable @nx/enforce-module-boundaries */
import * as React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useState } from 'react';
import { Announcements } from './Announcements';

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

  return (
    <>
      <div
        ref={sliderRef}
        className="keen-slider w-full h-[150%] md:h-[280%] lg:h-screen pb-10 rounded-lg shadow bg-gray-100"
      >
        {Announcements.map((src, i) => (
          <>
            <div className="keen-slider__slide number-slide1 w-screen h-screen">
              <div className="w-screen h-full bg-gray-100 flex flex-col pt-4 pb-4 pl-8 pr-8 gap-2">
                <label className="text-lg text-slate-600 uppercase">
                  {src.title}
                </label>
                <label className="hidden lg:block text-sm text-slate-500 text-justify">
                  {src.desc}
                </label>

                <label className="text-right text-sm text-slate-500 cursor-pointer">
                  <a target="blank" href={src.link}>
                    Read More
                  </a>
                </label>
                <img className="w-100 h-100" src={src.src}></img>
              </div>
            </div>
          </>
        ))}

        {/* <div className="keen-slider__slide number-slide1 w-screen h-screen">
          <div className="w-screen h-full bg-gray-100 flex flex-col pt-4 pb-4 pl-8 pr-8 gap-2">
            <label className="text-lg text-slate-600 uppercase">
              July Birthday Celebrants
            </label>

            <label className="hidden lg:block text-sm text-slate-500 text-justify">
              {`Happy Birthday to all July Celebrants! `}
            </label>

            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/gensanwd/videos/1959878211012530"
              >
                Read More
              </a>
            </label>
            <img className="w-100 h-100" src="/05.jpg"></img>
          </div>
        </div> */}
      </div>
    </>
  );
}
