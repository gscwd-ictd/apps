export default function Email() {
  return (
    <>
      <div className="min-h-screen bg-white">
        <header className="shadow ">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900"> Email verification sent </h1>
          </div>
        </header>
        <main>
          <div className="h-[44rem] w-full">
            <div className="flex h-full w-full items-center justify-center text-3xl">
              <div className=" ">
                We&apos;ve sent you the verification link to your email address. Please check your inbox.
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
