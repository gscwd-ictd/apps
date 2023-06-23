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
              {`Men's Month`}
            </label>
            <label className="hidden lg:block text-sm text-slate-500 text-justify">
              {`Shout out to all men out there who despite all odds and obstacles,
              paved the way for themselves in the over-ambitious world. May you
              get more strength and love. Thank you to all your contributions to
              the community. We appreciate all the positive values you bring to
              the world, to your families and to your office colleagues. Happy
              Men's Month! `}
            </label>

            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/gensanwd/posts/pfbid02NWfndy2GRDYeFWJR6XADqWGsobLun5GkDv8rZ1sKuxnJ2cKJuS82jNcas8hqexQhl"
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
              {`Men's Month Schedule of Activities`}
            </label>

            <label className="hidden lg:block text-sm text-slate-500 text-justify">
              {`In celebration of Men's Month, here are the schedule of activities for June 2023.`}
            </label>

            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/gensanwd/posts/pfbid02NWfndy2GRDYeFWJR6XADqWGsobLun5GkDv8rZ1sKuxnJ2cKJuS82jNcas8hqexQhl"
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
              Month of June Birthday Celebrants
            </label>

            <label className="hidden lg:block text-sm text-slate-500 text-justify">
              {`Happy Birthday to all June Celebrants! Here's a short poem for you!
                THE VERY BEST
                Happy Birthday!
                You deserve the very best,
                All the special things in life,
                Whatever makes you happy,
                Whatever feels just right.
                I want these gifts to be yours,
                Each and every day,
                To them, I add love and peace,
                Above all on your birthday.
                -Kevin Nishmas`}
            </label>

            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/gensanwd/videos/568114448560257"
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
              {`Artemio Quimay's Retirement`}
            </label>

            <label className="hidden lg:block text-sm text-slate-500 text-justify">
              {`Mr. Quimay served for 11 years as Water Maintenance Man under the Water Distribution  and Restoration Division. 
                Effective June 6, he will finally leave the district and vow to devote most of his time to his family according to him. `}
            </label>

            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/gensanwd/posts/pfbid0oJy75ZRNKGzq7XooRYshrTnMvzLeNB3HADdzUXGQksPAVwNohzHB1DeQH14oDapGl"
              >
                Read More
              </a>
            </label>
            <img className="w-100 h-100" src="/04.jpg"></img>
          </div>
        </div>
      </div>
    </>
  );
}
