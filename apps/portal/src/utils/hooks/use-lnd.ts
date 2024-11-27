import { useAppwriteClient } from '../../components/fixed/appwrite/view/AppwriteContainer';

export const useLnd = () => {
  const client = useAppwriteClient(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_LND!);
  return client;
};
