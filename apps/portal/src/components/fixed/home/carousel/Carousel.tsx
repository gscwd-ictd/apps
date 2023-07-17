/* eslint-disable @nx/enforce-module-boundaries */
import * as React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useState } from 'react';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';

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
        <div className="keen-slider__slide number-slide1 w-screen h-screen">
          <div className="w-screen h-full bg-gray-100 flex flex-col pt-4 pb-4 pl-8 pr-8 gap-2">
            <label className="text-lg text-slate-600 uppercase">
              {`GSCWD conducts DPPR 2023`}
            </label>
            <label className="hidden lg:block text-sm text-slate-500 text-justify">
              {`Targets for CY 2024 were set during the Departmental Planning and Performance Review conducted by different departments of GSCWD.
Scheduled for the whole month of June, each department revisited accomplishments, tackled concerns focusing on improving performance so to help the district in achieving its goals.(LGL)`}
            </label>

            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/gensanwd/posts/pfbid0uRbNVg7KCCC2yutZjxt1x2ge2FD3XcYn9Q2Bc2EVYdccjhCE27m2eB9Xi1Tisp3Xl"
              >
                Read More
              </a>
            </label>
            <img className="w-100 h-100" src="/01.jpg"></img>
          </div>
        </div>
        <div className="keen-slider__slide number-slide2 w-screen h-screen">
          <div className="w-screen h-full bg-gray-100 flex flex-col pt-4 pb-4 pl-8 pr-8 gap-2">
            <label className="text-lg text-slate-600 uppercase">
              {`GSCWD conducts DPPR 2023`}
            </label>

            <label className="hidden lg:block text-sm text-slate-500 text-justify">
              {`Targets for CY 2024 were set during the Departmental Planning and Performance Review conducted by different departments of GSCWD.
Scheduled for the whole month of June, each department revisited accomplishments, tackled concerns focusing on improving performance so to help the district in achieving its goals.(LGL)`}
            </label>

            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/gensanwd/posts/pfbid0uRbNVg7KCCC2yutZjxt1x2ge2FD3XcYn9Q2Bc2EVYdccjhCE27m2eB9Xi1Tisp3Xl"
              >
                Read More
              </a>
            </label>
            <img className="w-100 h-100" src="/02.jpg"></img>
          </div>
        </div>
        <div className="keen-slider__slide number-slide1 w-screen h-screen">
          <div className="w-screen h-full bg-gray-100 flex flex-col pt-4 pb-4 pl-8 pr-8 gap-2">
            <label className="text-lg text-slate-600 uppercase">
              GSCWD conducts DPPR 2023
            </label>

            <label className="hidden lg:block text-sm text-slate-500 text-justify">
              {`Targets for CY 2024 were set during the Departmental Planning and Performance Review conducted by different departments of GSCWD. Scheduled for the whole month of June, each department revisited accomplishments, tackled concerns focusing on improving performance so to help the district in achieving its goals.(LGL)`}
            </label>

            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/gensanwd/posts/pfbid0uRbNVg7KCCC2yutZjxt1x2ge2FD3XcYn9Q2Bc2EVYdccjhCE27m2eB9Xi1Tisp3Xl"
              >
                Read More
              </a>
            </label>
            <img className="w-100 h-100" src="/03.jpg"></img>
          </div>
        </div>

        <div className="keen-slider__slide number-slide1 w-screen h-screen">
          <div className="w-screen h-full bg-gray-100 flex flex-col pt-4 pb-4 pl-8 pr-8 gap-2">
            <label className="text-lg text-slate-600 uppercase">
              Newly Hired Employees
            </label>

            <label className="hidden lg:block text-sm text-slate-500 text-justify">
              {`Congratulations to our newly hired employees who joined our team on July 3, 2023.`}
            </label>

            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/photo/?fbid=314144720967132&set=a.109004071481199"
              >
                Read More
              </a>
            </label>
            <img className="w-100 h-100" src="/04.jpg"></img>
          </div>
        </div>

        <div className="keen-slider__slide number-slide1 w-screen h-screen">
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
        </div>
      </div>
    </>
  );
}
