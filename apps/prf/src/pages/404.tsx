import { PageTitle } from '../components/modular/html/PageTitle';

export default function NotFound() {
  return (
    <>
      <PageTitle title="404 | Not Found" />
      <div className="flex items-center justify-center h-[100vh]">
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold text-gray-700">Not Found!</h1>
          <p className="text-xl text-gray-500">Code 404</p>
        </div>
      </div>
    </>
  );
}
