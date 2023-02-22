import {
  Button,
  NotificationController,
  useNotification,
} from '@gscwd-apps/oneui';

export default function Index() {
  const { notifRef, notify } = useNotification();

  const showNotification = () => {
    const notification = notify.custom(
      <div className="w-96 p-5 border rounded shadow-lg shadow-slate-100">
        <div className="flex justify-between">
          <p>Hello Notification</p>
          <button onClick={() => notify.dismiss(notification.id)}>x</button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center">
        <Button onClick={showNotification}>Notify me</Button>
      </div>

      <NotificationController ref={notifRef} autoClose={true} duration={5000} />
    </>
  );
}
