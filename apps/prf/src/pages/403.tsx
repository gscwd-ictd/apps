import Head from 'next/head';
import { PageTitle } from '../components/modular/html/PageTitle';

export default function Forbidden() {
  return (
    <>
      <PageTitle title="403 | Forbidden" />
      <div className="flex items-center justify-center h-[100vh]">
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold text-gray-700">Forbidden!</h1>
          <p className="text-xl text-gray-500">Code 403</p>
        </div>
      </div>
    </>
  );
}
