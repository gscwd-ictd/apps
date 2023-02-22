// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { readFileSync } from 'fs'
import Cors from 'cors'

const cors = Cors({
  methods: ['GET', 'HEAD'],
})

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  const barangays = JSON.parse(readFileSync('./utils/assets/barangays.json', 'utf-8'))
  runMiddleware(req, res, cors)
  res.status(200).json(barangays)
}

export const config = {
  api: {
    responseLimit: false,
  },
}
