import { Button, NotificationController, useNotification } from '@gscwd-apps/oneui';
import { isEmpty } from 'lodash';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getUserDetails, withCookieSession } from '../utils/helpers/session';

export default function Index() {
  const { notifRef, notify } = useNotification();

  const showNotification = () => {
    const notification = notify.custom(
      <div className="p-5 border rounded shadow-lg w-96 shadow-slate-100">
        <div className="flex justify-between">
          <p>Hello Notification</p>
          <button onClick={() => notify.dismiss(notification.id)}>x</button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-center w-screen h-screen">
        <Button onClick={showNotification}>Notify me</Button>
      </div>

      <NotificationController ref={notifRef} autoClose={true} duration={5000} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(async () => {
  const userDetails = getUserDetails();
  if (!isEmpty(userDetails.employmentDetails.userId)) {
    return {
      props: {},
      redirect: {
        destination: `/${userDetails.employmentDetails.userId}`,
        permanent: false,
      },
    };
  } else
    return {
      props: {},
      redirect: { destination: '/login', permanent: false },
    };
});
