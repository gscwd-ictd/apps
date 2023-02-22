export const Footers = (): JSX.Element => {
  return (
    <footer className="fixed bottom-0 w-full cursor-default select-none">
      <div className="flexjustify-center gap py-7 text-sm text-gray-400">
        <span className="block text-center">
          Copyright &copy; {new Date().getFullYear()}. All rights reserved | General Santos City Water District
        </span>
      </div>
    </footer>
  );
};
