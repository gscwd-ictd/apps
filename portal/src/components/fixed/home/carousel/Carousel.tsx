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
        className="keen-slider w-full h-full pb-10 rounded-lg shadow bg-gray-100"
      >
        <div className="keen-slider__slide number-slide1 w-screen h-screen">
          <div className="w-screen h-full bg-gray-100 flex flex-col pt-4 pb-4 pl-8 pr-8 gap-4">
            <label className="text-lg text-slate-600 uppercase">
              23 MAY a simple celebration this 2020
            </label>
            <label className="text-sm text-slate-500 text-justify">
              It is true. The corona virus pandemic has changed ways of
              celebrating family, friendships, love and achievements from beer
              with friends to virtual toast, from cupcake to share to blowing
              candles on screen, from physical hugs to window kisses. Not that
              fun. Not that cheerful. For General Santos City Water District,
              2020 will be empty without honoring its special day. With the
              theme Rising Beyond, GSCWD decided to meet digitally to celebrate
              its 33rd anniversary on August 19, commemorating its incredible
              journey of public service.
            </label>
            <label className="text-right text-sm text-slate-500 cursor-pointer">
              Read More
            </label>
            <img className="w-full h-auto" src="/image1.jpg"></img>
          </div>
        </div>
        <div className="keen-slider__slide number-slide2 w-screen h-screen">
          <div className="w-screen h-full bg-gray-100 flex flex-col pt-4 pb-4 pl-8 pr-8 gap-4">
            <label className="text-lg text-slate-600 uppercase">
              18 MAY GSCWD CONTINUES TO FULFILL ITS RESPONSIBILITY TO THE PUBLIC
            </label>
            <label className="text-sm text-slate-500 text-justify">
              As a government entity in the sphere of water industry, General
              Santos City Water District believes that its role in the community
              goes beyond water distribution and wastewater services. For over
              the past years, the District is active in implementing projects
              and programs that focuses on infrastructure, socio-economic
              development, environment protection. It can be remembered that the
              city council commended GSCWD for its remarkable contribution to
              the vision of the City for its constituents.
            </label>
            <label className="text-right text-sm text-slate-500 cursor-pointer">
              Read More
            </label>
            <img className="w-full h-auto" src="/image2.jpg"></img>
          </div>
        </div>
        <div className="keen-slider__slide number-slide3 w-screen h-screen">
          <div className="w-screen h-full bg-gray-100 flex flex-col pt-4 pb-4 pl-8 pr-8 gap-4 justify-between">
            <div className="w-full h-full flex flex-col">
              <label className="text-lg text-slate-600 uppercase">
                18 MAY GSCWD CELEBRATES GLOBAL HANDWASHING DAY 2020
              </label>
              <label className="text-sm text-slate-500 text-justify">
                Covid-19 will never stop General Santos City Water District in
                implementing its hygiene education and sanitation projects. To
                further promote regular handwashing to contain infectious
                diseases, handwashing facilities are now installed at some
                public places in General Santos City. One set of handwashing
                station was conveniently placed in Bulaong Bus Terminal and two
                other sets were put up in the entrance and exit of the City
                Public Market. The project is initiated as part of the
                District’s celebration of Global Handwashing Day 2020 in
                partnership with the Local Government of GSC,
                USAID-Strengthening Urban Resilience for Growth with Equity
                (SURGE), South Cotabato Filipino-Chinese Chamber Inc. (SCFCCI),
                General Santos City Chamber of Commerce and Industry Inc.
                (GSCCCI).
              </label>
              <label className="text-right text-sm text-slate-500 cursor-pointer">
                Read More
              </label>
            </div>
            <img className="w-full h-auto" src="/image3.jpg"></img>
          </div>
        </div>
      </div>
    </>
  );
}
