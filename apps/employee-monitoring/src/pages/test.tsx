import { Button } from '@gscwd-apps/oneui';

export default function Test() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Button
        onClick={() => {
          if (process.env.NODE_ENV === 'production') {
            console.log('fetch from server');
          } else if (process.env.NODE_ENV === 'development') {
            console.log('fetch from local');
          }
        }}
      >
        Click me
      </Button>
    </div>
  );
}
