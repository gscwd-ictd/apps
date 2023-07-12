import { HiXCircle } from 'react-icons/hi';

export const AppEndAlertFail = () => {
  return (
    <>
      <div className="w-full">
<<<<<<< HEAD
        <div className="flex gap-2 items-center">
=======
        <div className="flex items-center gap-2">
>>>>>>> 3a130322bebcc901d48e518732cbe747057ea8c8
          <HiXCircle className="text-red-500 animate-pulse" size={30} />
          <span className="text-2xl">Success</span>
        </div>
        <hr />
        <div className="px-5 text-lg font-light bg-inherit">
          A problem has been encountered. Please try again later.
        </div>
      </div>
    </>
  );
};
