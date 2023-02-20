import { FunctionComponent } from 'react';

export const AuthFooter: FunctionComponent = () => {
  return (
    <>
      <footer className="fixed bottom-10 right-0 left-0 text-sm text-gray-400">
        <span className="block text-center">Copyright &copy; {new Date().getFullYear()}. All rights reserved.</span>
        <span className="mt-1 block text-center">General Santos City Water District</span>
        <div className="mt-3 flex justify-center gap-3">
          <a href="#" className="text-[0.6rem] hover:underline hover:underline-offset-1">
            Terms of Service
          </a>
          <a href="#" className="text-[0.6rem] hover:underline hover:underline-offset-1">
            Privacy Policy
          </a>
        </div>
      </footer>
    </>
  );
};
