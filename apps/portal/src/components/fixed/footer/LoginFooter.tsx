import { FunctionComponent } from 'react';

export const LoginFooter: FunctionComponent = () => {
  return (
    <>
      <footer className="mt-12 text-sm text-gray-400">
        <span className="block text-center">Copyright &copy; {new Date().getFullYear()}. All rights reserved.</span>
        <span className="mt-1 block text-center">General Santos City Water District</span>
        <div className="mt-10 flex justify-center gap-3">
          <a href="#" className="text-[0.6rem] hover:underline hover:underline-offset-1">
            Privacy Policy
          </a>
          <a href="#" className="text-[0.6rem] hover:underline hover:underline-offset-1">
            Terms of Use
          </a>
        </div>
      </footer>
    </>
  );
};
