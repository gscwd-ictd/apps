import * as React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useState } from 'react';

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
        className="keen-slider w-full h-screen pb-10 rounded-lg shadow bg-gray-100"
      >
        <div className="keen-slider__slide number-slide1 w-screen h-screen">
          <div className="w-screen h-full bg-gray-100 flex flex-col pt-4 pb-4 pl-8 pr-8 gap-2">
            <label className="text-lg text-slate-600 uppercase">
              Happy 10 YEARS in SERVICE!
            </label>
            <label className="text-sm text-slate-500 text-justify">
              We wish to greet Engr. Edmund Loquero Badal, a Happy 10 YEARS in
              SERVICE! Please know that you are an important member of GSCWD and
              your abilities and contributions will be an important part of our
              continued success. Thank you for your hardwork and dedication,
              Engr. Edmund!
            </label>
            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/photo/?fbid=241314384916833&set=a.109004071481199"
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
              HEART-SHAPE CHALLENGE
            </label>
            <label className="text-sm text-slate-500 text-justify">
              {`Here's the winners for the WEEK #1 (HEART-SHAPE) CHALLENGE in
              celebration of the Philippine Heart Month!!! First Place - OTS
              Group Second Place - Maam Sha et. al Group Third Place - OGM Group
              Consolation Prize - Other Groups (See Photo posted). Please claim
              your prizes at the HRD Office. Congratulations!`}
            </label>
            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/gensanwd/posts/pfbid02FaPz85w8ePrKffXKz3vA4mGdmzDAf3LMx5aE6JDc3Z59r7hKhjnxUPHY4bQyB997l"
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
              PURPOSE WEDNESDAYS
            </label>
            <label className="text-sm text-slate-500 text-justify">
              Make this your Wednesday habit this month of March! Maki-isa sa
              Purple Wednesdays bilang suporta sa karapatan ng mga kababaihan at
              pagkakapantay-pantay ng kasarian. Just wear anything purple on all
              Wednesdays of March, especially on the International Women’s Day
              on March 8...
            </label>
            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/PCWgovph/photos/a.147213871969647/6384355718255400/"
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
              Webpage for the 2023 National Women’s Month Celebration!
            </label>
            <label className="text-sm text-slate-500 text-justify">
              The 2023 celebration marks a juncture in the advancement of
              women’s rights as it launches a new recurring theme from this year
              to 2028: WE for gender equality and inclusive society. It sparks a
              renewed commitment to the advocacy and banks on the gains achieved
              during the 2016-2022 theme...
            </label>
            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/PCWgovph/photos/a.147213871969647/6291502884207351/"
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
              2023 NWMC Stickers
            </label>
            <label className="text-sm text-slate-500 text-justify">
              {`Share the National Women’s Month vibes! Use the 2023 NWMC Stickers
              for Viber and Telegram and tell your girl tribe, “"You are amazing
              and great!", "You are strong", and "Stand Proud!"...`}
            </label>
            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/PCWgovph/photos/a.147213871969647/6387854251238880/"
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
