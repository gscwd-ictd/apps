import type { NextApiRequest, NextApiResponse } from 'next';
import { Data } from 'types/data/pds.type';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    // const response = await fetch(process.env.NEXT_PUBLIC_PORTAL_URL + '/api/pds/' + req.query.applicantId);
    const response = await fetch(process.env.NEXT_PUBLIC_PORTAL_BE_URL + '/pds/v2/' + req.query.applicantId);

    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {}
}
