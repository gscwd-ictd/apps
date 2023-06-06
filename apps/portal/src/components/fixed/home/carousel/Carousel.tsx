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
              GSIS Touch
            </label>
            <label className="hidden lg:block text-sm text-slate-500 text-justify">
              To the employees who have not created their GSIS Touch Account,
              please install and create an account now. This is for your
              convenience in applying for loan and in viewing your member
              record. In case you have trouble creating your account, please
              approach us in the HR office so we can assist you. Deadline is
              until Tuesday, May 9.
            </label>

            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/gensanwd/posts/pfbid02FusT4yT54SKdne2Y8oUBmiEECwktdhaYJBsHHRYP4UE1Jz8fwencj43dwRNtndTDl"
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
              Congratulations
            </label>

            <label className="hidden lg:block text-sm text-slate-500 text-justify">
              {`Congratulations to our newly hired Job Order Employees!`}
            </label>

            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/gensanwd/posts/pfbid0awsoJxxwP91amUDka3UAP59VsF9eVAFUh2PcN4Ti6wzVpGgmtbeXMeXXBCwZRw3Kl"
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
              Month of May Birthday Celebrants
            </label>

            <label className="hidden lg:block text-sm text-slate-500 text-justify">
              {`Happy Birthday to all May Celebrants! Here's a short poem for you!
              Unforgettable Birthday I'm wishing you a birthday You never will
              forget, A day packed full of pleasure, Your very best birthday
              yet. And when your birthday's over, I'm wishing quite sincerely
              That happiness and joy and fun Will fill your birthdays yearly! By
              Joanna Fuchs`}
            </label>

            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/gensanwd/videos/189948873930324"
              >
                Read More
              </a>
            </label>
            <img className="w-100 h-100" src="/03.jpg"></img>
          </div>
        </div>
      </div>
    </>
  );
}
