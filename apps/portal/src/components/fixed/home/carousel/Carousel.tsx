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
            <img className="w-100 h-100" src="/03.jpg"></img>
          </div>
        </div>
<<<<<<< HEAD
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
        <div className="keen-slider__slide number-slide1 w-screen h-screen">
          <div className="w-screen h-full bg-gray-100 flex flex-col pt-4 pb-4 pl-8 pr-8 gap-2">
            <label className="text-lg text-slate-600 uppercase">
              {`Welcome Newly Hired Job-Order`}
            </label>

            <label className="hidden lg:block text-sm text-slate-500 text-justify">
              {`LOOK | Orientation, Induction and Contract Signing of newly hired Job-Order employees under Accounting & Financial Management Department, Pipeline & Appurtenances Maintenance Department, and Procurement, Quality Control and Property Division. `}
            </label>

            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/gensanwd/posts/pfbid02uWby1xNs7nkx2FHqiqmDL91HvYSCm2pSzmTKyWqmfqBzXvajXBPCKrm84Li1FVVel"
              >
                Read More
              </a>
            </label>
            <img className="w-100 h-100" src="/05.jpg"></img>
          </div>
        </div>

        <div className="keen-slider__slide number-slide1 w-screen h-screen">
          <div className="w-screen h-full bg-gray-100 flex flex-col pt-4 pb-4 pl-8 pr-8 gap-2">
            <label className="text-lg text-slate-600 uppercase">
              {`Corporate Film-Making Workshop`}
            </label>

            <label className="hidden lg:block text-sm text-slate-500 text-justify">
              {`Congratulations to all participants of the 3-day Corporate Film-Making Workshop held on June 21-23, 2023 at GSCWD. Thank you to the award-winning Director, Alan Filoteo for sharing his expertise and knowledge.`}
            </label>

            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/photo/?fbid=302867672094837&set=a.107191734995766"
              >
                Read More
              </a>
            </label>
            <img className="w-100 h-100" src="/06.jpg"></img>
          </div>
        </div>

        <div className="keen-slider__slide number-slide1 w-screen h-screen">
          <div className="w-screen h-full bg-gray-100 flex flex-col pt-4 pb-4 pl-8 pr-8 gap-2">
            <label className="text-lg text-slate-600 uppercase">
              {`Tagum City Water District Benchmarking`}
            </label>

            <label className="hidden lg:block text-sm text-slate-500 text-justify">
              {`Tagum City Water District headed by its Acting General Manager, Gerardo De Leon asks GSCWD to be its external benchmarking partner to gain knowledge and best practices on our compliance to environmental laws. `}
            </label>

            <label className="text-right text-sm text-slate-500 cursor-pointer">
              <a
                target="blank"
                href="https://www.facebook.com/gensanwd/posts/pfbid02LKzoLDoRBM6C7k8Rg6KJWBxqp9wLHf9zNJRWWFUF8hHgCj13MGjrGcnbaoz8u2Apl"
              >
                Read More
              </a>
            </label>
            <img className="w-100 h-100" src="/07.jpg"></img>
          </div>
        </div>
=======
>>>>>>> 3a130322bebcc901d48e518732cbe747057ea8c8
      </div>
    </>
  );
}
